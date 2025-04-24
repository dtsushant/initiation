import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { ModuleProperty } from '@xingine/core/xingine.decorator';
import { RULE_PERMISSIONS } from './constant/rule.permissions';

@ModuleProperty({
  uiComponent: {
    component: 'RuleDocumentPage',
    path: 'rule',
    icon: 'TagsOutlined',
  },
  permissions: RULE_PERMISSIONS,
})
@Module({
  controllers: [RuleController],
  imports: [],
})
export class RuleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
