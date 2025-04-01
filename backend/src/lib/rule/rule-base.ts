// rule-base.ts
import {getRuleFields, getRuleInputMeta, getRuleOutputMeta, RULE_INPUT_META_KEY} from './rule-field.decorator';
import {RuleInput, RuleOutput} from "./rule.interface";
import {extractInputMetadata, extractOutputMetadata} from "./utils/rule.utils";

export abstract class BaseRuleInput implements RuleInput {

    protected constructor() {
        this.validateRuleFields();
        this.validateClassMetadata();
    }

    public getFieldMetadata() {
        return extractInputMetadata(this);
    }
    private validateRuleFields() {
        const decorated = getRuleFields(this);
        const actualFields = Object.getOwnPropertyNames(this);
        const missing = actualFields.filter(field => !decorated.includes(field));
        if (missing.length) {
            throw new Error(`Missing @RuleField decorator on: ${missing.join(', ')}`);
        }
    }

    private validateClassMetadata() {
        const meta = getRuleInputMeta(this);

        if (!meta) {
            Reflect.defineMetadata(RULE_INPUT_META_KEY, {
                name: this.constructor.name,
                description: `${this.constructor.name} (auto-generated)`,
                source: 'Unknown',
            }, this.constructor);
        } else if (!meta.name || !meta.source) {
            throw new Error(`Missing or incomplete @RuleInput metadata on class.`);
        }
    }
}

export abstract class BaseRuleOutput implements RuleOutput {
    constructor() {
        this.validateRuleFields();
        this.validateClassMetadata();
    }

    public getFieldMetadata() {
        return extractOutputMetadata(this);
    }
    private validateRuleFields() {
        const decorated = getRuleFields(this);
        const actualFields = Object.getOwnPropertyNames(this);
        const missing = actualFields.filter(field => !decorated.includes(field));
        if (missing.length) {
            throw new Error(`Missing @RuleField decorator on: ${missing.join(', ')}`);
        }
    }

    private validateClassMetadata() {
        const meta = getRuleOutputMeta(this);
        if (!meta?.name || !meta?.destination) {
            throw new Error(`Missing or incomplete @RuleOutput metadata on class.`);
        }
    }
}
