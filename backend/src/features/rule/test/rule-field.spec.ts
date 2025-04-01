import {getRuleFieldMeta, RuleField, RuleInput} from "../../../lib/rule/rule-field.decorator";
import {BasePricingInput, BasePricingOutput} from "../document/base-pricing.rule";
import {BaseRuleInput} from "../../../lib/rule/rule-base";
import {Comparator} from "../../../lib/rule/rule.enum";

describe('RuleField metadata extraction', () => {
    it('should extract values using getter string from metadata', () => {
        /*const input = new BasePricingInput();

        const output = new BasePricingOutput();

        const inputMetadata = input.getFieldMetadata();

        console.log(inputMetadata);

        console.log(output.getFieldMetadata())*/

        const testInput = new ComplexInput()

        console.log(testInput.getFieldMetadata());

        /*for (const [key, meta] of Object.entries(metadata)) {
            // eslint-disable-next-line no-eval
            const extractedValue = eval(meta.getter);
            const actualValue = (input as any)[key];

            expect(extractedValue).toEqual(actualValue);
        }*/
    });
});

@RuleInput({
    name: 'Customer Info',
    source: 'Nested',
})
class CustomerInfo extends BaseRuleInput {
    @RuleField({ name: 'ID' }) id!: string;
    @RuleField({ name: 'Email' }) email!: string;
    constructor() {
        super();
    }
}

@RuleInput({
    name: 'Item',
    source: 'Nested',
})
class ItemInput extends BaseRuleInput {
    @RuleField({ name: 'SKU' }) sku!: string;
    @RuleField({ name: 'Quantity' }) quantity!: number;
    constructor() {
        super();
    }
}
@RuleInput({
    name: 'Complex Input',
    source: 'API',
})
class ComplexInput extends BaseRuleInput {
    @RuleField({ fnType:() => CustomerInfo,name: 'Customer'})
    customer!: CustomerInfo;

    @RuleField({  name: 'Tags'})
    tags!: string[];

    @RuleField({ fnType:() => ItemInput,name: 'Items' })
    items!: ItemInput[];

    constructor() {
        super();
    }
}


