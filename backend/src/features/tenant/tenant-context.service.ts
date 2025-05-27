import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<{ tenantId: string }>();

  runWithTenant<T>(tenantId: string, fn: () => T): T {
    return this.storage.run({ tenantId }, fn);
  }

  getTenant(): string {
    const store = this.storage.getStore();
    if (!store) throw new Error('No tenant context set');
    return store.tenantId;
  }
}
