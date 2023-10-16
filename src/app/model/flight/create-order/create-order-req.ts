import { Travellers } from '../flight-list/request/travellers';
import { CardInfo } from '../../flocash/card-info';
import { PayerInfo } from './payer-info';
import { PassegerInfo } from '../payment-info/passeger.info';

export class CreateOrderReq {
  executionId: string;
  currency: string;
  total: number;
  travellers: Travellers;
  departureAirportCode: string;
  otherPassengerInfo: PassegerInfo[];
  cardInfo: CardInfo;
  payerInfo: PayerInfo;
  userId: string;
}
