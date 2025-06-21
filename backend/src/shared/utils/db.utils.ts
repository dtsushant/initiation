import { EntityClass, EntityManager, EntityRepository, EntityName } from '@mikro-orm/core';

export function getForkedRepository<T extends object>(
  em: EntityManager,
  entity: EntityName<T>,
): EntityRepository<T> {
  return em.fork().getRepository(entity);
}
