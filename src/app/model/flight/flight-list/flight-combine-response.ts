import {OriginDestination} from './originDestination';

export class FlightCombineResponse {
  hahnAir: OriginDestination[];
  et: OriginDestination[];
  aero: OriginDestination[];
  floAir: OriginDestination[];
  qr: OriginDestination[];
  traceId: string;
}
