import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { badRequestExceptionFilter, httpExceptionFilter, TypeORMErrorFilter } from './core/exceptions';
import { CustomResponseInterceptor } from './core/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('SBC')
  .setDescription('The SBC APIs')
  .setVersion('1.0')
  .build()
  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig, {
    autoTagControllers: true
  });
  SwaggerModule.setup('api', app, documentFactory);

  // Global filters and interceptors
  app.useGlobalFilters(new httpExceptionFilter(), new badRequestExceptionFilter(), new TypeORMErrorFilter());
  app.useGlobalInterceptors(new CustomResponseInterceptor())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
