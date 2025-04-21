import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ModulePropertyOptions } from '@xingine/core/xingine.type';

@Controller()
export class AppController {
  constructor(
    @Inject()
    private readonly appService: AppService,
  ) {}

  @Get('welcome')
  getWelcome(): string {
    return 'Welcome somehting test sometihg to the modified now test awesome API!';
  }

  @Get('modules')
  async enabledModules(): Promise<ModulePropertyOptions[]> {
    return await this.appService.getModuleMetadata();
  }
}
