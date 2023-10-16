import { TotalPriceDetail } from './total-price-detail';
import { Service } from './service';
import { FareDetailType } from './fare-detail-type';

export class OfferItemType {
  totalPriceDetail: TotalPriceDetail;
  service: Service[];
  fareDetail: FareDetailType[];
  offerItemID: string;
  mandatoryInd: boolean;
  modificationProhibitedInd: boolean;
}
