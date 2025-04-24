import { Migration } from '@mikro-orm/migrations';

export class TenantTemplate extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE SCHEMA IF NOT EXISTS "template";');

    this.addSql(`CREATE TABLE "template"."party_users" (
                                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                    party_code TEXT REFERENCES shared.parties(party_code),
                                                    username VARCHAR(255) NOT NULL,
                                                    email VARCHAR(255) NOT NULL UNIQUE,
                                                    bio VARCHAR(255) NOT NULL,
                                                    image VARCHAR(255) NOT NULL,
                                                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                                    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
                                                    last_login TIMESTAMPTZ,
                                                    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                                                    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
                                                    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                                                    mfa_method VARCHAR(50),
                                                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                                    created_ip INET,
                                                    updated_ip INET
                     );`);
    this.addSql(`CREATE TABLE "template"."user_passwords" (
                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      user_id UUID NOT NULL REFERENCES template.party_users(id) ON DELETE CASCADE,
                      party_code TEXT REFERENCES shared.parties(party_code),
                      password_hash VARCHAR(255) NOT NULL,
                      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      is_current BOOLEAN NOT NULL DEFAULT TRUE
                    );`);

    this.addSql(`CREATE TABLE template.permissions (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        party_code TEXT REFERENCES shared.parties(party_code),
                        name TEXT UNIQUE NOT NULL,
                        description TEXT
                    );`);

    this.addSql(`CREATE TABLE template.groups (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        party_code TEXT REFERENCES shared.parties(party_code),
                        name TEXT UNIQUE NOT NULL,
                        description TEXT
                    );`);

    this.addSql(`CREATE TABLE template.roles (
                                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                name TEXT UNIQUE NOT NULL,
                                                party_code TEXT REFERENCES shared.parties(party_code),
                                                description TEXT,
                                                created_at TIMESTAMPTZ DEFAULT now(),
                                                updated_at TIMESTAMPTZ DEFAULT now()
                     );`);

    this.addSql(`CREATE TABLE template.user_roles (
                        user_id UUID REFERENCES template.party_users(id) ON DELETE CASCADE,
                        role_id UUID REFERENCES template.roles(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, role_id)
                    );`);

    this.addSql(`CREATE TABLE template.role_permissions (
                        role_id UUID REFERENCES template.roles(id) ON DELETE CASCADE,
                        permission_id UUID REFERENCES template.permissions(id) ON DELETE CASCADE,
                        PRIMARY KEY (role_id, permission_id)
                    );`);

    this.addSql(`CREATE TABLE template.user_groups (
                        user_id UUID REFERENCES template.party_users(id) ON DELETE CASCADE,
                        group_id UUID REFERENCES template.groups(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, group_id)
                    );`);

    this.addSql(`CREATE TABLE template.group_managers (
                        user_id UUID REFERENCES template.party_users(id) ON DELETE CASCADE,
                        group_id UUID REFERENCES template.groups(id) ON DELETE CASCADE,
                        PRIMARY KEY (user_id, group_id)
                    );`);

    this.addSql(`CREATE TABLE template.group_roles (
                        group_id UUID REFERENCES template.groups(id) ON DELETE CASCADE,
                        role_id UUID REFERENCES template.roles(id) ON DELETE CASCADE,
                        PRIMARY KEY (group_id, role_id)
                    );`);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE "template"."party_users";');
    this.addSql('DROP TABLE "template"."roles";');
    this.addSql('DROP TABLE "template"."permissions";');
    this.addSql('DROP TABLE "template"."groups";');
    this.addSql('DROP TABLE "template"."user_roles";');
    this.addSql('DROP TABLE "template"."role_permissions";');
    this.addSql('DROP TABLE "template"."user_groups";');
    this.addSql('DROP TABLE "template"."group_managers";');
    this.addSql('DROP TABLE "template"."group_roles";');
  }
}
