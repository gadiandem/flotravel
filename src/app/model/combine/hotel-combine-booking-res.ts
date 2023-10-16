import { PaymentRes } from '../hotel/hotel-payment/payment.res';
import {OrderPackageCreateRes} from '../packages/consumer/order-package-create-res';

export class HotelCombineBookingRes {
  hotelNuitee: PaymentRes;
  hotelNCT: OrderPackageCreateRes;
  hotelSimulator: PaymentRes;
}