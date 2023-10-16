import { FlightsOverview } from './flights-overview';
import { OfferItemType } from './offer-item-type';
import { BaggageAllowance } from './baggage-allowance';
import { OfferType } from './offer-type';

export class PricedOffer extends OfferType {
  flightsOverview: FlightsOverview;
  offerItem: OfferItemType[];
  baggageAllowance: BaggageAllowance[];
  descriptionReferences: any;
  offerID: string;
  owner: string;
  timeLimits: any;
  totalPrice: any;
}
