import { Injectable, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { ModulePropertyOptions } from '@xingine/core/xingine.type';
import { MODULE_PROPERTY_METADATA_KEY } from '@xingine/core/xingine.decorator';

@Injectable()
export class XingineInspectorService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  getAllModuleProperties(): ModulePropertyOptions[] {
    const modules = this.discoveryService.getProviders();

    const moduleProperties: ModulePropertyOptions[] = [];

    for (const moduleWrapper of modules) {
      const metatype = moduleWrapper.metatype as Type<unknown>;

      if (!metatype || typeof metatype !== 'function') continue;

      const metadata = Reflect.getMetadata(
        MODULE_PROPERTY_METADATA_KEY,
        metatype,
      ) as ModulePropertyOptions | undefined;

      if (metadata) {
        moduleProperties.push(metadata);
      }
    }

    return moduleProperties;
  }
}
