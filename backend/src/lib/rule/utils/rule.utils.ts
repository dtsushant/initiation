import {
    getRuleFieldMeta,
    getRuleFieldMetaWithOptions,
    RuleFieldMetadata,
    RuleInputFieldMetadata, RuleOutputFieldMetadata
} from "../rule-field.decorator";

export function extractRuleFieldMetadata(instance: any): Record<string, RuleFieldMetadata> {
    const allFields = getRuleFieldMetaWithOptions(instance);

    return Object.entries(allFields).reduce((acc, [key, meta]) => {
            const typeFn = meta.fnType;

            if ((meta.type !== 'array' && (meta.type === 'object' || !isPrimitive(meta.type))) && typeFn) {
                const nested = extractRuleFieldMetadata(new (typeFn())());
                acc[key] = {
                    ...meta,
                    fields: nested,
                };
            } else if (meta.type === 'array' && typeFn) {
                try {
                    const type = getArrayElementTypeString(typeFn);
                    let nested = extractRuleFieldMetadata(new (typeFn())());
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


        return acc;
    }, {} as Record<string, RuleFieldMetadata>);
}
function isInputField(meta: RuleFieldMetadata): meta is RuleInputFieldMetadata {
    return 'comparators' in meta;
}

function isOutputField(meta: RuleFieldMetadata): meta is RuleOutputFieldMetadata {
    return 'setter' in meta;
}
export function normalizeInputMetadata(
    raw: Record<string, RuleFieldMetadata>
): Record<string, RuleInputFieldMetadata> {
    const cleaned: Record<string, RuleInputFieldMetadata> = {};

    for (const [key, field] of Object.entries(raw)) {
        if (!isInputField(field)) continue;

        const input: RuleInputFieldMetadata = {
            name: field.name,
            type: field.type,
            getter: field.getter,
            comparators: field.comparators ?? [],
            valueToCompare: field.valueToCompare,
        };

        if (field.fields) {
            input.nested = normalizeInputMetadata(field.fields);
        }

        cleaned[key] = input;
    }

    return cleaned;
}

export function normalizeOutputMetadata(
    raw: Record<string, RuleFieldMetadata>
): Record<string, RuleOutputFieldMetadata> {
    const cleaned: Record<string, RuleOutputFieldMetadata> = {};

    for (const [key, field] of Object.entries(raw)) {
        if (!isOutputField(field)) continue;

        const output: RuleOutputFieldMetadata = {
            name: field.name,
            type: field.type,
            getter: field.getter,
            setter: field.setter!,
        };

        if (field.fields) {
            output.nested = normalizeOutputMetadata(field.fields);
        }

        cleaned[key] = output;
    }

    return cleaned;
}

function isPrimitive(type: string) {
    return ['string', 'number', 'boolean', 'date'].includes(type);
}

function nullSafe(path: string): string {
    return path
        .split(/\.|\?\./) // split on both '.' and '?.'
        .filter(Boolean)
        .join('?.');
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
        const hasNestedFields = isNonEmptyObject(meta.nested);

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
                meta.nested,
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
    const flat = flattenRuleMetadata(extractRuleFieldMetadata(instance));
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
