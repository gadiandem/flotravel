import { OriginalDestination } from '../../flight-list/request/OriginalDestination';
import { MetaData } from '../../flight-list/request/meta-data';
import { Travellers } from '../../flight-list/request/travellers';
import { OrderChangeReq } from '../../order-change';
import { OfferItemSelected } from './offer-item-selected';

export class OfferPriceReq {
  metadata: MetaData;
  offerItems: OfferItemSelected[];
  executionId: string;
  travellers: Travellers;
  bspBooking: boolean;
  // aero extra in  fo
  provider: number;
  originalDestinations: OriginalDestination[];
   //reshop value
   orderChange: OrderChangeReq;
}
