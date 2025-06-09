import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RuleController } from './rule.controller';
/*import { RULE_PERMISSIONS } from './constant/rule.permissions';

@ModuleProperty({
  uiComponent: [RuleViewComponent],
  permissions: RULE_PERMISSIONS,
})*/
@Module({
  controllers: [RuleController],
  imports: [],
})
export class RuleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
