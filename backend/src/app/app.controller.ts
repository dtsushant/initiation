import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ModulePropertyOptions } from '@xingine/core/xingine.type';
import { PermissionGateKeeper } from '../shared/auth/auth-permit.decorator';

@Controller()
export class AppController {
  constructor(
    @Inject()
    private readonly appService: AppService,
  ) {}

  @Get('welcome')
  @PermissionGateKeeper({ allowPeasants: true })
  getWelcome(): string {
    return 'Welcome!';
  }

  @Get('modules')
  @PermissionGateKeeper({ allowPeasants: true })
  async enabledModules(): Promise<ModulePropertyOptions[]> {
    return await this.appService.getModuleMetadata();
  }
}
