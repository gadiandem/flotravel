import { Action } from '@ngrx/store';

import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { FlightServiceReq } from 'src/app/model/flight/services/service-request';
import { OriginDestination } from 'src/app/model/flight/flight-list/originDestination';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import { OfferPriceRes } from 'src/app/model/flight/offer-price/offer-price-res';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { Airline } from 'src/app/model/flight/airline/airline';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { FlightOrderResponse } from 'src/app/model/flight/create-order/flight-order-res'; 
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { HoldFlightResponse } from 'src/app/model/flight/hold-booking';
import { ServiceListResponse } from 'src/app/model/flight/services/service-response';
import { FlightServicesOfferPriceReq } from 'src/app/model/flight/services/service-offerprice-req';
import { OrderExchangeReq } from 'src/app/model/flight/order-exchange-req';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';

export const SEARCH_AIRLINES_START = '[Flight] SEARCH_AIRLINES_START';
export const SEARCH_AIRLINES_SUCCESS = '[Flight] SEARCH_AIRLINES_SUCCESS';
export const SEARCH_AIRLINES_FAIL = '[Flight] SEARCH_AIRLINES_FAIL';

export const SEARCH_FLIGHTS_SERVICES_START = '[Flight] SEARCH_FLIGHTS_SERVICES_START';
export const SEARCH_OFFERPRICE_SERVICES_START = '[Flight] SEARCH_OFFERPRICE_SERVICES_START';
export const SEARCH_FLIGHTS_START = '[Flight] SEARCH_FLIGHTS_START';
export const SEARCH_FLIGHTS_FAIL = '[Flight] SEARCH_FLIGHTS_FAIL';
export const SEARCH_FLIGHTS_SUCCESS = '[Flight] SEARCH_FLIGHT_SUCCESS';

export const DEPARTURE_FLIGHT = '[Flight] DEPARTURE_FLIGHT';

export const RETURN_FLIGHT = '[Flight] RETURN_FLIGHT';

export const NEXT_FLIGHTS = '[Flight] NEXT_FLIGHTS';

export const OFFER_PRICE_FLIGHTS_START = '[Flight] OFFER_PRICE_FLIGHTS_START';
export const OFFER_PRICE_FLIGHTS_FAIL = '[Flight] OFFER_PRICE_FLIGHTS_FAIL';
export const OFFER_PRICE_FLIGHTS_SUCCESS =
  '[Flight] OFFER_PRICE_FLIGHTS_SUCCESS';

export const GET_VCN_START = '[Flight] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Flight] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Flight] GET_VCN_FAIL';
export const HOLD_BOOKING_START = '[Flight] HOLD_BOOKING_START';
export const PARTIAL_BOOKING_START = '[Flight] PARTIAL_BOOKING_START';
export const BOOKING_FLIGHTS_START = '[Flight] BOOKING_FLIGHTS_START';
export const BOOKING_FLIGHTS_CHANGE = '[Flight] BOOKING_FLIGHTS_CHANGE';
export const BOOKING_FLIGHTS_TICKET = '[Flight] BOOKING_FLIGHTS_TICKET';
export const BOOKING_FLIGHTS_FAIL = '[Flight] BOOKING_FLIGHTS_FAIL';
export const BOOKING_FLIGHTS_SUCCESS = '[Flight] BOOKING_FLIGHTS_SUCCESS';
export const FLIGHTS_CHANGE_SUCCESS = '[Flight] FLIGHTS_CHANGE_SUCCESS';
export const BOOKING_HOLD_FLIGHTS_SUCCESS = '[Flight] BOOKING_HOLD_FLIGHTS_SUCCESS';
export const PARTIAL_BOOKING_FLIGHTS_SUCCESS = '[Flight] PARTIAL_BOOKING_FLIGHTS_SUCCESS';
export const FLIGHTS_SERVICES_SUCCESS = '[Flight] FLIGHTS_SERVICES_SUCCESS';
export class SearchAirlinesStart implements Action {
  readonly type = SEARCH_AIRLINES_START;
  constructor() {}
}
export class SearchAirlinesSuccess implements Action {
  readonly type = SEARCH_AIRLINES_SUCCESS;
  constructor(public payload: Airline[]) {}
}
export class SearchAirlinesFail implements Action {
  readonly type = SEARCH_AIRLINES_FAIL;
  constructor(public payload: string) {}
}
export class SearchFlightServicesStart implements Action {
  readonly type = SEARCH_FLIGHTS_SERVICES_START;

  constructor(public payload: FlightServiceReq) {}
}
export class ServiceOfferPriceFlightStart implements Action {
  readonly type = SEARCH_OFFERPRICE_SERVICES_START;

