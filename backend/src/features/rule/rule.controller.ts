import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {getToday} from "@shared/utils/date.util";

@ApiBearerAuth()
@ApiTags('rule')
@Controller('rules')
export class RuleController {

    @Get('fetch')
    async fetch(): Promise<Date> {
        return getToday();
    }

}