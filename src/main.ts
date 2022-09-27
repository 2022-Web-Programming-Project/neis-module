import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums';
import { AppModule } from './app.module';
import { NEIS_PACKAGE_NAME } from './neis/neis.proto';

export const serviceHost = 'localhost';
export const servicePort = 10001;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${serviceHost}:${servicePort}`,
      package: NEIS_PACKAGE_NAME,
      protoPath: 'src/neis/neis.proto',
    },
  });
  await app.listen();

  Logger.log(
    `Microservice is listening on ${serviceHost}:${servicePort}`,
    'Bootstrap',
  );
}
bootstrap();
