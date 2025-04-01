import {getRuleFieldMeta, RuleField, RuleInput} from "../../../lib/rule/rule-field.decorator";
import {BasePricingInput, BasePricingOutput} from "../document/base-pricing.rule";
import {BaseRuleInput} from "../../../lib/rule/rule-base";
import {Comparator} from "../../../lib/rule/rule.enum";
import {flattenRuleMetadata} from "../../../lib/rule/utils/rule.utils";

describe('RuleField metadata extraction', () => {
    it('should extract values using getter string from metadata', () => {
        /*const input = new BasePricingInput();

        const output = new BasePricingOutput();

        const inputMetadata = input.getFieldMetadata();

        console.log(inputMetadata);

        console.log(output.getFieldMetadata())*/

        const testInput = new ComplexInput()

       // console.log(JSON.stringify(testInput.getFieldMetadata(), null, 2));
;
        const metadata = testInput.getFieldMetadata();
        console.log("the meta unflattened",metadata);
        const flattened = flattenRuleMetadata(testInput.getFieldMetadata())

        console.log(flattened)
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
    @RuleField({ name: 'Customer',fnType:() => CustomerInfo }) customer!: CustomerInfo[];

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

    @RuleField({ name: 'Tags', fnType: () => String })
    tags!: string[];

    @RuleField({ fnType:() => ItemInput,name: 'Items' })
    items!: ItemInput[];

    constructor() {
        super();
    }
}


