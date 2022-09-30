import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import OpenAPI from 'src/api';
import DateWrapper, { DaysFromRange } from 'src/date';
import * as ms from 'ms';
import { Lunch } from 'src/grpc/neis.proto';
import { getCacheState } from 'src/cache';

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
  }): Promise<Lunch[]> {
    const res = await this.$api
      .get('/mealServiceDietInfo', {
        ATPT_OFCDC_SC_CODE: schoolDistrictCode,
        SD_SCHUL_CODE: schoolCode,
        MMEAL_SC_CODE: mealCode,
        ...date.toObject('MLSV_YMD', 'MLSV_FROM_YMD', 'MLSV_TO_YMD'),
      })
      .then((x) => x.data)
      .then((x) => x.mealServiceDietInfo[1].row);
    return res.map((x) => ({
      atptOfcdcScCode: x.ATPT_OFCDC_SC_CODE,
      atptOfcdcScNm: x.ATPT_OFCDC_SC_NM,
      sdSchulCode: x.SD_SCHUL_CODE,
      schulNm: x.SCHUL_NM,
      mmealScCode: x.MMEAL_SC_CODE,
      mmealScNm: x.MMEAL_SC_NM,
      mlsvYmd: x.MLSV_YMD,
      mlsvFgr: x.MLSV_FGR,
      ddishNm: x.DDISH_NM,
      orplcInfo: x.ORPLC_INFO,
      calInfo: x.CAL_INFO,
      ntrInfo: x.NTR_INFO,
      mlsvFromYmd: x.MLSV_FROM_YMD,
      mlsvToYmd: x.MLSV_TO_YMD,
    }));
  }

  async getState(date: DateTime) {
    return getCacheState(this.cacheManager, date);
  }

  async getLunch(
    schoolDistrictCode: string,
    schoolCode: string,
    date: string,
  ): Promise<Lunch | undefined> {
    return await this.cacheManager.get<Lunch>(
      `lunch:${schoolDistrictCode}:${schoolCode}:${date}`,
    );
  }

  async setLunch(date: string, lunch: Lunch): Promise<void> {
    await this.cacheManager.set(
      `lunch:${lunch.atptOfcdcScCode}:${lunch.sdSchulCode}:${date}`,
      lunch,
      {
        ttl: ms(this.config.get<string>('LUNCH_CACHE_TTL')),
      },
    );
  }

  async getDay(schoolDistrictCode: string, schoolCode: string, date: string) {
    let lunch = await this.cacheManager.get<Lunch>(
      `lunch:${schoolDistrictCode}:${schoolCode}:${date}`,
    );
    if (!lunch) {
      lunch = (
        await this.request({
          schoolDistrictCode,
          schoolCode,
          date: new DateWrapper(DateTime.fromFormat(date, 'yyyy-MM-dd')),
        })
      )[0];
      await this.setLunch(date, lunch);
    }
    return lunch;
  }

  async getWeek(schoolDistrictCode: string, schoolCode: string, date: string) {
    const dateValue = DateTime.fromFormat(date, 'yyyy-MM-dd');
    const days = DaysFromRange(dateValue, dateValue.plus({ week: 1 }));
    // ToDo: Check lunch with cache state
    const savedLunches = await Promise.all(
      days
        .map((x) => x.toFormat('yyyy-MM-dd'))
        .map((x) => this.getLunch(schoolDistrictCode, schoolCode, x)),
    );
    if (savedLunches.every((x) => x)) {
      return savedLunches;
    }
    const lunches = await this.request({
      schoolDistrictCode,
      schoolCode,
      date: new DateWrapper(dateValue, dateValue.plus({ week: 1 })),
    });
    for (const lunch of lunches) {
      await this.setLunch(
        DateTime.fromFormat(lunch.mlsvYmd, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
        lunch,
      );
    }
    return lunches;
  }
}
