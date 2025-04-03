import {BaseRuleInput, BaseRuleOutput} from "../../../lib/rule/rule-base";
import {RuleField, RuleInput, RuleOutput} from "../../../lib/rule/rule-field.decorator";
import {Comparator} from "../../../lib/rule/rule.enum";
import {RuleDefinition} from "../../../lib/rule/rule.interface";

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

export class PricingRuleDocument<
    T extends BasePricingInput = BasePricingInput,
    U extends BasePricingOutput = BasePricingOutput
> implements RuleDefinition<T, U> {


}
