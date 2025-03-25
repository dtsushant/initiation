"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const dotenv_1 = __importDefault(require("dotenv"));
const postgresql_1 = require("@mikro-orm/postgresql");
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
const reflection_1 = require("@mikro-orm/reflection");
const migrations_1 = require("@mikro-orm/migrations");
const entity_generator_1 = require("@mikro-orm/entity-generator");
const seeder_1 = require("@mikro-orm/seeder");
const path_1 = require("path");
const user_entity_1 = require("./src/features/user/user.entity");
const category_entity_1 = require("./src/features/category/category.entity");
const merchant_entity_1 = require("./src/features/merchant/merchant.entity");
dotenv_1.default.config();
exports.default = (0, postgresql_1.defineConfig)({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    migrations: {
        path: (0, path_1.join)(__dirname, 'src', 'migrations'), // Specify the path to migrations
        // migrationsList: [
        //   {
        //     name: 'InitialMigration',
        //     class: InitialMigration,
        //   },
        // ],
    },
    entities: [user_entity_1.User, category_entity_1.Category, merchant_entity_1.Merchant],
    discovery: { disableDynamicFileAccess: true },
    seeder: {
        pathTs: (0, path_1.join)(__dirname, 'src', 'seeders'),
    },
    debug: true,
    loadStrategy: core_1.LoadStrategy.JOINED,
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    metadataProvider: reflection_1.TsMorphMetadataProvider,
    // @ts-expect-error nestjs adapter option
    registerRequestContext: false,
    extensions: [migrations_1.Migrator, entity_generator_1.EntityGenerator, seeder_1.SeedManager],
});
