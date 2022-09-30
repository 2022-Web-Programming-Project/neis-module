import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcClientOptions } from './grpc.options';
import { ScheduleModule } from './schedule/schedule.module';
import { LunchModule } from './lunch/lunch.module';
import { InformationModule } from './information/information.module';
import * as redisStore from 'cache-manager-redis-store';
import * as ms from 'ms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: ms('1h'),
    }),
    GrpcReflectionModule.register(grpcClientOptions),
    ScheduleModule,
    LunchModule,
    InformationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
