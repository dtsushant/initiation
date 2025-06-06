import { Injectable, RequestMethod, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  GroupedPermission,
  ModuleProperties,
  Permission,
} from '@xingine/core/xingine.type';
import { getProvisioneerProperties } from '@xingine/core/xingine.decorator';
import { Constructor, extractRouteParams } from '@xingine/core/utils/type';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { getCommissarProperties } from './xingine-nest.decorator';
import { extractMeta } from './utils/commissar.utils';

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
  }

  getAllControllerPath(): GroupedPermission {
    const allTheApis: GroupedPermission = {};
    const controllers = this.getAllControllers();
    for (const controller of controllers) {
      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controller) || '';

      const definedPaths: Permission[] = [];
      allTheApis[controllerPath] = definedPaths;

      const prototype = controller.prototype;

      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) =>
          typeof prototype[name] === 'function' && name !== 'constructor',
      );
      for (const methodName of methodNames) {
        const method = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          prototype[methodName],
        );

        if (!RequestMethod[method]) continue;

        const routePath = this.reflector.get<string | string[]>(
          PATH_METADATA,
          prototype[methodName],
        );
        const fullPath = (path: string) =>
          `${RequestMethod[method]}::/${controllerPath}/${path.replace(/^\//, '')}`;

        if (typeof routePath === 'string') {
          definedPaths.push({ name: fullPath(routePath), description: '' });
        }
        if (Array.isArray(routePath)) {
          for (const path of routePath) {
            definedPaths.push({ name: fullPath(path), description: '' });
          }
        }
      }
    }
    return allTheApis;
  }

  private getAllControllers(): Constructor<unknown>[] {
    return this.discoveryService
      .getControllers()
      .map((w) => w.metatype)
      .filter(
        (meta): meta is Constructor =>
          typeof meta === 'function' && !!meta.name,
      );
  }

  private fetchMappedModules(): ModuleProperties[] {
    const moduleProperties: ModuleProperties[] = [];

    const controllers = this.getAllControllers();

    for (const controller of controllers) {
      const provisioneerProperties = getProvisioneerProperties(controller);

      if (!provisioneerProperties) continue;

      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controller) || '';
      const prototype = controller.prototype;

      const mod: ModuleProperties = {
        name: provisioneerProperties.name!,
        uiComponent: [],
        permissions: [],
      };
      moduleProperties.push(mod);

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

        const uiComponent = {
          component: commissar.component,
          layout: commissar.layout,
          path: uiPath,
          meta: componentMeta,
        };

        mod.uiComponent?.push(uiComponent);
      }
    }
    return moduleProperties;
  }
}
