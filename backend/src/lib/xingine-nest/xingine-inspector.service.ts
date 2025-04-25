import { Injectable, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  ModuleProperties,
  ModulePropertyOptions,
} from '@xingine/core/xingine.type';
import {
  getModulePropertyMetadata,
  MODULE_PROPERTY_METADATA_KEY,
} from '@xingine/core/xingine.decorator';

@Injectable()
export class XingineInspectorService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  getAllModuleProperties(): ModuleProperties[] {
    const modules = this.discoveryService.getProviders();

    const moduleProperties: ModuleProperties[] = [];

    for (const moduleWrapper of modules) {
      const metatype = moduleWrapper.metatype as Type<object>;

      if (!metatype || typeof metatype !== 'function') continue;

      const metadata = getModulePropertyMetadata(metatype);

      if (metadata) {
        moduleProperties.push(metadata);
      }
    }

    return moduleProperties;
  }
}
