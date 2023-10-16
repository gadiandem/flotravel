import {PayOptionRes} from './pay-option-res';
import {Trace} from '../common/trace';
import {Status} from '../common/status';
import {CheckoutResGca} from './checkout-res-gca';
import {Payer} from '../../flocash/payer';

export class PaymentBookingResult {
  createDate: string;
  updateDate: string;
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
  payOption: PayOptionRes;
  approveCode: string;
  redirect: {
    params: any;
  }
  bookingId: string;
  trace: Trace;
  gcaStatus: Status;
  checkoutRes: CheckoutResGca;
  code: string;
  message: string;

  serviceName: string;
  bookingStatus: string;
}
