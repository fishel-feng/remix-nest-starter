import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import compression from 'compression';
import morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const path = join(process.cwd(), 'public');
  app.use(compression());
  app.useStaticAssets(path, {
    maxAge: '1h',
    setHeaders: setCustomCacheControl,
  });
  app.use(morgan('tiny'));

  // globalThis.app = app;
  await app.listen(3000);
}

const remixBuildPath = join(process.cwd(), 'public', 'build');
function setCustomCacheControl(res: any, filePath: string) {
  // Remix fingerprints its assets so we can cache forever
  if (filePath.startsWith(remixBuildPath)) {
    res.setHeader('Cache-Control', `max-age=${60 * 60 * 24 * 365},immutable`);
  }
}

bootstrap();
