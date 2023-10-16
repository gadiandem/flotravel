import {DepartureQuoteReq} from './departure-quote-req';
import {ArrivalQuoteReq} from './arrival-quote-req';
import {Pax} from '../../common/pax';

export class GcaQuoteReq {
  currency: string;
  promo_code: string;
  booker_id: string;
  flightNumber: string;
  pax: Pax;
  departure: DepartureQuoteReq;
  arrival: ArrivalQuoteReq;
}
