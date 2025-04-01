import {BaseRuleInput, BaseRuleOutput} from "../../../lib/rule/rule-base";
import {RuleField, RuleInput, RuleOutput} from "../../../lib/rule/rule-field.decorator";
import {RuleDocument, RuleMeta, RuleProcess} from "../../../lib/rule/rule.interface";
import {Comparator} from "../../../lib/rule/rule.enum";

@RuleInput({
    name: 'BasePricingInput',
    description: 'Base Pricing Input',
    source: 'Categorized Inventory',
})
export class BasePricingInput extends BaseRuleInput {
    @RuleField({ name: 'Amount', comparators: [Comparator.GREATER_THAN] })
    amount!: number;

    @RuleField({ name: 'Currency', comparators: [Comparator.EQUALS] })
    currency!: string;

    @RuleField({name:'True Statement'})
    isTrue!: boolean;

    /*constructor(amount: number, currency: string) {
        super();
        this.amount = amount;
        this.currency = currency;
    }*/

    constructor() {
        super();
    }
}

@RuleOutput({
    name: 'BasePricingOutput',
    description: 'Base Pricing Output',
    destination: 'Categorized Inventory',
})
export class BasePricingOutput extends BaseRuleOutput {
    @RuleField({ name: 'Discounted Amount' })
    discountedAmount!: number;

    @RuleField({name:'Applied Rule Id'})
    appliedRuleId?: string;

    constructor() {
        super();

    }
}

// RuleDocument<T, U> expects T extends RuleInput, U extends RuleOutput
export interface BasePricingRuleDocument<
    T extends BasePricingInput = BasePricingInput,
    U extends BasePricingOutput = BasePricingOutput
> extends RuleDocument<T, U> {
    meta: RuleMeta;
    process: RuleProcess;
    input: T;
    output?: U;
}
