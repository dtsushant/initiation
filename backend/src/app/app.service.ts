import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ModuleProperties } from '@xingine/core/xingine.type';
import { XingineInspectorService } from '../lib/xingine-nest/xingine-inspector.service';
import { ICacheService } from '../shared/cache/cache.interface';

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

  getHello(): string {
    this.logger.log('getHello called');
    return 'Hello World!';
  }
}