  constructor(public payload: FlightServicesOfferPriceReq) {}
}
// search flight
export class SearchFlightStart implements Action {
  readonly type = SEARCH_FLIGHTS_START;

  constructor(public payload: SearchFlightForm) {}
}
export class SearchFlightsSuccess implements Action {
  readonly type = SEARCH_FLIGHTS_SUCCESS;

  constructor(public payload: OriginDestination[]) {}
}

export class SearchFlightsFail implements Action {
  readonly type = SEARCH_FLIGHTS_FAIL;

  constructor(public payload: string) {}
}

export class SelectDepartureFlight implements Action {
  readonly type = DEPARTURE_FLIGHT;

  constructor(public payload: SelectedFlight) {}
}

export class SelectReturnFlight implements Action {
  readonly type = RETURN_FLIGHT;

  constructor(public payload: SelectedFlight) {}
}
export class SelectNextFlights implements Action {
  readonly type = NEXT_FLIGHTS;

  constructor(public payload: SelectedFlight[]) {}
}

export class OfferPriceFlightStart implements Action {
  readonly type = OFFER_PRICE_FLIGHTS_START;
  constructor(public payload: OfferPriceReq) {}
}

export class OfferPriceFlightSuccess implements Action {
  readonly type = OFFER_PRICE_FLIGHTS_SUCCESS;

  constructor(public payload: OfferPriceRes) {}
}

export class OfferPriceFlightFail implements Action {
  readonly type = OFFER_PRICE_FLIGHTS_FAIL;

  constructor(public payload: OfferPriceRes) {}
}
export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: FlightPaymentData) {}
}
export class GetVcnSuccess implements Action {
  readonly type = GET_VCN_SUCCESS;

  constructor(public payload: FlocashVCNRes) {}
}

export class GetVcnFail implements Action {
  readonly type = GET_VCN_FAIL;

  constructor(public payload: string) {}
}export class HoldBookingIssueTicket implements Action {
  readonly type = BOOKING_FLIGHTS_TICKET;
  constructor(public payload: FlightPaymentRequest) {}
}
export class BookingFlightStart implements Action {
  readonly type = BOOKING_FLIGHTS_START;
  constructor(public payload: FlightPaymentRequest) {}
}
export class BookingFlightChange implements Action {
  readonly type = BOOKING_FLIGHTS_CHANGE;
  constructor(public payload: OrderExchangeReq) {}
}
export class HoldBookingStart implements Action {
  readonly type = HOLD_BOOKING_START;
  constructor(public payload: FlightPaymentRequest) {}
}
export class PartialFlightStart implements Action {
  readonly type = PARTIAL_BOOKING_START;
  constructor(public payload: OrderChangeReq) {}
}
export class SearchFlightServicesSuccess implements Action {
  readonly type = FLIGHTS_SERVICES_SUCCESS;

  constructor(public payload: ServiceListResponse) {}
}
export class BookingFlightSuccess implements Action {
  readonly type = BOOKING_FLIGHTS_SUCCESS;

  constructor(public payload: FlightOrderResponse) {}
}
export class FlightChangeSuccess implements Action {
  readonly type = FLIGHTS_CHANGE_SUCCESS;

  constructor(public payload: any) {}
}
export class BookingHoldFlightSuccess implements Action {
  readonly type = BOOKING_HOLD_FLIGHTS_SUCCESS;

  constructor(public payload: HoldFlightResponse) {}
}
export class BookingPartialFlightSuccess implements Action {
  readonly type = PARTIAL_BOOKING_FLIGHTS_SUCCESS;

  constructor(public payload: FlocashPaymentFlight) {}
}

export class BookingFlightFail implements Action {
  readonly type = BOOKING_FLIGHTS_FAIL;

  constructor(public payload: string) {}
}

export type FlightListActions =
  | SearchAirlinesStart
  | SearchAirlinesSuccess
  | SearchAirlinesFail
  | SearchFlightStart
  | SearchFlightsSuccess
  | SearchFlightsFail
  | SelectDepartureFlight
  | SelectReturnFlight
  | SelectNextFlights
  | OfferPriceFlightStart
  | OfferPriceFlightSuccess
  | OfferPriceFlightFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | BookingFlightStart
  | BookingFlightChange
  | HoldBookingIssueTicket
  | HoldBookingStart
  | PartialFlightStart
  | BookingFlightSuccess
  | FlightChangeSuccess
  | BookingHoldFlightSuccess
  | BookingPartialFlightSuccess
  | BookingFlightFail
  | SearchFlightServicesStart
  | ServiceOfferPriceFlightStart
  | SearchFlightServicesSuccess;
