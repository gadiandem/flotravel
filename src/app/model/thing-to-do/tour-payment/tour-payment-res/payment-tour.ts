import { ExtrasPackage } from '../../insert-tour/extras-package';
import { Payer } from 'src/app/model/flocash/payer';

export class PaymentTour {
  id: string;
  userId: string;
  amount: number;
  capturedAmount: number;
  refundedAmount: number;
  orderDate: string;
  currency: string;
  currencyName: string;
  custom: string;
  item_name: string;
  item_price: string;
  quantity: string;
  orderId: string;
  tracking: string;
  traceNumber: string;
  paymentChannel: string;
  payer: Payer;
  payOption: string;
  responseStatus: string;
  sessionId: string;
  fromTime: string;
  toTime: string;
  adultCount: number;
  childCount: number;
  holder: any;
  bookingId: string;
  bookingStatus: string;
  bookingRemarks: string;
  token: string;
  tour: ExtrasPackage;
}
