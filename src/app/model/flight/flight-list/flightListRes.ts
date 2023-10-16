import { OriginDestination } from './originDestination';

export class FlightListRes {
  error: string;
  status: string;
  message: string;
  result: OriginDestination[];
}
