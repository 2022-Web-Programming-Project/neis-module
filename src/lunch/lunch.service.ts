import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import OpenAPI from 'src/api';
import DateWrapper from 'src/date';
import * as ms from 'ms';

@Injectable()
export class LunchService {
  private readonly $api: OpenAPI;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private config: ConfigService,
  ) {
    this.$api = new OpenAPI(config.get<string>('NEIS_API_KEY'));
  }

  async request({
    schoolDistrictCode,
    schoolCode,
    mealCode,
    date,
  }: {
    schoolDistrictCode: string;
    schoolCode: string;
    mealCode?: string;
    date?: DateWrapper;
  }) {
    const res = await this.$api
      .get('/mealServiceDietInfo', {
        ATPT_OFCDC_SC_CODE: schoolDistrictCode,
        SD_SCHUL_CODE: schoolCode,
        MMEAL_SC_CODE: mealCode,
        ...date.toObject('MLSV_YMD', 'MLSV_FROM_YMD', 'MLSV_TO_YMD'),
      })
      .then((x) => x.data);
    return res;
  }

  async getDay(schoolDistrictCode: string, schoolCode: string, date: string) {
    let value = await this.cacheManager.get<string>(
      `lunch:${schoolDistrictCode}:${schoolCode}:${date}`,
    );
    if (!value) {
      value = await this.request({
        schoolDistrictCode,
        schoolCode,
        date: new DateWrapper(DateTime.fromFormat(date, 'yyyy-MM-dd')),
      });
      await this.cacheManager.set(
        `lunch:${schoolDistrictCode}:${schoolCode}:${date}`,
        value,
        {
          ttl: ms(this.config.get<string>('LUNCH_CACHE_TTL')),
        },
      );
    }
    return JSON.stringify(value);
  }
}
