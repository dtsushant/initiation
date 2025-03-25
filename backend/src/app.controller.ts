import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject()
    private readonly appService: AppService) {}

  @Get('welcome')
  getWelcome(): string {
    return 'Welcome somehting test sometihg to the modified now test awesome API!';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
