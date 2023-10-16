import { ErrorsType } from './errors-type';
import { PricedOffer } from './priced-offer';
import { DataLists } from './data-lists';
import {ExchangeResponse} from '../../wallet/deposit/exchange-rate-response';

export class OfferPriceRes{
  id: string;
  errors: ErrorsType;
  currency: string;
  pricedOffer: PricedOffer;
  dataLists: DataLists;
  executionId: string;
  baggageInfo : string[];
  serviceDefinitionTypeList: any[];
  exchangeRate: ExchangeResponse;
}
