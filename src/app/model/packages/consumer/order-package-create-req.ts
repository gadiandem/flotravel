import { BookingContact } from '../../common/booking-contact';
import { CustomerBookingInfo } from '../../common/customer-booking-info';
import { MetaData } from '../../dashboard/hotel/metadata';
import { PaymentInfo } from '../../flocash/payment-info';
import { SubscribePolicyData } from '../../insurance/subscription-policy/subscribe-policy-data';
import { PackagesBookingInfo } from './package-booking-info';
import {PackageShoppingRes} from './package-shopping-res';

export class OrderPackageCreateReq {
  sessionId: string;
  paymentInfo: PaymentInfo;
  customerBookingInfos: CustomerBookingInfo[];
  bookingContact: BookingContact;
  accountBooking: string;
  bookingForUser: boolean;
  userIsBooking: string;
  packagesBookingInfo: PackagesBookingInfo;
  selectedPackage: PackageShoppingRes;
  subscribePolicyData: SubscribePolicyData;
  metadata: MetaData;
}
