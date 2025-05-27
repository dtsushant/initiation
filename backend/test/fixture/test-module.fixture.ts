import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/shared/auth/auth.guard';
import { Type } from '@nestjs/common/interfaces/type.interface';

class TestModuleFixture {
  private _app!: INestApplication;
  async init(): Promise<TestModuleFixture> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    this._app = moduleRef.createNestApplication();
    const jwtAuthGuard = this._app.get(JwtAuthGuard);
    this._app.useGlobalGuards(jwtAuthGuard);
    await this._app.init();
    console.log('Fixture Initialized!');
    return this;
  }

  getRegisteredDi<T>(type: Type<T>): T {
    return this._app.get(type);
  }

  getHttpServer() {
    return this._app.getHttpServer();
  }

  async closeOnTestCompletion() {
    await this._app.close();
  }
}

let fixture: TestModuleFixture | null = null;

export async function initializeTestingModule() {
  if (fixture) throw new Error('TestModuleFixture already initalize');
  fixture = new TestModuleFixture();
  await fixture.init();
}

export function getTestingFixture(): TestModuleFixture | undefined {
  if (!fixture) {
    return undefined;
  }
  return fixture;
}
