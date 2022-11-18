import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression({ encodings: ['gzip', 'deflate'] }));
  await app.listen(parseInt(process.env.PORT, 10) || 5253);
}
bootstrap();
