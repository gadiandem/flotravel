import { AirportRes } from './airport/airportRes';
import { OrderChangeReq } from './order-change';

export class SearchFlightForm {
  flyFrom: AirportRes;
  destination: AirportRes;
  departuring: string;
  returning: string;
  adults: number;
  children: number;
  infants: number;
  flyFromNext: AirportRes[];
  destinationNext: AirportRes[];
  departuringNext: string[];
  typeFlight: string;
  classType: string;
  simulator: boolean;
  bspBooking: boolean;
  flightClass : string;
  // reshop value
  orderChange: OrderChangeReq;
}
