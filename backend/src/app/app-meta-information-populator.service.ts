import { Injectable, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Permission } from '../features/user/entity/permission.entity';
import { Collection, EntityClass } from '@mikro-orm/core';
import { Role } from '../features/user/entity/role.entity';
import { AppDetail } from './app.entity';
import { ModuleProperties } from '@xingine/core/xingine.type';
import { permissionPath } from '../shared/utils/string.utils';

@Injectable()
export class AppMetaInformationPopulatorService {
  private readonly logger = new Logger(AppMetaInformationPopulatorService.name);

  constructor(private readonly appService: AppService) {}

  async run(em: EntityManager): Promise<void> {
    const moduleProperties = await this.appService.getModuleMetadata();
    const modules = await this.loadAllModules(em, moduleProperties);
    await this.loadAllPermission(em, moduleProperties, modules);
    await this.loadSuper(em);
  }

  async loadAllModules(
    em: EntityManager,
    moduleProperties: ModuleProperties[],
  ): Promise<AppDetail[]> {
    const appDetails = moduleProperties.map((property) => ({
      module: property.name,
      description: property.description ?? property.name,
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
    moduleProperties: ModuleProperties[],
    modules: AppDetail[],
  ): Promise<void> {
    const permissions = moduleProperties.flatMap((properties) =>
      properties.permissions.map((permission) => ({
        id: permissionPath(properties.name, permission.name),
        description: permission.description,
        module: modules.find((module) => module.module === properties.name)!,
      })),
    );
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
