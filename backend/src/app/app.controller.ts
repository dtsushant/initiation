import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionGateKeeper } from '../shared/auth/auth-permit.decorator';
import { LayoutRenderer } from 'xingine';

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

  @Get('commissars')
  @PermissionGateKeeper({ allowPeasants: true })
  async dispatchAllCommissars(): Promise<LayoutRenderer[]> {
    return await this.appService.getAllLayoutRenderer();
  }

  @Get('lookup')
  @PermissionGateKeeper({ allowPeasants: true })
  async lookup(): Promise<{ label: string; value: string }[]> {
    return (await this.appService.getAllLayoutRenderer()).map((metaData) => ({
      label: metaData.type,
      value: metaData.type,
    }));
  }
}
