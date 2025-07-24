import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { LayoutRegistryService, XingineInspectorService } from 'xingine-nest';
import { ICacheService } from '../shared/cache/cache.interface';
import { ModuleProperties, GroupedPermission, LayoutRenderer } from 'xingine';
import { LAYOUT_MAP } from '../shared/components/layouts/layout.map';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly inspectorService: XingineInspectorService,
    private readonly registerLayoutService: LayoutRegistryService,
    @Inject('ICacheService') private readonly cache: ICacheService,
  ) {}

  async getModuleMetadata(): Promise<ModuleProperties[]> {
    return this.inspectorService.getAllModuleProperties();
  }

  async getAllAPIPath(): Promise<GroupedPermission> {
    return this.inspectorService.getAllControllerPath();
  }

  getHello(): string {
    this.logger.log('getHello called');
    return 'Hello World!';
  }

  async getAllLayoutRenderer(): Promise<LayoutRenderer[]> {
    return this.inspectorService.getAllLayoutRenderers();
  }

  async registerLayout(): Promise<void> {
    console.log('checking Registering all layouts from LAYOUT_MAP');
    this.logger.log('Registering all layouts from LAYOUT_MAP');
    Object.entries(LAYOUT_MAP).forEach(([name, renderer]) => {
      console.log(`Registering layout: ${name}`);
      this.registerLayoutService.registerLayout(name, renderer);
    });
  }
}
