import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import OpenAPI, { APIWrapper } from 'src/api';
import DateWrapper, { DaysFromRange } from 'src/date';
import * as ms from 'ms';
import { Lunch } from 'src/grpc/neis.proto';
import { getCacheState } from 'src/cache';
import { OpenAPIInterface } from 'neis';

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
    const res: APIWrapper<OpenAPIInterface.LunchResponse> = await this.$api
      .get('/mealServiceDietInfo', {
        ATPT_OFCDC_SC_CODE: schoolDistrictCode,
        SD_SCHUL_CODE: schoolCode,
        MMEAL_SC_CODE: mealCode,
        ...date.toObject('MLSV_YMD', 'MLSV_FROM_YMD', 'MLSV_TO_YMD'),
      })
      .then((x) => x.data)
      .then((x) => ({
        totalCount: x.mealServiceDietInfo[0].head[0].list_total_count,
        row: x.mealServiceDietInfo[1].row,
      }));
    return res.row.map((x) => ({
      schoolDistrictCode: x.ATPT_OFCDC_SC_CODE,
      schoolDistrictName: x.ATPT_OFCDC_SC_NM,
      schoolCode: x.SD_SCHUL_CODE,
      schoolName: x.SCHUL_NM,
      mealCode: x.MMEAL_SC_CODE,
      mealName: x.MMEAL_SC_NM,
      date: DateTime.fromFormat(x.MLSV_YMD, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
      mealCount: Number.parseInt(x.MLSV_FGR),
      dishName: x.DDISH_NM,
      originInfo: x.ORPLC_INFO,
      calorieInfo: x.CAL_INFO,
      nutritionInfo: x.NTR_INFO,
      mealFromDate: DateTime.fromFormat(x.MLSV_FROM_YMD, 'yyyyMMdd').toFormat(
        'yyyy-MM-dd',
      ),
      mealToDate: DateTime.fromFormat(x.MLSV_TO_YMD, 'yyyyMMdd').toFormat(
        'yyyy-MM-dd',
      ),
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
      `lunch:${lunch.schoolDistrictCode}:${lunch.schoolCode}:${date}`,
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
      await this.setLunch(lunch.date, lunch);
    }
    return lunches;
  }
}
