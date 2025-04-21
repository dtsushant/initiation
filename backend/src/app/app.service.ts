import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ModulePropertyOptions } from '@xingine/core/xingine.type';
import { XingineInspectorService } from '../lib/xingine-nest/xingine-inspector.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly inspectorService: XingineInspectorService) {}

  async getModuleMetadata(): Promise<ModulePropertyOptions[]> {
    return this.inspectorService.getAllModuleProperties();
  }

  getHello(): string {
    this.logger.log('getHello called');
    return 'Hello World!';
  }
}
