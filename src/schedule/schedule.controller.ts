import { Controller } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  GetHelloRequest,
  GetHelloResponse,
  ScheduleServiceController,
  ScheduleServiceControllerMethods,
} from '../grpc/neis.proto';

@Controller()
@ScheduleServiceControllerMethods()
export class ScheduleController implements ScheduleServiceController {
  constructor(private readonly scheduleService: ScheduleService) {}

  async getHello(req: GetHelloRequest): Promise<GetHelloResponse> {
    return { message: (await this.scheduleService.Hello()).toString() };
  }
}
