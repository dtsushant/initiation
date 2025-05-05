import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserLoginDto } from '../user/dto';
import { Controller } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('party')
@Controller('parties')
export class PartyController {
  async index(): Promise<string> {
    return Promise.any('hello parties');
  }
}
