import { FlightSegments } from './flightSegments';
import { OfferItem } from './offerItem';

export class Flight {

  flightKey: string;
  depAirportCode: string;
  depAirportName: string;
  depDateTime: string;
  arrAirportCode: string;
  arrAirportName: string;
  arrDateTime: string;
  flightSegments: FlightSegments[];
  offerItems: {[key: string]: OfferItem};
  offerItemList: OfferItem[];
  provider: number;
  // totalPrice : number;
}
