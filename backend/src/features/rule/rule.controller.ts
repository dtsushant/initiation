import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import {
  RuleDocument,
  RuleMeta,
  RuleUIInput,
  RuleUIOutput,
} from '@rule-ui/core/rule-ui.interface';
import { PricingRuleDocument } from './document/base-pricing.rule';
import { FieldType } from '@rule-ui/core/rule-ui.enum';

@ApiBearerAuth()
@ApiTags('rule')
@Controller('rules')
export class RuleController {
  @Get('fetch')
  async fetch(): Promise<RuleDocument> {
    const pricingRule: PricingRuleDocument = new PricingRuleDocument();

    console.log(pricingRule.constructor.name);
    const ruleMeta: RuleMeta = {
      id: '1',
      name: 'Sample Rule',
      description: 'This is a sample rule for demonstration purposes.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['sample', 'demo'],
    };

    const ruleInput: RuleUIInput = {
      id: 'input1',
      fields: [
        {
          id: 'inputField1',
          name: 'Input Field 1',
          alias: 'input1',
          code: 'IF1',
          type: FieldType.String, // Assuming 'text' is a valid FieldType
        },
        {
          id: 'inputField2',
          name: 'Input Field 2',
          alias: 'input2',
          code: 'IF2',
          type: FieldType.Number, // Assuming 'number' is a valid FieldType
        },
      ],
    };

    const ruleOutput: RuleUIOutput = {
      id: 'output1',
      fields: [
        {
          id: 'outputField1',
          name: 'Output Field 1',
          alias: 'output1',
          code: 'OF1',
          type: FieldType.Bool, // Assuming 'boolean' is a valid FieldType
        },
      ],
    };

    const ruleDocument: RuleDocument = {
      meta: ruleMeta,
      input: ruleInput,
      output: ruleOutput,
    };

    return ruleDocument;
  }
}
