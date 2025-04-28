import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { ModuleProperty } from '@xingine/core/xingine.decorator';
import { RULE_PERMISSIONS } from './constant/rule.permissions';
import { RuleViewComponent } from './component/rule-view.component';

@ModuleProperty({
  uiComponent: [RuleViewComponent],
  permissions: RULE_PERMISSIONS,
})
@Module({
  controllers: [RuleController],
  imports: [],
})
export class RuleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
