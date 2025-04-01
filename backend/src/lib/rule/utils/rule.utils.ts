import {getRuleFieldMeta, getRuleFieldMetaWithOptions, RuleInputFieldMetadata} from "../rule-field.decorator";

export function extractInputMetadata(instance: any): Record<string, RuleInputFieldMetadata> {
    const allFields = getRuleFieldMetaWithOptions(instance);

    return Object.entries(allFields).reduce((acc, [key, meta]) => {
        if ('comparators' in meta) {
            const typeFn = meta.fnType;

            if ((meta.type !== 'array' && (meta.type === 'object' || !isPrimitive(meta.type))) && typeFn) {
                const nested = extractInputMetadata(new (typeFn())());
                acc[key] = {
                    ...meta,
                    fields: nested,
                };
            } else if (meta.type === 'array' && typeFn) {
                try {
                    const type = getArrayElementTypeString(typeFn);
                    let nested = extractInputMetadata(new (typeFn())());
                    acc[key] = {
                        ...meta,
                        type: type,
                        fields: nested,
                    };
                }catch{
                    acc[key] = meta;
                }
            } else {
                acc[key] = meta;
            }
        }

        return acc;
    }, {} as Record<string, RuleInputFieldMetadata>);
}
export function extractOutputMetadata(instance: any) {
    const allFields = getRuleFieldMeta(instance);

    return Object.entries(allFields).reduce((acc, [key, meta]) => {
        if ('setter' in meta) {
            acc[key] = {
                name: meta.name,
                type: meta.type,
                getter: meta.getter,
                setter: meta.setter,
            };
        }
        return acc;
    }, {} as Record<string, any>);
}

function isPrimitive(type: string) {
    return ['string', 'number', 'boolean', 'date'].includes(type);
}



/*export function flattenRuleMetadata(
    nested: Record<string, any>,
    parentKey = '',
    accessor = 'this'
): Record<string, any> {
    const flat: Record<string, any> = {};

    for (const [key, meta] of Object.entries(nested)) {
        const isObjectArray = meta.type === 'object[]';
        const isPlainObject = meta.type === 'object';
        const hasNestedFields = isNonEmptyObject(meta.fields);

        const keyWithIndex = isObjectArray ? `${key}[$index]` : key;
        const path = parentKey ? `${parentKey}.${keyWithIndex}` : keyWithIndex;
        const accessorPath = accessor ? `${accessor}.${keyWithIndex}` : keyWithIndex;

        if (hasNestedFields && isObjectArray) {
            // Flatten child fields individually with .map accessors
            for (const [childKey, rawMeta] of Object.entries(meta.fields ?? {})) {
                const childMeta = typeof rawMeta === 'object' && rawMeta !== null ? rawMeta : {};
                const childPath = `${path}.${childKey}`;
                const getter = `${accessor}.${key}.map(i => i.${childKey})`;
                const setter = `${accessor}.${key}.map(i => i.${childKey} = value)`;

                flat[childPath] = {
                    ...childMeta,
                    getter,
                    setter,
                };
            }
        } else if (hasNestedFields) {
            const nestedFlat = flattenRuleMetadata(meta.fields, path, accessorPath);
            Object.assign(flat, nestedFlat);
        } else {
            flat[path] = {
                ...meta,
                getter: accessorPath,
                setter: `${accessorPath} = value`,
            };
        }
    }

    return flat;
}*/



function nullSafe(path: string): string {
    return path
        .split(/\.|\?\./) // split on both '.' and '?.'
        .filter(Boolean)
        .join('?.');
}

function buildNullSafeMapExpression(baseAccessor: string, fullFieldPath: string): string {
    const pathParts = fullFieldPath.split('.').filter(Boolean);
    const insideMap = pathParts.map(p => `i?.${p}`).join('.');
    return `${nullSafe(baseAccessor)}?.map(i => ${insideMap})`;
}

export function flattenRuleMetadata(
    nested: Record<string, any>,
    parentKey = '',
    accessor = 'this',
    arrayDepth = 0
): Record<string, any> {
    const flat: Record<string, any> = {};

    for (const [key, meta] of Object.entries(nested)) {
        const isArray = meta.type?.endsWith('[]');
        const isObject = meta.type === 'object';
        const hasNestedFields = isNonEmptyObject(meta.fields);

        // Construct key with index notation for arrays
        const indexedKey = isArray ? `${key}[$index${arrayDepth}]` : key;
        const path = parentKey ? `${parentKey}.${indexedKey}` : indexedKey;

        // Accessor remains simple dot notation
        const accessorPath = accessor ? `${accessor}.${key}` : key;

        // 1. Include parent field if it's object or object[]
        if (isArray || hasNestedFields) {
            const baseAccessor = nullSafe(accessorPath);
            flat[path] = {
                ...meta,
                getter: baseAccessor,
                setter: `(value) => ${baseAccessor} = value`,
                comparators: isArray
                    ? ['CONTAINS', 'NOT_CONTAINS']
                    : ['IS_NULL', 'IS_NOT_NULL'],
            };
        }

        // 2. Recursively flatten nested fields
        if (hasNestedFields) {
            const childDepth = isArray ? arrayDepth + 1 : arrayDepth;
            const nestedFlat = flattenRuleMetadata(
                meta.fields,
                path,
                accessorPath,
                childDepth
            );
            Object.assign(flat, nestedFlat);
        } else if (!isArray && !isObject) {
            // 3. Primitive value — flatten normally
            const safeAccessor = nullSafe(accessorPath);
            flat[path] = {
                ...meta,
                getter: safeAccessor,
                setter: `(value) => ${safeAccessor} = value`,
            };
        }
    }

    return flat;
}



export function toJsonSchema(flatMeta: Record<string, any>) {
    const schema: any = {
        type: 'object',
        properties: {},
    };

    for (const [path, meta] of Object.entries(flatMeta)) {
        schema.properties[path] = {
            title: meta.name,
            type: meta.type === 'number' ? 'number' : meta.type === 'boolean' ? 'boolean' : 'string',
            comparators: meta.comparators,
            valueToCompare: meta.valueToCompare,
        };
    }

    return schema;
}

export function validateRuleInput(instance: any): string[] {
    const flat = flattenRuleMetadata(extractInputMetadata(instance));
    const errors: string[] = [];

    for (const [path, meta] of Object.entries(flat)) {
        const val = path.split('.').reduce((acc, key) => acc?.[key], instance);
        if (meta.validate) {
            const result = meta.validate(val);
            if (result !== true) errors.push(`Validation failed for ${path}: ${result}`);
        }
    }

    return errors;
}

export function getArrayElementTypeString(typeFn: () => any): string {
    if (!typeFn || typeof typeFn !== 'function') return 'unknown[]';

    const constructor = typeFn();

    if (!constructor) return 'unknown[]';

    // Detect primitive constructors directly
    if (constructor === String) return 'string[]';
    if (constructor === Number) return 'number[]';
    if (constructor === Boolean) return 'boolean[]';
    if (constructor === Date) return 'date[]';

    // If it's not a known primitive, assume it's a class = object[]
    return 'object[]';
}

function isNonEmptyObject(obj: any): boolean {
    return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}
