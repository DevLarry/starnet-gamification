import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        expires: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });
  // app.use(serveStatic('public', {}));
  // somewhere in your initialization file
  app.useStaticAssets(join(__dirname, '..', '/public'));
  const config = new DocumentBuilder()
    .setTitle("Starnet Gamification's Backend Documentation")
    .setDescription(
      '<h2>The must-know about the Apiendpoints.</h2> <br/> The backend for Starnet Gamification platform. <br/> This documentation provides details about the available API endpoints, request/response formats, authentication methods, and usage guidelines to help developers integrate with the Starnet Gamification services effectively. <br/><h3>Authentication/Authorization</h3> The routes with <b>lock icon</b> require authentication and returns a `401 Unauthorized` error if the token is missing or invalid, cookies are used for session management on web applications but mobile apps use the Bearer token in the Authorization header <br/>_*Note:*_ `the token is issued on login`.',
    )
    .setVersion('1.0')
    .addTag('Home')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/doc', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
