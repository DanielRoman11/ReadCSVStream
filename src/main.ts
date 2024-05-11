import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(cors);
  await app.listen(3000);
  console.log(`Application in dev mode on ${await app.getUrl()}`);
}
bootstrap();
