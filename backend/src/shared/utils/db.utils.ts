import { EntityClass, EntityManager, EntityRepository } from '@mikro-orm/core';

export function getForkedRepository<T>(
  em: EntityManager,
  entity: T,
): EntityRepository<T> {
  return em.fork().getRepository(entity);
}
