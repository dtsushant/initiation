import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {RuleController} from "./rule.controller";

@Module({
    controllers: [RuleController],
    imports: [

    ]
})
export class RuleModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {

    }
}