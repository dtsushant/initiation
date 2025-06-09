import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../../../mikro-orm.config';
import { XingineModule } from '../../lib/xingine-nest/xingine.module';
import { moduleMap } from '../app.config';
import { ModulePropertyOptions } from 'xingine';

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
        ...moduleMap,
      ],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    //  const modules =  appController.enabledModules();

    it('should return "Hello World!"', async () => {
      const modules: ModulePropertyOptions[] =
        await appController.enabledModules();
      console.log('the modules', modules);

      expect(appController.enabledModules()).toBe('Hello World!');
    });
  });
});
