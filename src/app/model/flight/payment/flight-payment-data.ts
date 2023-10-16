import { MerchantPayment } from "../../auth/user/merchant-payment";
import { BookingContact } from "../../common/booking-contact";
import { RequestParameters } from "../../hepstar/request-parameters";
import { CardPaymentModel } from "../../hotel/hotel-payment/card-payment.model";
import { SubscribePolicyData } from "../../insurance/subscription-policy/subscribe-policy-data";
import { SubscribePolicyRequest } from "../../insurance/subscription-policy/subscription-policy.request";
import { TraceMeData } from "../../traceme/finalise/traceme-data";
import { OfferItemSelected } from "../offer-price/request/offer-item-selected";
import { PassegerInfo } from "../payment-info/passeger.info";
import { SearchFlightForm } from "../search-flight-form";
import {SelectedFlight} from '../selected-flight';
import {Flight} from '../flight-list/flight';
import { HoldFlightResponse } from "../hold-booking";
import { OrderChangeReq } from "../order-change";

export class FlightPaymentData {
    id : string;
    holdFlightResponse : HoldFlightResponse;
    offerPriceId: string;
    bookingId: number;
    bookingHold : boolean;
    bspBooking: boolean;
    offerItems: OfferItemSelected[];
    vcnPayment: boolean;
    merchantPayment: MerchantPayment;
    cardPayment: CardPaymentModel;
    passegersInfo: PassegerInfo[];
    accountBooking: string;
    searchFlightForm: SearchFlightForm;
    executionId: string;
    currency: string;
    totalPrice: number;
    bookingContact: BookingContact;
    bookingForUser: boolean;
    userIsBooking: string;

    // refund protect add-on
    addonRefundProtect: boolean;
    helpstarSession: string;
    refundProtectPrice: number;
    requestParameters: RequestParameters;
    // refund protect add-on
    addonSmartDelay: boolean;
    smartDelayPrice: number;
    smartDelayRequestParameters: RequestParameters;

    // traceme add-on
    traceMeData: TraceMeData;

    // insuarance add-on
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
