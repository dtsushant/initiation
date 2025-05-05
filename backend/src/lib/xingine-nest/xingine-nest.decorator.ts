import { Constructor } from '@xingine/core/utils/type';
import { CommissarProperties } from '@xingine/core/xingine.type';
import { PROVISIONEER_METADATA } from '@xingine/core/xingine.decorator';
import { FormMeta } from '@xingine/core/component/component-meta-map';
import { extractMeta } from './utils/commissar.utils';

export const COMMISSAR_METADATA = 'xingine:provisioneer:commissar';

/**
 * A @Commissar is a controller action-level annotation used within a @Provisioneer to define a centrally authorized service endpoint
 * that also manages its UI representation and execution lifecycle hooks.
 * Each @Commissar determines how the action is visualized to the user (via component) and may specify logic to be executed before and/or after the core action.
 */
export function Commissar<TReq = unknown, TRes = unknown>(
  options: CommissarProperties<TReq, TRes>,
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const constructor = target.constructor;
    console.log('the constructor name', constructor.name);
    console.log('the target here is ', target, propertyKey, descriptor.value);

    // The prevents the commissar to be initiated before the provisioneer and throw error
    setTimeout(() => {
      const isProvisioned = Reflect.getMetadata(
        PROVISIONEER_METADATA,
        constructor,
      );
      if (!isProvisioned) {
        throw new Error(
          `@Commissar can only be used in classes decorated with @Provisioneer. Method: ${String(propertyKey)}`,
        );
      }
    }, 0);

    const meta: CommissarProperties['meta'] = extractMeta(options).properties;
    const fullOptions = { ...options, meta };

    Reflect.defineMetadata(COMMISSAR_METADATA, fullOptions, descriptor.value);
  };
}

export function getCommissarProperties(
  provisioneer: Constructor,
  actionName: string,
): CommissarProperties | undefined {
  const action = provisioneer.prototype[actionName as string | symbol];
  if (typeof action !== 'function') return undefined;

  return Reflect.getMetadata(COMMISSAR_METADATA, action) as
    | CommissarProperties
    | undefined;
}
