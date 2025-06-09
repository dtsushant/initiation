import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionGateKeeper } from '../shared/auth/auth-permit.decorator';
import { ModulePropertyOptions } from 'xingine';

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

  @Get('lookup')
  @PermissionGateKeeper({ allowPeasants: true })
  async lookup(): Promise<{ label: string; value: string }[]> {
    return (await this.appService.getModuleMetadata()).map((metaData) => ({
      label: metaData.name,
      value: metaData.name,
    }));
  }
}
