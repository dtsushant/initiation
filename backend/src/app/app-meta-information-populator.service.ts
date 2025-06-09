import { Injectable, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Permission } from '../features/user/entity/permission.entity';
import { Collection, EntityClass } from '@mikro-orm/core';
import { Role } from '../features/user/entity/role.entity';
import { AppDetail } from './app.entity';

import { permissionPath } from '../shared/utils/string.utils';
import { GroupedPermission } from 'xingine';

@Injectable()
export class AppMetaInformationPopulatorService {
  private readonly logger = new Logger(AppMetaInformationPopulatorService.name);

  constructor(private readonly appService: AppService) {}

  async run(em: EntityManager): Promise<void> {
    const moduleProperties = await this.appService.getModuleMetadata();
    const apiPaths = await this.appService.getAllAPIPath();
    const modules = await this.loadAllModules(em, apiPaths);
    await this.loadAllPermission(em, apiPaths, modules);
    await this.loadSuper(em);
  }

  async loadAllModules(
    em: EntityManager,
    allTheApis: GroupedPermission,
  ): Promise<AppDetail[]> {
    const allKeys: string[] = Object.keys(allTheApis);
    const appDetails = allKeys.map((property) => ({
      module: property,
      description: '',
    }));
    return await em.upsertMany(
      AppDetail as EntityClass<AppDetail>,
      appDetails,
      {
        onConflictFields: ['module'],
        onConflictAction: 'merge',
        onConflictMergeFields: ['description'],
      },
    );
  }
  async loadAllPermission(
    em: EntityManager,
    allTheApis: GroupedPermission,
    modules: AppDetail[],
  ): Promise<void> {
    const allKeys: string[] = Object.keys(allTheApis);
    const permissions = allKeys.flatMap((key) => {
      return allTheApis[key].map((permission) => ({
        id: permission.name,
        description: permission.description,
        module: modules.find((module) => module.module === key)!,
      }));
    });

    console.log('the permissions ', permissions);
    await em.upsertMany(Permission as EntityClass<Permission>, permissions, {
      onConflictFields: ['id'],
      onConflictAction: 'merge',
      onConflictMergeFields: ['description'],
    });
  }

  async loadSuper(em: EntityManager): Promise<void> {
    const roleName = 'ROLE_SUPREME_LEADER';

    let role: Role | null = await em.findOne(
      Role as EntityClass<Role>,
      { id: roleName },
      { populate: ['permissions'] },
    );

    if (!role) {
      role = new Role();
      role.id = roleName;
      role.description = 'Super admin with all permissions';
      em.persist(role);
      role.permissions = new Collection<Permission>(role);
    }

    const allPermissions = await em.find(
      Permission as EntityClass<Permission>,
      {},
    );

    for (const perm of allPermissions) {
      if (!role.permissions.contains(perm)) {
        role.permissions.add(perm);
      }
    }
    await em.flush();

    this.logger.log(`[Seeder] Role '${roleName}' seeded with all permissions.`);
  }
}
