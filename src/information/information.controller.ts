import { Controller } from '@nestjs/common';
import {
  GetSchoolInfoRequest,
  GetSchoolInfoResponse,
  GetSchoolListRequest,
  GetSchoolListResponse,
  InformationServiceController,
  InformationServiceControllerMethods,
} from 'src/grpc/neis.proto';
import { InformationService } from './information.service';

@Controller('information')
@InformationServiceControllerMethods()
export class InformationController implements InformationServiceController {
  constructor(private readonly informationService: InformationService) {}

  async getSchoolInfo(
    request: GetSchoolInfoRequest,
  ): Promise<GetSchoolInfoResponse> {
    const res = await this.informationService.getInformation({
      schoolDistrictCode: request.districtCode,
      schoolCode: request.code,
      schoolName: request.name,
      schoolKind: request.kind,
      location: request.location,
      foundation: request.foundation,
    });
    return { school: res };
  }

  async getSchoolList(
    request: GetSchoolListRequest,
  ): Promise<GetSchoolListResponse> {
    const res = await this.informationService.getInformations({
      schoolDistrictCode: request.districtCode,
      schoolName: request.name,
      schoolKind: request.kind,
      location: request.location,
      foundation: request.foundation,
    });
    return {
      totalCount: res.totalCount,
      schools: res.row,
    };
  }
}
