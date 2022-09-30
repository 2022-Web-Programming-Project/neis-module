/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "neis";

export interface GetHelloRequest {
}

export interface GetHelloResponse {
  message: string;
}

export interface GetLunchOfDayRequest {
  schoolDistrictCode: string;
  schoolCode: string;
  date: string;
}

export interface GetLunchOfDayResponse {
  lunch: Lunch | undefined;
}

export interface GetLunchOfWeekRequest {
  schoolDistrictCode: string;
  schoolCode: string;
  date: string;
}

export interface GetLunchOfWeekResponse {
  lunches: Lunch[];
}

export interface Lunch {
  /**
   * 1	    ATPT_OFCDC_SC_CODE	    시도교육청코드
   * 2	    ATPT_OFCDC_SC_NM	    시도교육청명
   * 3	    SD_SCHUL_CODE	    표준학교코드
   * 4	    SCHUL_NM	    학교명
   * 5	    MMEAL_SC_CODE	    식사코드
   * 6	    MMEAL_SC_NM	    식사명
   * 7	    MLSV_YMD	    급식일자
   * 8	    MLSV_FGR	    급식인원수
   * 9	    DDISH_NM	    요리명
   * 10	    ORPLC_INFO	    원산지정보
   * 11	    CAL_INFO	    칼로리정보
   * 12	    NTR_INFO	    영양정보
   * 13	    MLSV_FROM_YMD	    급식시작일자
   * 14	    MLSV_TO_YMD	    급식종료일자
   */
  schoolDistrictCode: string;
  /** ATPT_OFCDC_SC_NM 시도교육청명 */
  schoolDistrictName: string;
  /** SD_SCHUL_CODE 표준학교코드 */
  schoolCode: string;
  /** SCHUL_NM 학교명 */
  schoolName: string;
  /** MMEAL_SC_CODE 식사코드 */
  mealCode: string;
  /** MMEAL_SC_NM 식사명 */
  mealName: string;
  /** MLSV_YMD 급식일자 */
  date: string;
  /** MLSV_FGR 급식인원수 */
  mealCount: number;
  /** DDISH_NM 요리명 */
  dishName: string;
  /** ORPLC_INFO 원산지정보 */
  originInfo: string;
  /** CAL_INFO 칼로리정보 */
  calorieInfo: string;
  /** NTR_INFO 영양정보 */
  nutritionInfo: string;
  /** MLSV_FROM_YMD 급식시작일자 */
  mealFromDate: string;
  /** MLSV_TO_YMD 급식종료일자 */
  mealToDate: string;
}

export interface GetSchoolInfoRequest {
  districtCode: string;
  code: string;
  name: string;
  kind: string;
  location: string;
  foundation: string;
}

export interface GetSchoolInfoResponse {
  school: Information | undefined;
}

export interface GetSchoolListRequest {
  districtCode: string;
  name: string;
  kind: string;
  location: string;
  foundation: string;
}

export interface GetSchoolListResponse {
  totalCount: number;
  schools: Information[];
}

