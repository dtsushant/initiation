import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserLoginDto } from '../user/dto';
import { Controller } from '@nestjs/common';
import { Provisioneer } from '@xingine/core/xingine.decorator';
import { partyProvisioneer } from './constant/component/party.provisioneer';

@ApiBearerAuth()
@ApiTags('party')
@Controller('parties')
@Provisioneer(partyProvisioneer)
export class PartyController {
  async index(): Promise<string> {
    return Promise.any('hello parties');
  }
}
