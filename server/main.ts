import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const path = join(process.cwd(), 'public');

  app.useStaticAssets(path, { maxAge: '1h' });
  app.useStaticAssets(join(path, 'build'), { immutable: true, maxAge: '1y' });

  // globalThis.app = app;
  await app.listen(3000);
}
bootstrap();
