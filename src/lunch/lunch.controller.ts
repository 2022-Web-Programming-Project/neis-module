import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  GetLunchOfDayRequest,
  GetLunchOfDayResponse,
  GetLunchOfWeekRequest,
  GetLunchOfWeekResponse,
  LunchServiceController,
  LunchServiceControllerMethods,
} from 'src/grpc/neis.proto';
import { LunchService } from './lunch.service';

@Controller('lunch')
@LunchServiceControllerMethods()
export class LunchController implements LunchServiceController {
  constructor(private readonly lunchService: LunchService) {}

  async getLunchOfDay(
    request: GetLunchOfDayRequest,
  ): Promise<GetLunchOfDayResponse> {
    return {
      lunch: await this.lunchService.getDay(
        request.schoolDistrictCode,
        request.schoolCode,
        request.date,
      ),
    };
  }

  async getLunchOfWeek(
    request: GetLunchOfWeekRequest,
  ): Promise<GetLunchOfWeekResponse> {
    return {
      lunches: await this.lunchService.getWeek(
        request.schoolDistrictCode,
        request.schoolCode,
        request.date,
      ),
    };
  }
}
