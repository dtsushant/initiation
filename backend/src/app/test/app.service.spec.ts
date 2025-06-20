// app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';

import { DiscoveryModule } from '@nestjs/core';
import { AppService } from '../app.service';
import { UserModule } from '../../features/user/user.module';
import { CategoryModule } from '../../features/category/category.module';
import { RuleModule } from '../../features/rule/rule.module';
import { JwtAuthGuard } from '../../shared/auth/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { EntityManager, Options } from '@mikro-orm/core';
import { User } from '../../features/user/entity/user.entity';
import { Category } from '../../features/category/category.entity';
import { AppModule } from '../app.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../mikro-orm.config';
import { XingineModule } from 'xingine-nest';
import { moduleMap } from '../app.config';
import { CacheModule } from '../../shared/cache/cache.module';

describe('AppService (with real modules)', () => {
  let appService: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          ...ormConfig,
          registerRequestContext: false,
        }),
        XingineModule,
        CacheModule,
        ...moduleMap,
      ],
      providers: [AppService],
    })
      // .overrideProvider(EntityManager)
      // .useValue({ find: jest.fn(), persistAndFlush: jest.fn() })
      /*.overrideProvider(PassportModule)
                  .useValue({
                      register: () => ({})
                  })
                  .overrideProvider(JwtAuthGuard)
                  .useValue({
                      canActivate: jest.fn(() => true), // ← allows all requests through
                  })
                  .overrideProvider(GoogleStrategy)
                  .useValue({})*/
      .compile();

    appService = module.get(AppService);
  });

  it('should return module metadata from InspectorService', async () => {
    const metadata = await appService.getModuleMetadata();
    console.log('Module Metadata:', JSON.stringify(metadata, null, 2));

    expect(metadata).toBeDefined();
    expect(Array.isArray(metadata)).toBe(true);
    expect(metadata.length).toBeGreaterThan(0);

    for (const entry of metadata) {
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('uiComponent');
    }
  });

  it('should return all path in system', async () => {
    const metadata = await appService.getAllAPIPath();
    console.log('Module Metadata:', JSON.stringify(metadata, null, 2));
  });
});
