import { Migration } from '@mikro-orm/migrations';

export class IamMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`CREATE TABLE "iam"."user_passwords" (
                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
                      password_hash VARCHAR(255) NOT NULL,
                      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      is_current BOOLEAN NOT NULL DEFAULT TRUE
                    );`);

    this.addSql(`CREATE TABLE iam.roles (
                        id TEXT PRIMARY KEY,
                        description TEXT,
                        created_at TIMESTAMPTZ DEFAULT now(),
                        updated_at TIMESTAMPTZ DEFAULT now()
                    );`);

    this.addSql(`CREATE TABLE iam.permissions (
                        id TEXT PRIMARY KEY,
                        module VARCHAR(255) REFERENCES shared.app_details(module) ON DELETE RESTRICT,
                        description TEXT
                    );`);

    this.addSql(`CREATE TABLE iam.groups (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        name TEXT UNIQUE NOT NULL,
                        description TEXT
                    );`);

    this.addSql(`CREATE TABLE iam.user_roles (
                        user_id UUID REFERENCES iam.users(id) ON DELETE CASCADE,
                        role_id TEXT REFERENCES iam.roles(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, role_id)
                    );`);

    this.addSql(`CREATE TABLE iam.role_permissions (
                        role_id TEXT REFERENCES iam.roles(id) ON DELETE CASCADE,
                        permission_id TEXT REFERENCES iam.permissions(id) ON DELETE CASCADE,
                        PRIMARY KEY (role_id, permission_id)
                    );`);

    this.addSql(`CREATE TABLE iam.user_groups (
                        user_id UUID REFERENCES iam.users(id) ON DELETE CASCADE,
                        group_id UUID REFERENCES iam.groups(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, group_id)
                    );`);

    this.addSql(`CREATE TABLE iam.group_managers (
                        user_id UUID REFERENCES iam.users(id) ON DELETE CASCADE,
                        group_id UUID REFERENCES iam.groups(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, group_id)
                    );`);

    this.addSql(`CREATE TABLE iam.group_roles (
                        group_id UUID REFERENCES iam.groups(id) ON DELETE CASCADE,
                        role_id TEXT REFERENCES iam.roles(id) ON DELETE CASCADE,
                        PRIMARY KEY (group_id, role_id)
                    );`);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE "iam"."roles";');
    this.addSql('DROP TABLE "iam"."permissions";');
    this.addSql('DROP TABLE "iam"."groups";');
    this.addSql('DROP TABLE "iam"."user_roles";');
    this.addSql('DROP TABLE "iam"."role_permissions";');
    this.addSql('DROP TABLE "iam"."user_groups";');
    this.addSql('DROP TABLE "iam"."group_managers";');
    this.addSql('DROP TABLE "iam"."group_roles";');
  }
}
