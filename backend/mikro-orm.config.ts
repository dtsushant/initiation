import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { InitialMigration } from './src/migrations/InitialMigration';
import dotenv from "dotenv";
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { join } from 'path';
import { User } from './src/features/user/user.entity';
import { Category } from './src/features/category/category.entity';
import { Merchant } from './src/features/merchant/merchant.entity';

dotenv.config();

export default defineConfig({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    migrations: {
      path: join(__dirname, 'src', 'migrations'), // Specify the path to migrations
      // migrationsList: [
      //   {
      //     name: 'InitialMigration',
      //     class: InitialMigration,
      //   },
      // ],
    },

    entities: [User, Category, Merchant],
    discovery: { disableDynamicFileAccess: true },
    seeder: {
      pathTs: join(__dirname, 'src', 'seeders'),
    },
    debug: true,
    loadStrategy: LoadStrategy.JOINED,
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
    // @ts-expect-error nestjs adapter option
    registerRequestContext: false,
    extensions: [Migrator, EntityGenerator, SeedManager],
});
