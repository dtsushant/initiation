import { Migration } from '@mikro-orm/migrations';

export class InitialMigration extends Migration {
    async up(): Promise<void> {
        // Create IAM schema and User table
        this.addSql('CREATE SCHEMA IF NOT EXISTS "iam";');
        this.addSql('create table "iam"."user" ("id" SERIAL PRIMARY KEY, "username" varchar(255) not null, "email" varchar(255) not null, "bio" varchar(255) not null, "image" varchar(255) not null, "password" varchar(255) not null);');

        this.addSql(
            'create table "iam"."user_to_follower" ("follower" int not null, "following" int not null);',
          );
        // Create Shared schema and Merchant, Category tables
        this.addSql('CREATE SCHEMA IF NOT EXISTS "shared";');
        this.addSql('CREATE TABLE "shared"."merchant" ("id" SERIAL PRIMARY KEY, "created_date" TIMESTAMP NOT NULL, "created_by" VARCHAR(255) NOT NULL, "last_updated_by" VARCHAR(255), "last_updated_date" TIMESTAMP, "approved_by" VARCHAR(255));');
        this.addSql('CREATE TABLE "shared"."category" ("code" VARCHAR(255) PRIMARY KEY, "label" VARCHAR(255), "description" VARCHAR(255), "level" INTEGER DEFAULT 0, "parent_category_code" VARCHAR(255),"created_date" TIMESTAMP NOT NULL, "created_by" VARCHAR(255) NOT NULL, "last_updated_by" VARCHAR(255), "last_updated_date" TIMESTAMP, "approved_by" VARCHAR(255), FOREIGN KEY ("parent_category_code") REFERENCES "shared"."category" ("code") ON DELETE SET NULL);');
    }

    async down(): Promise<void> {
        this.addSql('DROP TABLE "iam"."user";');
        this.addSql('DROP TABLE "iam"."user_to_follower";');
        this.addSql('DROP TABLE "shared"."merchant";');
        this.addSql('DROP TABLE "shared"."category";');
        this.addSql('DROP SCHEMA "iam";');
        this.addSql('DROP SCHEMA "shared";');
    }
}
