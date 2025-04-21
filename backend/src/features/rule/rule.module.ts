import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { ModuleProperty } from '@xingine/core/xingine.decorator';

@ModuleProperty({
  uiComponent: {
    component: 'RuleDocumentPage',
    path: 'rule',
    icon: 'TagsOutlined',
  },
})
@Module({
  controllers: [RuleController],
  imports: [],
})
export class RuleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
