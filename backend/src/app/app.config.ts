// src/app/root-modules.ts

import { RuleModule } from '../features/rule/rule.module';
import { CategoryModule } from '../features/category/category.module';
import { UserModule } from '../features/user/user.module';
import { PartyModule } from '../features/party/party.module';
import { InventoryModule } from '../features/inventory/inventory.module';

export const moduleMap = [UserModule, CategoryModule, RuleModule, PartyModule, InventoryModule];

/**
 * Returns an array of NestJS modules, optionally mapped using a transform function.
 */
export function getRootModules(
  mapperFn?: (name: string, mod: any) => any,
): any[] {
  return Object.entries(moduleMap).map(([name, mod]) =>
    mapperFn ? mapperFn(name, mod) : mod,
  );
}
