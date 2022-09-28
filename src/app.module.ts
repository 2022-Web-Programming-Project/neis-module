import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcClientOptions } from './grpc.options';
import { ScheduleModule } from './schedule/schedule.module';
import { LunchModule } from './lunch/lunch.module';
import redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    GrpcReflectionModule.register(grpcClientOptions),
    ScheduleModule,
    LunchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
