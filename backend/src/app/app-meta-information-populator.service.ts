import { Injectable, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Permission } from '../features/user/entity/permission.entity';
import { Collection, EntityClass } from '@mikro-orm/core';
import { PERMISSIONS } from '../shared/auth/constant/permissions.constant';
import { Role } from '../features/user/entity/role.entity';

@Injectable()
export class AppMetaInformationPopulatorService {
  private readonly logger = new Logger(AppMetaInformationPopulatorService.name);

  constructor(private readonly appService: AppService) {}

  async run(em: EntityManager): Promise<void> {
    console.log(this.appService.getModuleMetadata());
    await this.loadAllPermission(em);
    await this.loadSuper(em);
  }

  async loadAllModules(em: EntityManager): Promise<void> {
    console.log(this.appService.getModuleMetadata());
  }
  async loadAllPermission(em: EntityManager): Promise<void> {
    await em.upsertMany(Permission as EntityClass<Permission>, PERMISSIONS, {
      onConflictFields: ['id'],
      onConflictAction: 'merge',
      onConflictMergeFields: ['description'],
    });
  }

  async loadSuper(em: EntityManager): Promise<void> {
    const roleName = 'ROLE_SUPER';

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

    this.logger.log(
      `[Seeder] ✅ Role '${roleName}' seeded with all permissions.`,
    );
  }
}
