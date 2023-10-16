import { BookingContact } from "../common/booking-contact";
import { UserInfo } from "../common/user-info";
import { PaymentInfo } from "../flocash/payment-info";
import { RequestParameters } from "./request-parameters";


export class HepstarPurchaseAndBookingReq {
    requestParameters: RequestParameters;
    customerBookingInfo: UserInfo;
    paymentInfo: PaymentInfo;
    bookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
}