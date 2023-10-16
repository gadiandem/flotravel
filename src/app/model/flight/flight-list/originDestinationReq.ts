import { AirportRes } from '../airport/airportRes';

export class OriginDestinationReq {
  departure: AirportRes;
  arrival: AirportRes;
  departureDate: string;
}
