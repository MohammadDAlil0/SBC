import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { badRequestExceptionFilter, httpExceptionFilter, TypeORMErrorFilter } from './core/exceptions';
import { CustomResponseInterceptor } from './core/interceptors';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'node_modules', 'swagger-ui-dist'), {
    prefix: '/swagger-ui-assets'
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Security Midllewares
  app.use(helmet());

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
  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: 'API Docs',
    customfavIcon: '/swagger-ui-assets/favicon-32x32.png',
    customJs: [
      '/swagger-ui-assets/swagger-ui-bundle.js',
      '/swagger-ui-assets/swagger-ui-standalone-preset.js'
    ],
    customCssUrl: '/swagger-ui-assets/swagger-ui.css'
  });

  // Global filters and interceptors
  app.useGlobalFilters(new httpExceptionFilter(), new badRequestExceptionFilter(), new TypeORMErrorFilter());
  app.useGlobalInterceptors(new CustomResponseInterceptor())

  await app.listen(process.env.SERVER_PORT ?? 3000, '0.0.0.0');
}
module.exports = bootstrap();
