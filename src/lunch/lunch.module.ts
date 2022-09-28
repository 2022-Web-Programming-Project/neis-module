import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LunchController } from './lunch.controller';
import { LunchService } from './lunch.service';
import * as redisStore from 'cache-manager-redis-store';
import * as ms from 'ms';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: ms(configService.get<number>('CACHE_TTL')),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [LunchController],
  providers: [LunchService],
})
export class LunchModule {}
