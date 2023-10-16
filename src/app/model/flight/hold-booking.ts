import { HoldBookingResponse } from "./booking-hold-response";
import { FlightOrderResponse } from "./create-order/flight-order-res";
import { FlightPaymentRequest } from "./payment/flight-payment-request";

export class HoldFlightResponse {
    id: string;
    status: boolean ;
    flightPaymentReq: FlightPaymentRequest;
    holdBookingResponse: HoldBookingResponse;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
}