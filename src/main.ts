

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './libs/helper/global-exception.filter';
declare const module: any;

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  });
  await app.listen(8071);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}


bootstrap();
