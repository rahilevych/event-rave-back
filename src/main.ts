import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      stopAtFirstError: false,
    }),
  );
  const config = new DocumentBuilder()
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
    })
    .addGlobalResponse({
      status: 403,
      description: 'Forbidden',
    })
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error'
    })
    .setTitle('Event Rave')
    .setDescription('The Event Rave API description')
    .setVersion('1.0')
    .addTag('event-rave')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
