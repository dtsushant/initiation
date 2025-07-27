import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../mikro-orm.config';
import { XingineModule } from 'xingine-nest';
import { moduleMap } from '../app.config';
import { LayoutRenderer } from 'xingine';
import { CacheModule } from '../../shared/cache/cache.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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
    }).compile();

    appController = app.get(AppController);
  });

  describe('root', () => {
    //  const modules =  appController.enabledModules();

    it('should return "Hello World!"', async () => {
      const modules: LayoutRenderer[] =
        await appController.dispatchAllCommissars();
      console.log('the modules', modules);

      expect(appController.dispatchAllCommissars()).toBeDefined();
    });
  });
});
