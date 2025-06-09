import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserLoginDto } from '../user/dto';
import { Controller } from '@nestjs/common';
import { partyProvisioneer } from './constant/component/party.provisioneer';
import { Provisioneer } from 'xingine';

@ApiBearerAuth()
@ApiTags('party')
@Controller('parties')
@Provisioneer(partyProvisioneer)
export class PartyController {
  async index(): Promise<string> {
    return Promise.any('hello parties');
  }
}
