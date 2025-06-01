import { Injectable, RequestMethod, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  ModuleProperties,
  ModulePropertyOptions,
} from '@xingine/core/xingine.type';
import {
  getModulePropertyMetadata,
  getProvisioneerProperties,
} from '@xingine/core/xingine.decorator';
import { Constructor, extractRouteParams } from '@xingine/core/utils/type';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { getCommissarProperties } from './xingine-nest.decorator';
import { extractMeta } from './utils/commissar.utils';
import { ComponentMeta } from '@xingine/core/component/component-meta-map';

@Injectable()
export class XingineInspectorService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  getAllModuleProperties(): ModuleProperties[] {
    const modules = this.discoveryService.getProviders();

    return this.fetchMappedModules();
    /*const moduleProperties: ModuleProperties[] = [];
    for (const moduleWrapper of modules) {
      const metatype = moduleWrapper.metatype as Type<object>;

      if (!metatype || typeof metatype !== 'function') continue;
      console.log("the metaType",metatype)

      const metadata = getModulePropertyMetadata(metatype);

      if (metadata) {
        moduleProperties.push(metadata);
      }
    }

    return moduleProperties;*/
  }

  private fetchMappedModules(): ModuleProperties[] {
    const moduleProperties: ModuleProperties[] = [];

    const controllers = this.discoveryService
      .getControllers()
      .map((w) => w.metatype)
      .filter(
        (meta): meta is Constructor =>
          typeof meta === 'function' && !!meta.name,
      );

    for (const controller of controllers) {
      const provisioneerProperties = getProvisioneerProperties(controller);

      if (!provisioneerProperties) continue;

      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controller) || '';
      const prototype = controller.prototype;
      console.log(
        'the controller name and path',
        controller.name,
        controllerPath,
      );

      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) =>
          typeof prototype[name] === 'function' && name !== 'constructor',
      );

      for (const methodName of methodNames) {
        const commissar = getCommissarProperties(controller, methodName);
        if (!commissar) continue;

        const routePath = this.reflector.get<string>(
          PATH_METADATA,
          prototype[methodName],
        );
        const method = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          prototype[methodName],
        );
        let fullPath: string | undefined = undefined;
        let uiPath = `/${provisioneerProperties?.name}/${methodName}`;
        if (routePath !== undefined && method !== undefined) {
          const methodString = RequestMethod[method];
          fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/');
          console.log(`[${methodString}] ${fullPath}`);
        }

        const slugs = extractRouteParams(fullPath ?? '');
        if (slugs.length >= 1) {
          uiPath += slugs.reduce((acc, key) => {
            return `${acc}/:${key}`;
          }, '');
        }

        /*const hasPermission = this.reflector.get(
            PERMISSION_GUARD_KEY,
            prototype[methodName],
        );

        if (hasPermission) {
          console.log(` ${controller.name}.${methodName} is annotated with @PermissionGateKeeper(${hasPermission})`);
        }*/

        const componentMeta = extractMeta(commissar, fullPath ?? '');
        const mod = moduleProperties.find(
          (modules) => modules.name === provisioneerProperties.name,
        );

        const uiComponent = {
          component: commissar.component,
          layout: provisioneerProperties.layoutMandate,
          path: uiPath,
          meta: componentMeta,
        };

        if (!mod) {
          const module: ModuleProperties = {
            name: provisioneerProperties.name!,
            uiComponent: [uiComponent],
            permissions: [],
          };
          moduleProperties.push(module);
        } else {
          mod.uiComponent?.push(uiComponent);
        }
      }
    }
    return moduleProperties;
  }
}
