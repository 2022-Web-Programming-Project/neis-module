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
  lunch: string;
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
}

export interface LunchServiceController {
  getLunchOfDay(
    request: GetLunchOfDayRequest,
  ): Promise<GetLunchOfDayResponse> | Observable<GetLunchOfDayResponse> | GetLunchOfDayResponse;
}

export function LunchServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getLunchOfDay"];
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
