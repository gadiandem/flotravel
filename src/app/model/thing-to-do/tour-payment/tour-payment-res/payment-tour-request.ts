import { BookingContact } from "src/app/model/common/booking-contact";
import { CustomerBookingInfo } from "src/app/model/common/customer-booking-info";
import { PaymentInfo } from "src/app/model/flocash/payment-info";
import { ExtrasPackage } from "../../insert-tour/extras-package";
import { ExtraDetailAvailabilityView } from "../../tour-detail/extra-detail-view";
import { ExtrasBookingInfo } from "../extra-booking-info";

export class PaymentTourReq {
  customerBookingInfos: CustomerBookingInfo[];
  paymentInfo: PaymentInfo;
  bookingContact: BookingContact;
  accountBooking: string;
  bookingForUser: boolean;
  userIsBooking: string;
  extrasBookingInfo: ExtrasBookingInfo;
  // schedule: ExtraDetailAvailabilityView;
}
