// rule-field.decorator.ts
import 'reflect-metadata';
import {Comparator, getDefaultComparatorsForType} from "./rule.enum";

export const RULE_INPUT_META_KEY = Symbol('rule:input-meta');
export const RULE_OUTPUT_META_KEY = Symbol('rule:output-meta');
export const RULE_FIELDS_KEY = Symbol('rule:fields');


type RuleValidatorFn = (value: any) => boolean | string;

export interface CommonRuleFieldMetadata {
    name: string;
    getter: string;
    type: string;
    fnType?: () => new () => any;
    validate?: RuleValidatorFn;
}

export interface RuleInputFieldMetadata extends CommonRuleFieldMetadata {
    comparators: Comparator[];
    valueToCompare: any;
    fields?: Record<string, RuleInputFieldMetadata>;
}

export interface RuleOutputFieldMetadata extends CommonRuleFieldMetadata {
    setter: string;
    fields?: Record<string, RuleOutputFieldMetadata>;
}


type RuleFieldDecoratorOptions =
    |  (Partial<Pick<RuleInputFieldMetadata, 'name' | 'valueToCompare'|'fnType'>> & {
    comparators?: Comparator[];
    inputOnly?: true;
})
    | (Partial<Pick<RuleOutputFieldMetadata, 'name'|'fnType'>> & {
    inputOnly?: false;
});


type RuleFieldMetadata = RuleInputFieldMetadata | RuleOutputFieldMetadata;

/*export function RuleField(options: RuleFieldDecoratorOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        const inferredType = type?.name?.toLowerCase?.() ?? 'unknown';

        const base: CommonRuleFieldMetadata = {
            name: options.name ?? propertyKey.toString(),
            type: inferredType,
            getter: `this.${propertyKey.toString()}`,
        };

        // Always assume input field unless overridden at runtime
        const fieldMeta: RuleFieldMetadata = {
            ...base,
            comparators: (options as any).comparators ?? getDefaultComparatorsForType(inferredType),
            valueToCompare: (options as any).valueToCompare,
            setter: `this.${propertyKey.toString()} = value`, // This will be ignored by input types
        };

        const existing: Record<string, RuleFieldMetadata> =
            Reflect.getMetadata(RULE_FIELDS_KEY, target.constructor) || {};

        Reflect.defineMetadata(
            RULE_FIELDS_KEY,
            {
                ...existing,
                [propertyKey.toString()]: fieldMeta,
            },
            target.constructor
        );
    };
}*/

export function RuleField(options: RuleFieldDecoratorOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const key = propertyKey.toString();
       // console.log("the key decorated",key);

        // Use typeFn if provided; fallback to reflect-metadata
        const reflectedType = Reflect.getMetadata('design:type', target, propertyKey);
        const resolvedType = options.fnType?.() ?? reflectedType;
        const inferredType = resolvedType?.name?.toLowerCase?.() ?? 'unknown';
        console.log("reflected, resolved and inferred",key,reflectedType,resolvedType,inferredType);

        // If type is complex and typeFn is missing, warn or throw
        const isComplexType = inferredType === 'object' || inferredType === 'array';

        if (isComplexType && !options.fnType) {
            console.warn(
                `@RuleField(${key}): fnType is recommended for complex types like objects or arrays.`
            );
        }

        const base: CommonRuleFieldMetadata = {
            name: options.name ?? key,
            type: reflectedType?.name?.toLowerCase?.() ?? 'unknown',
            getter: `this.${key}`,
        };

        /*const fieldMeta: RuleFieldMetadata = {
            ...base,
            setter: `this.${key} = value`,
        };*/

        const fieldMeta: RuleFieldMetadata = {
            ...base,
            comparators: (options as any).comparators ?? getDefaultComparatorsForType(inferredType),
            valueToCompare: (options as any).valueToCompare,
            setter: `this.${propertyKey.toString()} = value`,
            fnType: (options as any).fnType
        };

        const existing: Record<string, RuleFieldMetadata> =
            Reflect.getMetadata(RULE_FIELDS_KEY, target.constructor) || {};

        Reflect.defineMetadata(
            RULE_FIELDS_KEY,
            {
                ...existing,
                [key]: fieldMeta,
            },
            target.constructor
        );
    };
}





export function getRuleFields(target: any): string[] {
    const fields = Reflect.getMetadata(RULE_FIELDS_KEY, target.constructor) || {};
    return Object.keys(fields);
}

export function getRuleFieldMeta(target: any): Record<string, RuleFieldMetadata> {
    return Reflect.getMetadata(RULE_FIELDS_KEY, target.constructor) || {};
}



export interface RuleInputMetadata {
    name: string;
    description?: string;
    source: string;
}

export interface RuleOutputMetadata {
    name: string;
    description?: string;
    destination: string;
}

export function RuleInput(metadata: RuleInputMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(RULE_INPUT_META_KEY, metadata, target);
    };
}

export function RuleOutput(metadata: RuleOutputMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(RULE_OUTPUT_META_KEY, metadata, target);
    };
}

export function getRuleInputMeta(target: any): RuleInputMetadata | undefined {
    return Reflect.getMetadata(RULE_INPUT_META_KEY, target.constructor);
}

export function getRuleOutputMeta(target: any): RuleOutputMetadata | undefined {
    return Reflect.getMetadata(RULE_OUTPUT_META_KEY, target.constructor);
}

export function isRuleInput(instance: any): boolean {
    return Reflect.hasMetadata(RULE_INPUT_META_KEY, instance.constructor);
}

export function isRuleOutput(instance: any): boolean {
    return Reflect.hasMetadata(RULE_OUTPUT_META_KEY, instance.constructor);
}

export function getRuleFieldMetaWithOptions(instance: any): Record<string, RuleFieldMetadata & { __options__?: RuleFieldDecoratorOptions }> {
    return Reflect.getMetadata(RULE_FIELDS_KEY, instance.constructor) || {};
}
