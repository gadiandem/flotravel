import { PayOption } from './pay-option';
import { Payer } from './payer';

export class OrderSave {
  amount: number;
  capturedAmount: number;
  refundedAmount: number;
  orderDate: number;
  currency: string;
  currencyName: string;
  custom: string;
  item_name: string;
  item_price: string;
  quantity: string;
  orderId: string;
  tracking: string;
  traceNumber: string;
  partnerMessage: string;
  status: string;
  statusDesc: string;
  paymentChannel: string;
  payer: Payer;
  payOption: PayOption;
  approveCode: string;
  redirect: any;
}