export interface Information {
  /**
   * 1	    ATPT_OFCDC_SC_CODE	    시도교육청코드
   * 2	    ATPT_OFCDC_SC_NM	    시도교육청명
   * 3	    SD_SCHUL_CODE	    표준학교코드
   * 4	    SCHUL_NM	    학교명
   * 5	    ENG_SCHUL_NM	    영문학교명
   * 6	    SCHUL_KND_SC_NM	    학교종류명
   * 7	    LCTN_SC_NM	    소재지명
   * 8	    JU_ORG_NM	    관할조직명
   * 9	    FOND_SC_NM	    설립명
   * 10	    ORG_RDNZC	    도로명우편번호
   * 11	    ORG_RDNMA	    도로명주소
   * 12	    ORG_RDNDA	    도로명상세주소
   * 13	    ORG_TELNO	    전화번호
   * 14	    HMPG_ADRES	    홈페이지주소
   * 15	    COEDU_SC_NM	    남녀공학구분명
   * 16	    ORG_FAXNO	    팩스번호
   * 17	    HS_SC_NM	    고등학교구분명
   * 18	    INDST_SPECL_CCCCL_EXST_YN	    산업체특별학급존재여부
   * 19	    HS_GNRL_BUSNS_SC_NM	    고등학교일반실업구분명
   * 20	    SPCLY_PURPS_HS_ORD_NM	    특수목적고등학교계열명
   * 21	    ENE_BFE_SEHF_SC_NM	    입시전후기구분명
   * 22	    DGHT_SC_NM	    주야구분명
   * 23	    FOND_YMD	    설립일자
   * 24	    FOAS_MEMRD	    개교기념일
   * 25	    LOAD_DTM	    수정일
   */
  districtCode: string;
  /** 시도교육청명 */
  districtName: string;
  /** 표준학교코드 */
  code: string;
  /** 학교명 */
  name: string;
  /** 영문학교명 */
  nameEng: string;
  /** 학교종류명 */
  kind: string;
  /** 소재지명 */
  location: string;
  /** 관할조직명 */
  organization: string;
  /** 설립명 */
  foundation: string;
  /** 도로명우편번호 */
  postalCode: string;
  /** 도로명주소 */
  address: string;
  /** 도로명상세주소 */
  addressDetail: string;
  /** 전화번호 */
  telephone: string;
  /** 홈페이지주소 */
  homepage: string;
  /** 남녀공학구분명 */
  coeducation: string;
  /** 팩스번호 */
  fax: string;
  /** 고등학교구분명 */
  highschool: string;
  /** 산업체특별학급존재여부 */
  industrySpecialClass: string;
  /** 고등학교일반실업구분명 */
  highschoolGeneralBusiness: string;
  /** 특수목적고등학교계열명 */
  highschoolSpecialPurpose: string;
  /** 입시전후기구분명 */
  admissionBeforeAfter: string;
  /** 주야구분명 */
  dayNight: string;
  /** 설립일자 */
  foundationDate: string;
  /** 개교기념일 */
  foundationMemorial: string;
  /** 수정일 */
  modifiedDate: string;
}

export const NEIS_PACKAGE_NAME = "neis";

export interface ScheduleServiceClient {
  getHello(request: GetHelloRequest): Observable<GetHelloResponse>;
}

export interface ScheduleServiceController {
  getHello(request: GetHelloRequest): Promise<GetHelloResponse> | Observable<GetHelloResponse> | GetHelloResponse;
}

export function ScheduleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getHello"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ScheduleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ScheduleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SCHEDULE_SERVICE_NAME = "ScheduleService";

export interface LunchServiceClient {
  getLunchOfDay(request: GetLunchOfDayRequest): Observable<GetLunchOfDayResponse>;

  getLunchOfWeek(request: GetLunchOfWeekRequest): Observable<GetLunchOfWeekResponse>;
}

export interface LunchServiceController {
  getLunchOfDay(
    request: GetLunchOfDayRequest,
  ): Promise<GetLunchOfDayResponse> | Observable<GetLunchOfDayResponse> | GetLunchOfDayResponse;

  getLunchOfWeek(
    request: GetLunchOfWeekRequest,
  ): Promise<GetLunchOfWeekResponse> | Observable<GetLunchOfWeekResponse> | GetLunchOfWeekResponse;
}

export function LunchServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getLunchOfDay", "getLunchOfWeek"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("LunchService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("LunchService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LUNCH_SERVICE_NAME = "LunchService";

export interface InformationServiceClient {
  getSchoolInfo(request: GetSchoolInfoRequest): Observable<GetSchoolInfoResponse>;

  getSchoolList(request: GetSchoolListRequest): Observable<GetSchoolListResponse>;
}

export interface InformationServiceController {
  getSchoolInfo(
    request: GetSchoolInfoRequest,
  ): Promise<GetSchoolInfoResponse> | Observable<GetSchoolInfoResponse> | GetSchoolInfoResponse;

  getSchoolList(
    request: GetSchoolListRequest,
  ): Promise<GetSchoolListResponse> | Observable<GetSchoolListResponse> | GetSchoolListResponse;
}

export function InformationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getSchoolInfo", "getSchoolList"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("InformationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("InformationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const INFORMATION_SERVICE_NAME = "InformationService";
