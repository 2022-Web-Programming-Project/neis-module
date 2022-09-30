import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';

export interface CacheState {
  haveLunch: boolean;
}

export async function getCacheState(
  cacheManager: Cache,
  date: DateTime,
): Promise<CacheState> {
  return cacheManager.get<CacheState>(date.toFormat('yyyy-MM-dd'));
}
