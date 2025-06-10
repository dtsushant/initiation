import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { XingineInspectorService } from 'xingine-nest';
import { ICacheService } from '../shared/cache/cache.interface';
import { ModuleProperties, GroupedPermission } from 'xingine';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly inspectorService: XingineInspectorService,
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
}
