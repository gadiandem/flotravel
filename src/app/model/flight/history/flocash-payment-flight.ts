import { Customer } from '../../hotel/hotel-payment/customer';
import { FlightDetail } from './flight-detail';
import { OrderSave } from '../../flocash/flocash-payment-order';
import { PaymentTariff } from '../../tariff/tariff-payment';
import { OrderViewRSInfo } from '../create-order/order-viewres-info';
import { Flight } from '../flight-list/flight';
import { FlightPaymentData } from '../payment/flight-payment-data';
import { TraceMeData } from '../../traceme/finalise/traceme-data';
import { SubscribePolicyData } from '../../insurance/subscription-policy/subscribe-policy-data';
import { User } from '../../auth/user/user';
import { PassegerInfo } from '../payment-info/passeger.info';
import { Travellers } from '../flight-list/request/travellers';
import { OrderChangeReq } from '../order-change';

export class FlocashPaymentFlight extends OrderSave{
  id: string;
  userId: string;
  accountBooking : string;
  user : User;
  agentBooking: string;
  agent : string;
  responseStatus: any;
  holder: Customer;
  orderIdOfNDC: string;
  orderItemID: string;
  ownerOfNDC: string;
  bookingStatus: string;
  bookingSuccess: boolean;
  paymentTariff: PaymentTariff;
  token: string;
  baseAmount: number;
  taxes: number;
  createDate: string;
  serviceName : string;
  
  customerInfos: PassegerInfo[];
  qrTicketInfo : any;
  travellers: Travellers;
  // flightDetail: FlightDetail;

  departureAirportCode: string;
  departureDate: string;
  departureTime: string;
  arrivalAirportCode: string;
  arrivalDate: string;
  arrivalTime: string;
  airlineID: string;
  flightNumber: string;
  aircraftCode: string;

  // offerItem
  baggageAllowances: any[];
  orderViewRSInfo: OrderViewRSInfo;

   // info departure, return, nextFlight
   departureFlight: Flight;
   returnFlight: Flight;
   nextFlights: Flight[];

   //extra-info
    addonGca : boolean;
    addonRefundProtect : boolean;
    addonSmartDelay : boolean;
    traceMeData : TraceMeData;
    subscribePolicyData : SubscribePolicyData;
    paymentAeroRes: any;

    //orderChange
    orderChangeReq:OrderChangeReq;
    flightType: string
}
