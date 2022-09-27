import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc.options';

export const serviceHost = 'localhost';
export const servicePort = 10001;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );
  await app.listen();

  Logger.log(
    `Microservice is listening on ${serviceHost}:${servicePort}`,
    'Bootstrap',
  );
}
bootstrap();
