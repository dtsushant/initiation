import {Comparator} from "../rule.enum";
import {getRuleFieldMeta, getRuleFieldMetaWithOptions, RuleInputFieldMetadata} from "../rule-field.decorator";

export function getDefaultComparatorsForType(type: string): Comparator[] {
    switch (type) {
        case 'number':
        case 'date':
            return [
                Comparator.EQUALS,
                Comparator.NOT_EQUALS,
                Comparator.GREATER_THAN,
                Comparator.LESS_THAN,
                Comparator.GREATER_THAN_OR_EQUAL,
                Comparator.LESS_THAN_OR_EQUAL,
                Comparator.BETWEEN,
            ];
        case 'string':
            return [
                Comparator.EQUALS,
                Comparator.NOT_EQUALS,
                Comparator.IN,
                Comparator.NOT_IN,
            ];
        case 'boolean':
            return [Comparator.EQUALS, Comparator.NOT_EQUALS];
        default:
            return [Comparator.EQUALS];
    }
}

/*
export function extractInputMetadata(instance: any) {
    const allFields = getRuleFieldMeta(instance);

    return Object.entries(allFields).reduce((acc, [key, meta]) => {
        if ('comparators' in meta) {
            acc[key] = {
                name: meta.name,
                type: meta.type,
                getter: meta.getter,
                comparators: meta.comparators,
                valueToCompare: meta.valueToCompare,
            };
        }
        return acc;
    }, {} as Record<string, any>);
}
*/
export function extractInputMetadata(instance: any): Record<string, RuleInputFieldMetadata> {
    const allFields = getRuleFieldMetaWithOptions(instance);

    return Object.entries(allFields).reduce((acc, [key, meta]) => {
        if ('comparators' in meta) {
            const typeFn = meta.__options__?.fnType;

            if (meta.type === 'object' && typeFn) {
                const nested = extractInputMetadata(new (typeFn())());
                acc[key] = {
                    ...meta,
                    fields: nested,
                };
            } else if (meta.type === 'array' && typeFn) {
                const nested = extractInputMetadata(new (typeFn())());
                acc[key] = {
                    ...meta,
                    type: 'object[]',
                    fields: nested,
                };
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
