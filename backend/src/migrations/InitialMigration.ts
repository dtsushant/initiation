import { Migration } from '@mikro-orm/migrations';

export class InitialMigration extends Migration {
  async up(): Promise<void> {
    // Create IAM schema and User table
    this.addSql('CREATE SCHEMA IF NOT EXISTS "iam";');
    this.addSql(`CREATE TABLE "iam"."users" (
                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                      username VARCHAR(255) NOT NULL,
                      firstname VARCHAR(255) NOT NULL,
                      lastname VARCHAR(255) NOT NULL,
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
                      created_by UUID REFERENCES iam.users(id) ON DELETE SET NULL, 
                      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      created_ip INET,
                      updated_ip INET
                    );`);

    this.addSql(
      'create table "iam"."user_to_followers" ("follower" UUID REFERENCES iam.users(id) ON DELETE CASCADE, "following" UUID REFERENCES iam.users(id) ON DELETE CASCADE);',
    );
    // Create Shared schema and Merchant, Category tables
    this.addSql('CREATE SCHEMA IF NOT EXISTS "shared";');

    this.addSql(`CREATE TABLE "shared"."parties" (
                        party_code TEXT PRIMARY KEY ,
                        party_type TEXT NOT NULL CHECK (party_type IN ('INDIVIDUAL', 'COMPANY')),
                        name TEXT NOT NULL,
                        legal_name TEXT,
                        email TEXT,
                        phone TEXT,
                        address TEXT,
                        country_code TEXT,
                        identifier TEXT, -- e.g. national ID, company registration
                        parent_party_id TEXT REFERENCES shared.parties(party_code) ON DELETE SET NULL,
                        created_at TIMESTAMPTZ DEFAULT now(),
                        updated_at TIMESTAMPTZ DEFAULT now()
                    );
`);

    this.addSql(
      'CREATE TABLE "shared"."app_details" ("module" VARCHAR(255) PRIMARY KEY, "description" TEXT);',
    );
    this.addSql(
      'CREATE TABLE "shared"."categories" ("code" VARCHAR(255) PRIMARY KEY, "label" VARCHAR(255), "description" VARCHAR(255), "level" INTEGER DEFAULT 0, "parent_category_code" VARCHAR(255),"created_date" TIMESTAMP NOT NULL, "created_by" UUID REFERENCES iam.users(id) ON DELETE NO ACTION, "last_updated_by" UUID REFERENCES iam.users(id) ON DELETE NO ACTION, "last_updated_date" TIMESTAMP, "approved_by" VARCHAR(255), FOREIGN KEY ("parent_category_code") REFERENCES "shared"."categories" ("code") ON DELETE SET NULL);',
    );
    this.addSql(
      'CREATE TABLE "shared"."tenants" ("tenant_code" TEXT PRIMARY KEY, schema_name TEXT UNIQUE NOT NULL );',
    );
    this.addSql(`CREATE TABLE shared.party_tenants (
                        party_code TEXT REFERENCES shared.parties(party_code) ON DELETE CASCADE,
                        tenant_code TEXT REFERENCES shared.tenants(tenant_code) ON DELETE CASCADE,
                        PRIMARY KEY (party_code, tenant_code)
                    );`);

    this.addSql(`CREATE TABLE "shared"."inventories" (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          sku TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('PERISHABLE', 'NON_PERISHABLE')),
          category_id VARCHAR(255) REFERENCES shared.categories(code) NOT NULL,
          total_stock INTEGER NOT NULL DEFAULT 0,
          available_stock INTEGER NOT NULL DEFAULT 0,
          reserved_stock INTEGER NOT NULL DEFAULT 0,
          purchase_price NUMERIC(10, 2) NOT NULL,
          sale_price NUMERIC(10, 2) NOT NULL,
          minimum_stock INTEGER NOT NULL DEFAULT 0,
          unit TEXT,
          expiry_date TIMESTAMPTZ,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          
  );`);

    this.addSql(`CREATE TABLE shared.inventory_trackers (
                                                            id UUID PRIMARY KEY,
                                                            inventory_id UUID NOT NULL REFERENCES shared.inventories(id),
                                                            purchase_order UUID REFERENCES shared.purchase_orders(id),
                                                            action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'RESERVED', 'RELEASED', 'EXPIRED')),
                                                            quantity NUMERIC NOT NULL,
                                                            previous_stock NUMERIC NOT NULL,
                                                            current_stock NUMERIC NOT NULL,
                                                            reason TEXT,
                                                            reference_number TEXT,
                                                            transaction_date TIMESTAMP NOT NULL
                 );;`);

    this.addSql(`CREATE TABLE "shared"."purchase_orders" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES shared.inventories(id) ON DELETE CASCADE,
    order_quantity INTEGER NOT NULL,
    order_price NUMERIC(10, 2) NOT NULL,
    supplier_name TEXT NOT NULL,
    order_date TIMESTAMPTZ DEFAULT now(),
    delivery_date TIMESTAMPTZ,
    created_date TIMESTAMPTZ DEFAULT now(),
    updated_date TIMESTAMPTZ DEFAULT now()
    );`);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE "iam"."users";');
    this.addSql('DROP TABLE "iam"."user_to_followers";');
    this.addSql('DROP TABLE "shared"."parties";');
    this.addSql('DROP TABLE "shared"."categories";');
    this.addSql('DROP TABLE "shared"."inventories";');
    this.addSql('DROP TABLE "shared"."inventory_tracker";');
    this.addSql('DROP TABLE "shared"."purchase_orders";');
    this.addSql('DROP SCHEMA "iam";');
    this.addSql('DROP SCHEMA "shared";');
  }
}
