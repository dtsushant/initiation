"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const InitialMigration_1 = require("./src/migrations/InitialMigration");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const postgresql_1 = require("@mikro-orm/postgresql");
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
const reflection_1 = require("@mikro-orm/reflection");
const migrations_1 = require("@mikro-orm/migrations");
const entity_generator_1 = require("@mikro-orm/entity-generator");
const seeder_1 = require("@mikro-orm/seeder");
const user_entity_1 = require("./src/features/user/entity/user.entity");
const category_entity_1 = require("./src/features/category/category.entity");
const IamMigration_1 = require("./src/migrations/IamMigration");
const TenantTemplate_1 = require("./src/migrations/TenantTemplate");
const tenant_entity_1 = require("./src/features/tenant/tenant.entity");
const party_entity_1 = require("./src/features/party/party.entity");
const party_tenant_entity_1 = require("./src/features/party/party-tenant.entity");
const app_entity_1 = require("./src/app/app.entity");
dotenv_1.default.config();
// noinspection TypeScriptUnresolvedReference
exports.default = (0, postgresql_1.defineConfig)({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    migrations: {
        path: (0, path_1.join)(__dirname, 'src', 'migrations'), // Specify the path to migrations
        migrationsList: [
            {
                name: 'InitialMigration',
                class: InitialMigration_1.InitialMigration,
            },
            {
                name: 'IamMigration',
                class: IamMigration_1.IamMigration,
            },
            {
                name: 'TenantTemplate',
                class: TenantTemplate_1.TenantTemplate,
            },
        ],
    },
    entities: [
        app_entity_1.AppDetail,
        user_entity_1.User,
        category_entity_1.Category,
        tenant_entity_1.Tenant,
        party_entity_1.Party,
        party_tenant_entity_1.PartyTenant,
    ],
    discovery: { disableDynamicFileAccess: true },
    seeder: {
        pathTs: (0, path_1.join)(__dirname, 'src', 'seeders'),
        // defaultSeeder: 'DatabaseSeeder'
    },
    debug: true,
    loadStrategy: core_1.LoadStrategy.JOINED,
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    extensions: [migrations_1.Migrator, entity_generator_1.EntityGenerator, seeder_1.SeedManager],
});
