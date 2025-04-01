export enum Comparator {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    GREATER_THAN = 'GREATER_THAN',
    GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
    IN = 'IN',
    NOT_IN = 'NOT_IN',
    CONTAINS = 'CONTAINS',
    STARTS_WITH = 'STARTS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    BETWEEN = 'BETWEEN'
}

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