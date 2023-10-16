import { NuiteeData } from './nuitee-data';
import { FlocashData } from '../../flocash/flocash-data';
import { HotelCustomerInfo } from '../hotel-cart/hotelCustomerInfo';
import { CardInfo } from '../../flocash/card-info';
import { BookingContact } from '../../common/booking-contact';
import { AwsImgUrl } from '../hotel-list/aws-img-url';
import { PaymentInfo } from '../../flocash/payment-info';
import { HotelShoppingReq } from '../../dashboard/hotel/hotel-shopping-req';
import { SubscribePolicyData } from '../../insurance/subscription-policy/subscribe-policy-data';
import { MetaData } from '../../flight/flight-list/request/meta-data';

export class HotelPaymentRequest {
  sessionId: string;
  roomCode: string;
  propertyCode: string;
  hotelCode: number;
  image: AwsImgUrl;
  // price: number;
  // currency: string;
  // cardInfo: CardInfo;
  paymentInfo: PaymentInfo;
  customerBookingInfos: HotelCustomerInfo[];
  bookingContact: BookingContact;
  accountBooking: string;
  bookingForUser: boolean;
  userIsBooking: string;
  demo: boolean;
    //data for case simulator
  hotelShoppingReq: HotelShoppingReq;
    //add-on
    subscribePolicyData:SubscribePolicyData;
    metadata: MetaData;
}
