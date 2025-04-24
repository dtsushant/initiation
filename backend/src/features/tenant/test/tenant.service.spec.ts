import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../../mikro-orm.config';
import { TenantModule } from '../tenant.module';
import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.entity';

describe('TenantService Test', () => {
  let tenantService: TenantService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          registerRequestContext: false,
        }),
        MikroOrmModule.forFeature({ entities: [Tenant] }),
      ],
      providers: [TenantService],
    }).compile();

    tenantService = app.get<TenantService>(TenantService) as TenantService;
  });

  describe('createTenantTest', () => {
    //  const modules =  appController.enabledModules();

    it('Should register the tenant"', async () => {
      //const ten1 = await tenantService.createTenant("001","SCHEMA_001");
      const ten2 = await tenantService.createTenant('002', 'SCHEMA_002');
      const ten3 = await tenantService.createTenant('003', 'SCHEMA_003');
      const ten4 = await tenantService.createTenant('004', 'SCHEMA_004');
      const ten5 = await tenantService.createTenant('005', 'SCHEMA_005');
      // expect(ten1.tenantCode).toBe('001');
      expect(ten2.tenantCode).toBe('002');
      expect(ten3.tenantCode).toBe('003');
      expect(ten4.tenantCode).toBe('004');
      expect(ten5.tenantCode).toBe('005');
    });
  });
});
