import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { OpenAPIInterface } from 'neis';
import OpenAPI, { APIWrapper } from 'src/api';
import { Information } from 'src/grpc/neis.proto';

@Injectable()
export class InformationService {
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
    schoolName,
    schoolKind,
    location,
    foundation,
  }: {
    schoolDistrictCode?: string;
    schoolCode?: string;
    schoolName?: string;
    schoolKind?: string;
    location?: string;
    foundation?: string;
  }): Promise<APIWrapper<Information>> {
    const res: APIWrapper<OpenAPIInterface.InformationResponse> =
      await this.$api
        .get('/schoolInfo', {
          ATPT_OFCDC_SC_CODE: schoolDistrictCode,
          SD_SCHUL_CODE: schoolCode,
          SCHUL_NM: schoolName,
          SCHUL_KND_SC_NM: schoolKind,
          LCTN_SC_NM: location,
          FOND_SC_NM: foundation,
        })
        .then((x) => x.data)
        .then((x) => ({
          totalCount: x.schoolInfo[0].head[0].list_total_count,
          row: x.schoolInfo[1].row,
        }));
    return {
      totalCount: res.totalCount,
      row: res.row.map((x) => ({
        districtCode: x.ATPT_OFCDC_SC_CODE,
        districtName: x.ATPT_OFCDC_SC_NM,
        code: x.SD_SCHUL_CODE,
        name: x.SCHUL_NM,
        nameEng: x.ENG_SCHUL_NM,
        kind: x.SCHUL_KND_SC_NM,
        location: x.LCTN_SC_NM,
        organization: x.JU_ORG_NM,
        foundation: x.FOND_SC_NM,
        postalCode: x.ORG_RDNZC,
        address: x.ORG_RDNMA,
        addressDetail: x.ORG_RDNDA,
        telephone: x.ORG_TELNO,
        homepage: x.HMPG_ADRES,
        coeducation: x.COEDU_SC_NM,
        fax: x.ORG_FAXNO,
        highschool: x.HS_SC_NM,
        industrySpecialClass: x.INDST_SPECL_CCCCL_EXST_YN,
        highschoolGeneralBusiness: x.HS_GNRL_BUSNS_SC_NM,
        highschoolSpecialPurpose: x.SPCLY_PURPS_HS_ORD_NM,
        admissionBeforeAfter: x.ENE_BFE_SEHF_SC_NM,
        dayNight: x.DGHT_SC_NM,
        foundationDate: x.FOND_YMD,
        foundationMemorial: x.FOAS_MEMRD,
        modifiedDate: x.LOAD_DTM,
      })),
    };
  }

  async getInformation({
    schoolDistrictCode,
    schoolCode,
    schoolName,
    schoolKind,
    location,
    foundation,
  }: {
    schoolDistrictCode?: string;
    schoolCode?: string;
    schoolName?: string;
    schoolKind?: string;
    location?: string;
    foundation?: string;
  }) {
    const info = await this.request({
      schoolDistrictCode,
      schoolCode,
      schoolName,
      schoolKind,
      location,
      foundation,
    });
    return info.row[0];
  }

  async getInformations({
    schoolDistrictCode,
    schoolCode,
    schoolName,
    schoolKind,
    location,
    foundation,
  }: {
    schoolDistrictCode?: string;
    schoolCode?: string;
    schoolName?: string;
    schoolKind?: string;
    location?: string;
    foundation?: string;
  }): Promise<APIWrapper<Information>> {
    const info = await this.request({
      schoolDistrictCode,
      schoolCode,
      schoolName,
      schoolKind,
      location,
      foundation,
    });
    return info;
  }
}
