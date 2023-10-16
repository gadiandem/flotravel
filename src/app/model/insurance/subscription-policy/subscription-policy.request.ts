import { BookingContact } from '../../common/booking-contact';
import { UserInfo } from '../../common/user-info';
import { PaymentInfo } from '../../flocash/payment-info';
import { SearchQouteRequest } from '../search-quote.request';
import { SubscribePolicyData } from './subscribe-policy-data';

export class SubscribePolicyRequest {
    subscribePolicyData: SubscribePolicyData;
    // productInfo: ProductInfo;
    customerInfos: UserInfo[];
    paymentInfo: PaymentInfo;
    bookingContact: BookingContact;
    quoteRequest: SearchQouteRequest;

    sessionId: string;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
}
