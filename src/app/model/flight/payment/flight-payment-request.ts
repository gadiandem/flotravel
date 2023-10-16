import { BookingContact } from '../../common/booking-contact';
import { CardInfo } from '../../flocash/card-info';
import { FlocashData } from '../../flocash/flocash-data';
import { PaymentInfo } from '../../flocash/payment-info';
import { RequestParameters } from '../../hepstar/request-parameters';
import { SubscribePolicyData } from '../../insurance/subscription-policy/subscribe-policy-data';
import { TraceMeData } from '../../traceme/finalise/traceme-data';
import { CreateOrderReq } from '../create-order/create-order-req';
import { PayerInfo } from '../create-order/payer-info';
import { Travellers } from '../flight-list/request/travellers';
import { OfferItemSelected } from '../offer-price/request/offer-item-selected';
import { PassegerInfo } from '../payment-info/passeger.info';
import {SelectedFlight} from '../selected-flight';
import {Flight} from '../flight-list/flight';
import { MerchantPayment } from '../../auth/user/merchant-payment';
import { CardPaymentModel } from "../../hotel/hotel-payment/card-payment.model";
import { SearchFlightForm } from '../search-flight-form';
import { HoldFlightResponse } from '../hold-booking';
import { OrderChangeReq } from '../order-change';
import { MetaData } from '../flight-list/request/meta-data';

export class FlightPaymentRequest {
  metadata: MetaData;
  id : string;
  provider: number;
  holdFlightResponse : HoldFlightResponse;
  executionId: string;
  bookingId: number;
  bookingHold : boolean;
  offerPriceId: string;
  offerItems: OfferItemSelected[];
  paymentInfo: PaymentInfo;
  customerInfos: PassegerInfo[];
  travellers: Travellers;
  bookingContact: BookingContact;
  accountBooking: string;
  bookingForUser: boolean;
  userIsBooking: string;
  simulator = false;
  bspBooking: boolean;
  vcnPayment: boolean;
  searchFlightForm: SearchFlightForm;
  merchantPayment: MerchantPayment;
  cardPayment: CardPaymentModel;
  passegersInfo: PassegerInfo[];
  currency: string;
  totalPrice: number;
 

  // refund protect add-on
  addonRefundProtect: boolean;
  refundProtectPrice: number;
  requestParameters: RequestParameters;

  // smart delay add-on
  addonSmartDelay: boolean;
  smartDelayPrice: number;
  helpstarSession: string;
  smartDelayRequestParameters: RequestParameters;

  // traceme add-on
  traceMeData: TraceMeData;

  // traceme add-on
  subscribePolicyData: SubscribePolicyData;
  tokenInsurance: string;
  // gca add-on
  addonGca: boolean;
  gcaBookingId: string;

  // info departure, return, nextFlight
  departureFlight: Flight;
  returnFlight: Flight;
  nextFlights: Flight[];
   //change
   orderChange: OrderChangeReq;
   flightType:string;
}
