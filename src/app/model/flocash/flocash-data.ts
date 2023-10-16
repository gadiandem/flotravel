import { CardPaymentModel } from '../hotel/hotel-payment/card-payment.model';
import { Payer } from './payer';
import { PayOption } from './pay-option';
import { Merchant } from './merchant.model';
import { Order } from './order.model';
import { CardInfo } from './card-info';

export class FlocashData {
  order: Order;
  merchant: Merchant;
  payer: Payer;
  payOption: PayOption;
  cardInfo: CardInfo;
}
