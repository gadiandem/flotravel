import * as FlightListActions from './flight-list.actions';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { OriginDestination } from 'src/app/model/flight/flight-list/originDestination';
import { OfferPriceRes } from 'src/app/model/flight/offer-price/offer-price-res';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { Airline } from 'src/app/model/flight/airline/airline';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import { FlightOrderResponse } from 'src/app/model/flight/create-order/flight-order-res';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { flightConstant } from '../flight.constant';
import { HoldFlightResponse } from 'src/app/model/flight/hold-booking';
import { FlightServiceReq } from 'src/app/model/flight/services/service-request';
import { ServiceListResponse } from 'src/app/model/flight/services/service-response';
import { FlightServicesOfferPriceReq } from 'src/app/model/flight/services/service-offerprice-req';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { OrderExchangeReq } from 'src/app/model/flight/order-exchange-req';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';

export interface State {
  searchFlightForm: SearchFlightForm;
  searchFlightResult: OriginDestination[];
  airlineList: Airline[];
  departureFlight: SelectedFlight;
  returnFlight: SelectedFlight;
  nextFlights: SelectedFlight[];
  offerPricesReq: OfferPriceReq;
  orderChangeReq: OrderChangeReq,
  offerPrices: OfferPriceRes;
  flightPartialBookingResult: FlocashPaymentFlight;
  agentVcn: FlocashVCNRes;
  flightBookingReq: FlightPaymentRequest;
  orderExchangeReq: OrderExchangeReq;
  flightServiceReq: FlightServiceReq;
  servicesOfferPriceReq: FlightServicesOfferPriceReq;
  serviceList: ServiceListResponse;
  flightBookingResult: FlightOrderResponse;
  flightChangeResult: any;
  holdBookingResult: HoldFlightResponse;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchFlightForm: null,
  searchFlightResult: JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_LIST_RESULT)) || [],
  airlineList: [],
  departureFlight: null,
  returnFlight: null,
  nextFlights: [],
  offerPricesReq: null,
  orderChangeReq: null,
  offerPrices: JSON.parse(sessionStorage.getItem(flightConstant.OFFER_PRICE_RES)),
  agentVcn: null,
  flightBookingReq: null,
  orderExchangeReq: null,
  flightServiceReq:null,
  servicesOfferPriceReq: null,
  serviceList: null,
  flightBookingResult: null,
  flightPartialBookingResult:null,
  flightChangeResult:null,
  holdBookingResult: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function flightListReducer(
  state: State = initialState,
  action: FlightListActions.FlightListActions
) {
  switch (action.type) {
    case FlightListActions.SEARCH_AIRLINES_START:
      return {
        ...state,
        // loading: true,
      };
    case FlightListActions.SEARCH_AIRLINES_SUCCESS:
      return {
        ...state,
        // loading: false,
        failure: false,
        airlineList: [...action.payload],
      };
    case FlightListActions.SEARCH_AIRLINES_FAIL:
      return {
        ...state,
        // loading: false,
        failure: true,
        errorMessage: action.payload,
      };
    case FlightListActions.SEARCH_FLIGHTS_START:
      return {
        ...state,
        searchFlightResult: [],
        searchFlightForm: Object.assign({}, action.payload),
        loading: true,
      };
    case FlightListActions.SEARCH_FLIGHTS_SUCCESS:
      return {
        ...state,
        searchFlightResult: [...action.payload],
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case FlightListActions.SEARCH_FLIGHTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case FlightListActions.DEPARTURE_FLIGHT:
      return {
        ...state,
        departureFlight: Object.assign({}, action.payload),
      };
    // case FlightListActions.DEPARTURE_FLIGHT_PRICE:
    //   return {
    //     ...state,
    //     departureFlightPrice: Object.assign({}, action.payload)
    //   };
    case FlightListActions.RETURN_FLIGHT:
      return {
        ...state,
        returnFlight: Object.assign({}, action.payload),
      };
    // case FlightListActions.RETURN_FLIGHT_PRICE:
    //   return {
    //     ...state,
    //     returnFlightPrice: Object.assign({}, action.payload)
    //   };
    case FlightListActions.NEXT_FLIGHTS:
      return {
        ...state,
        nextFlights: [...action.payload],
      };
    // case FlightListActions.NEXT_FLIGHTS_PRICE:
    //   return {
    //     ...state,
    //     nextFlightPrices: [...action.payload]
    //   };

    case FlightListActions.OFFER_PRICE_FLIGHTS_START:
      return {
        ...state,
        loading: true,
        offerPricesReq: Object.assign({}, action.payload),
      };
      case FlightListActions.PARTIAL_BOOKING_START:
      return {
        ...state,
        loading: true,
        orderChangeReq: Object.assign({}, action.payload),
      };
      case FlightListActions.PARTIAL_BOOKING_FLIGHTS_SUCCESS:
        return {
          ...state,
          flightPartialBookingResult: Object.assign({}, action.payload),
          loading: false,
          failure: false,
        };
      case FlightListActions.OFFER_PRICE_FLIGHTS_SUCCESS:
      return {
        ...state,
        offerPrices: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case FlightListActions.OFFER_PRICE_FLIGHTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload.errors.error[0].shortText,
        loading: false,
        failure: true,
      };

    case FlightListActions.GET_VCN_START:
      return {
        ...state,
        // tourPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case FlightListActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case FlightListActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case FlightListActions.BOOKING_FLIGHTS_START:
      return {
        ...state,
        loading: true,
        flightBookingReq: Object.assign({}, action.payload),
      };
      case FlightListActions.BOOKING_FLIGHTS_CHANGE:
        return {
          ...state,
          loading: true,
          orderExchangeReq: Object.assign({}, action.payload),
        };
      case FlightListActions.HOLD_BOOKING_START:
      return {
        ...state,
        loading: true,
        flightBookingReq: Object.assign({}, action.payload),
      };
      case FlightListActions.BOOKING_FLIGHTS_TICKET:
      return {
        ...state,
        loading: true,
        flightBookingReq: Object.assign({}, action.payload),
      };
      case FlightListActions.SEARCH_FLIGHTS_SERVICES_START:
      return {
        ...state,
        loading: true,
        flightServiceReq: Object.assign({}, action.payload),
      };
      case FlightListActions.SEARCH_OFFERPRICE_SERVICES_START:
        return {
          ...state,
          loading: true,
          servicesOfferPriceReq: Object.assign({}, action.payload),
        };
      case FlightListActions.FLIGHTS_SERVICES_SUCCESS:
        return {
          ...state,
          serviceList: Object.assign({}, action.payload),
          loading: false,
          failure: false,
        };
      case FlightListActions.BOOKING_FLIGHTS_SUCCESS:
      return {
        ...state,
        flightBookingResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
      case FlightListActions.FLIGHTS_CHANGE_SUCCESS:
        return {
          ...state,
          flightChangeResult: Object.assign({}, action.payload),
          loading: false,
          failure: false,
        };
    case FlightListActions.BOOKING_HOLD_FLIGHTS_SUCCESS:
      return {
        ...state,
        holdBookingResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case FlightListActions.BOOKING_FLIGHTS_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
