import { UserInfo } from '../../common/user-info';
import {BookingContact} from '../../common/booking-contact';
import {PaymentInfo} from '../../flocash/payment-info';

export class PaymentInfoReq {
  bookingId: string;
  customerBookingInfo: UserInfo;
  paymentInfo: PaymentInfo;
  accountBooking: string;
  bookingForUser: boolean;
  userIsBooking: string;
  bookingContact: BookingContact;
}
