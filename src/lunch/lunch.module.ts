import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LunchController } from './lunch.controller';
import { LunchService } from './lunch.service';
import * as redisStore from 'cache-manager-redis-store';
import * as ms from 'ms';

@Module({
  imports: [ConfigModule],
  controllers: [LunchController],
  providers: [LunchService],
  exports: [LunchService],
})
export class LunchModule {}
