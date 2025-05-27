import { Seeder } from '@mikro-orm/seeder';
import { EntityClass, EntityManager } from '@mikro-orm/core';
import { Tenant } from '../features/tenant/tenant.entity';

/**
 *
 */
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.registerSchema(em);
  }

  async registerSchema(em: EntityManager): Promise<void> {
    const tenants = await em
      .getRepository(Tenant as EntityClass<Tenant>)
      .findAll();

    for (const tenant of tenants) {
      const schemaName = tenant.schemaName;

      // Check if schema exists
      const existingSchema = await em
        .getConnection()
        .execute(
          `SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?`,
          [schemaName],
        );

      if (existingSchema.length === 0) {
        console.log(
          `Creating schema for tenant: ${tenant.tenantCode} (${schemaName})`,
        );

        // Create the schema
        await em
          .getConnection()
          .execute(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

        // Clone tables from template schema (assume 'public')
        const tablesToClone = await em.getConnection().execute(`
          SELECT tablename FROM pg_tables 
          WHERE schemaname = 'template' AND tablename NOT LIKE 'mikro_orm_%'
        `);

        for (const { tablename } of tablesToClone) {
          const cloneSQL = `
            CREATE TABLE "${schemaName}"."${tablename}" 
            (LIKE "template"."${tablename}" INCLUDING ALL)
          `;
          console.log(
            `Cloning table: ${tablename} → ${schemaName}.${tablename}`,
          );
          await em.getConnection().execute(cloneSQL);
        }
      } else {
        console.log(`Schema already exists: ${schemaName}`);
      }
    }
  }
}
