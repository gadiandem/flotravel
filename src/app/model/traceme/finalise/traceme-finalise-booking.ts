import { BookingContact } from "../../common/booking-contact";
import { CustomerBookingInfo } from "../../common/customer-booking-info";
import { UserInfo } from "../../common/user-info";
import { PaymentInfo } from "../../flocash/payment-info";
import { TraceMeData } from "./traceme-data";

export class TraceMeFinaliseAndBookingReq {
    traceMeData: TraceMeData;
    customerBookingInfo: UserInfo;
    paymentInfo: PaymentInfo;
    bookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
}