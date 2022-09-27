import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ScheduleService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async Hello() {
    const value = await this.cacheManager.get<number>('Hello');
    await this.cacheManager.set<number>('Hello', new Date().getTime());
    return value;
  }
}
