import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Actions, Effect, ofType} from '@ngrx/effects';

import {environment} from '../../../environments/environment';
import * as fromApp from '../../store/app.reducer';
import * as FlightActions from './flight-list.actions';
import {of} from 'rxjs';
import {FlightSearchReq} from 'src/app/model/flight/flight-list/request/flightSearchReq';
import {OriginDestination} from 'src/app/model/flight/flight-list/originDestination';
import {OfferItem} from 'src/app/model/flight/flight-list/offerItem';
import {Flight} from 'src/app/model/flight/flight-list/flight';
import {MetaData} from 'src/app/model/dashboard/hotel/metadata';
import {OriginalDestination} from 'src/app/model/flight/flight-list/request/OriginalDestination';
import {Arrival} from 'src/app/model/flight/flight-list/request/arrival';
import {Departure} from 'src/app/model/flight/flight-list/request/departure';
import {CalendarDates} from 'src/app/model/flight/flight-list/request/calendar-dates';
import {Preference} from 'src/app/model/flight/flight-list/request/preference';
import {CabinPreferences} from 'src/app/model/flight/flight-list/request/cabin-preference';
import {FareReferences} from 'src/app/model/flight/flight-list/request/fare-references';
import {Travellers} from 'src/app/model/flight/flight-list/request/travellers';
import {CabinType} from 'src/app/model/flight/flight-list/request/cabinType';
import {FlightType} from 'src/app/model/flight/flight-list/request/flight-type';
import {OfferPriceRes} from 'src/app/model/flight/offer-price/offer-price-res';
import {demoFlightData, flightConstant, flightProvider, flightTypeValue} from '../flight.constant';
import {Airline} from 'src/app/model/flight/airline/airline';
import {FlightOrderResponse} from 'src/app/model/flight/create-order/flight-order-res';
import {AirportRes} from 'src/app/model/flight/airport/airportRes';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {VcnRequest} from 'src/app/model/flocash/response/vcn-request';
import {FlocashVCNRes} from 'src/app/model/common/flocash-vcn-res';
import {appConstant, serviceName} from 'src/app/app.constant';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {FlightCombineResponse} from '../../model/flight/flight-list/flight-combine-response';
import {HoldFlightResponse} from 'src/app/model/flight/hold-booking';
import {FlightServiceReq} from 'src/app/model/flight/services/service-request';
import {ServiceListResponse} from 'src/app/model/flight/services/service-response';
import {FlightServicesOfferPriceReq} from 'src/app/model/flight/services/service-offerprice-req';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';


const searchNDCFlightUrl = environment.baseUrl + 'ndc/AirShopping';
const searchAeroFlightUrl = environment.baseUrl + 'aero/AirShopping';
const searchETFlightUrl = environment.baseUrl + 'et/AirShopping';
const searchAirlineUrl = environment.baseUrl + 'ndc/airlines';
const offerNdcPriceUrl = environment.baseUrl + 'ndc/OfferPrice';
const offerAeroPriceUrl = environment.baseUrl + 'aero/OfferPrice';
const offerETPriceUrl = environment.baseUrl + 'et/OfferPrice';
const createNDCOrderUrl = environment.baseUrl + 'ndc/createOrder';
const createAeroOrderUrl = environment.baseUrl + 'aero/booking';
const createEtOrderUrl = environment.baseUrl + 'et/createOrder';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';
// combine new api
const searchCombineFlightUrl = environment.baseUrl + 'flight/shopping';
const offerPriceCombineFlightUrl = environment.baseUrl + 'flight/offer-price';
const createOrderCombineFlightUrl = environment.baseUrl + 'flight/create-order';
const issueTicketCombineFlightUrl = environment.baseUrl + 'hold/issueTicket';
const holdBookingCombineFlightUrl = environment.baseUrl + 'flight/hold-order';
const partialBookingCombineFlightUrl = environment.baseUrl + 'flight/partial-order';
const servicesCombineFlightUrl = environment.baseUrl + 'flight/servicesAvailability';
const serviceOfferPriceCombineFlightUrl = environment.baseUrl + 'flight/services/offerPrice';
const changeOrderCombineFlightUrl = environment.baseUrl + 'flight/change-order';

class FlightSelection {
  flightList: Flight;
  minPrice: OfferItem;
}

const handleFlightResult = (flightListRes: OriginDestination[]) => {
  const airlines: Airline[] = JSON.parse(localStorage.getItem(flightConstant.AIRLINE_LIST));
  flightListRes.forEach((o) => {
    o.flightList.forEach((f) => {
      if (f.flightSegments) {
        f.flightSegments.forEach(s => {
          const airline = airlines.find(
            (e) => e.iata === s.airline
          );
          if (airline) {
            s.airline = s.airline.concat('-', airline.name);
          }
        });
      }
    });
  });

  sortFlight(flightListRes);
  sessionStorage.setItem(flightConstant.FLIGHT_LIST_RESULT, JSON.stringify(flightListRes));
  return new FlightActions.SearchFlightsSuccess(flightListRes);
};

const sortFlight = (originDestinations: OriginDestination[]) => {
  originDestinations.forEach((o) => {
    const allOfferItemList = [];
    o.flightList.forEach((e) => {
      allOfferItemList.push(e.offerItemList);
    });
    o.flightList = getMinOfferItem(allOfferItemList, [...o.flightList]);
  });
};

const getMinOfferItem = (allOfferItemList: any, flightList: Flight[]) => {
  const minOfferItemList = [];
  let minItem: OfferItem;
  allOfferItemList.forEach((list) => {
    minItem = new OfferItem();
    let max = Number.POSITIVE_INFINITY;
    let tmp: number;
    list.forEach((e) => {
      tmp = e.totalAmount;
      if (tmp < max) {
        max = tmp;
        minItem = e;
      }
    });
    minOfferItemList.push(minItem);
    const compareOfferItemFn = (a: OfferItem, b: OfferItem) => {
      if (a.totalAmount < b.totalAmount) {
        return -1;
      }
      if (a.totalAmount > b.totalAmount) {
        return 1;
      }
      return 0;
    };
    list = (list as Array<OfferItem>).sort(compareOfferItemFn);
  });
  // let flightListBefore: Flight[] = flightList;
  // flightListBefore.sort()
  const result = [];
  const flightSelection: FlightSelection[] = [];
  flightList.forEach((f, index) => {
    const item = new FlightSelection();
    item.flightList = f;
    item.minPrice = minOfferItemList[index];
    flightSelection.push(item);
  });
  const compareFn = (a: FlightSelection, b: FlightSelection) => {
    if (a.minPrice.totalAmount < b.minPrice.totalAmount) {
      return -1;
    }
    if (a.minPrice.totalAmount > b.minPrice.totalAmount) {
      return 1;
    }
    return 0;
  };
  const sortitem = flightSelection.sort(compareFn);
  sortitem.forEach((item) => {
    result.push(item.flightList);
  });
  flightList = result;
  return flightList;
};

const handleAirlineResult = (airlineListRes: Airline[]) => {
  localStorage.setItem(
    flightConstant.AIRLINE_LIST,
    JSON.stringify(airlineListRes)
  );
  return new FlightActions.SearchAirlinesSuccess(airlineListRes);
};
const handleServiceAvailabilityResult = (result: ServiceListResponse) => {
  sessionStorage.setItem(
    flightConstant.FLIGHT_SEVICES_RES,
    JSON.stringify(result)
  );
  return new FlightActions.SearchFlightServicesSuccess(result);
};

const handleBookingResult = (result: FlightOrderResponse) => {
  sessionStorage.setItem(
    flightConstant.FLIGHT_BOOKING_RES,
    JSON.stringify(result)
  );
  return new FlightActions.BookingFlightSuccess(result);
};
const handleChangeResult = (result: any) => {
  sessionStorage.setItem(
    flightConstant.FLIGHT_BOOKING_RES,
    JSON.stringify(result)
  );
  return new FlightActions.FlightChangeSuccess(result);
};
const handleBookingHoldResult = (result: HoldFlightResponse) => {
  sessionStorage.setItem(
    flightConstant.FLIGHT_HOLD_BOOKING_RES,
    JSON.stringify(result)
  );
  return new FlightActions.BookingHoldFlightSuccess(result);
};
const handlePartialBookingResult = (result: FlocashPaymentFlight) => {
  sessionStorage.setItem(
    flightConstant.PARTIAL_FLIGHT_BOOKING_RES,
    JSON.stringify(result)
  );
  return new FlightActions.BookingPartialFlightSuccess(result);
};

const handleRequestVCNSuccess = (
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new FlightActions.GetVcnSuccess(vcnRes);
};

const handleError = (errorRes: any) => {
  // const errorMessage = "An unknown error occurred! try again.";
  let errorMessage = 'An unknown error occurred! try again.';
  if (typeof errorRes === 'string') {
    errorMessage = errorRes;
  }
  if (errorRes.status === 500) {
    errorMessage = 'Server encountered an error! try again.';
  }
  if (errorRes.error != null) {
    const messages = (errorRes.error.message as string).split('-');
    errorMessage = messages.length > 1 ? (errorRes.error.message as string).split('-')[1] : errorRes.error.message;
  }
  return of(new FlightActions.SearchFlightsFail(errorMessage));

};

const handleOfferPrice = (res: OfferPriceRes) => {
  sessionStorage.setItem(flightConstant.OFFER_PRICE_RES, JSON.stringify(res));
  // if (res.executionId) {
  //   sessionStorage.setItem(flightConstant.EXECUTION_ID, res.executionId);
  // }
  return new FlightActions.OfferPriceFlightSuccess(res);
};

@Injectable()
export class FlightListEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private flightPaymentService: PaymentService
  ) {
  }

  user: UserDetail;
  traceId: string;
  @Effect()
  fetchFlightList = this.actions$.pipe(
    ofType(FlightActions.SEARCH_FLIGHTS_START),
    switchMap((flightListRes: FlightActions.SearchFlightStart) => {
      const searchFlight = flightListRes.payload;
      // sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(searchFlight));
      const searchData = new FlightSearchReq();
      searchData.orgId = '';
      const metadata = new MetaData();
      metadata.country = searchFlight.flyFrom.code;
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      searchData.metadata = metadata;
      searchData.simulator = searchFlight.simulator || false;
      searchData.bspBooking = searchFlight.bspBooking || false;
      // original-destination-list
      const originDestinations: OriginalDestination[] = [];
      // origin-destination
      const originDestination = new OriginalDestination();
      // arrival
      const arrival = new Arrival();
      arrival.airportCode = searchFlight.destination.code;
      originDestination.arrival = arrival;
      // departure
      const depature = new Departure();
      depature.airportCode = searchFlight.flyFrom.code;
      depature.date = searchFlight.departuring;
      originDestination.departure = depature;
      // add to original destination list
      originDestinations.push(originDestination);
      // order change
      if (searchFlight.orderChange) {
        searchData.orderChange = searchFlight.orderChange;
      }
      if (flightListRes.payload.typeFlight === flightTypeValue.ROUND_TRIP) {
        const returnDestination = new OriginalDestination();
        // arrival
        const arrival_return = new Arrival();
        arrival_return.airportCode = searchFlight.flyFrom.code;
        returnDestination.arrival = arrival_return;
        // departure
        const depature_return = new Departure();
        depature_return.airportCode = searchFlight.destination.code;
        depature_return.date = searchFlight.returning;
        returnDestination.departure = depature_return;
        // add to original destination list
        originDestinations.push(returnDestination);
      }
      if (flightListRes.payload.typeFlight === flightTypeValue.MULTI_CITY) {
        flightListRes.payload.flyFromNext.forEach(
          (f: AirportRes, index: number) => {
            const nextDestination = new OriginalDestination();
            // arrival
            const arrival_next = new Arrival();
            arrival_next.airportCode = searchFlight.destinationNext[index].code;
            nextDestination.arrival = arrival_next;
            // departure
            const depature_next = new Departure();
            depature_next.airportCode = searchFlight.flyFromNext[index].code;
            depature_next.date = searchFlight.departuringNext[index];
            nextDestination.departure = depature_next;
            originDestinations.push(nextDestination);
          }
        );
      }
      searchData.originalDestinations = originDestinations;
      // calendarDates property
      const calendarDates = new CalendarDates();
      calendarDates.daysBefore = 0;
      calendarDates.daysAfter = 0;
      searchData.calendarDates = calendarDates;
      // preference property
      const preference = new Preference();
      // cabin-preferences
      const cabinPreferences = new CabinPreferences();
      const cabinType = new CabinType();
      //  cabinType.code = classType.AnyCabin;
      cabinType.code = searchFlight.classType;
      cabinPreferences.cabinType = cabinType;
      preference.cabinPreferences = cabinPreferences;
      // fare-references
      const fareReferences = new FareReferences();
      const types = [];
      const type = new FlightType();
      type.type = '';
      types.push(type);
      fareReferences.types = types;
      preference.fareReferences = fareReferences;

      searchData.preference = preference;
      // travellers property
      const travellers = new Travellers();
      travellers.adt = searchFlight.adults;
      travellers.chd = searchFlight.children;
      travellers.inf = searchFlight.infants;
      travellers.ins = 0;
      travellers.unn = 0;
      searchData.travellers = travellers;
      return this.http.post<FlightCombineResponse>(searchCombineFlightUrl, searchData)
        .pipe(map(data => {
            if (!data.hahnAir) {
              data.hahnAir = [];
            }
            if (!data.et) {
              data.et = [];
            }
            if (!data.aero) {
              data.aero = [];
            }
            if (!data.floAir) {
              data.floAir = [];
            }
            if (!data.qr) {
              data.qr = [];
            }
            return [...data.hahnAir, ...data.et, ...data.aero, ...data.floAir, ...data.qr];
          }), map((res: OriginDestination[]) => {
            // tslint:disable-next-line:no-debugger
            // if (res && res.length > 0 && res[0].flightList.length > 0) {
            return handleFlightResult(res);
            // } else {
            //   return handleError('There is no flight for this request');
            // }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  airline = this.actions$.pipe(
    ofType(FlightActions.SEARCH_AIRLINES_START),
    switchMap(() => {
      return this.http.get<Airline[]>(searchAirlineUrl).pipe(
        map((res: Airline[]) => {
          if (res.length > 0) {
            return handleAirlineResult(res);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  offerPrice = this.actions$.pipe(
    ofType(FlightActions.OFFER_PRICE_FLIGHTS_START),
    switchMap((offerData: FlightActions.OfferPriceFlightStart) => {
      const offerPrice = Object.assign({}, offerData.payload);
      // choose provider
      offerPrice.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      const searchFlightForm: any = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      if (searchFlightForm) {
        metadata.country = searchFlightForm.flyFrom.code;
      }
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      offerPrice.metadata = metadata;
      offerPrice.orderChange = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_CHANGE));
      offerPrice.originalDestinations = [];
      const original = new OriginalDestination();
      const departure = new Departure();
      departure.airportCode = searchFlightForm.flyFrom.code;
      original.departure = departure;
      const arrival = new Arrival();
      arrival.airportCode = searchFlightForm.destination.code;
      original.arrival = arrival;
      offerPrice.originalDestinations.push(original);
      offerPrice.travellers = offerPrice.travellers;
      if (searchFlightForm.typeFlight === 'ROUND_TRIP') {
        const destination = new OriginalDestination();
        const departureDes = new Departure();
        departureDes.airportCode = searchFlightForm.destination.code;
        destination.departure = departureDes;
        const arrivalDes = new Arrival();
        arrivalDes.airportCode = searchFlightForm.flyFrom.code;
        destination.arrival = arrivalDes;
        offerPrice.originalDestinations.push(destination);
      }
      return this.http.post<OfferPriceRes>(offerPriceCombineFlightUrl, offerPrice).pipe(
        map((res: OfferPriceRes) => {
          if (res != null && res.errors == null) {
            return handleOfferPrice(res);
          } else {
            return handleError(res.errors.error[0].shortText);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  availableServices = this.actions$.pipe(
    ofType(FlightActions.SEARCH_FLIGHTS_SERVICES_START),
    switchMap((actionData: FlightActions.SearchFlightServicesStart) => {
      const orderData = Object.assign({}, actionData.payload);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      const searchData = new FlightServiceReq();
      searchData.offerID = orderData.offerID;
      searchData.ownerCode = orderData.ownerCode;
      searchData.offerItemID = orderData.offerItemID;
      searchData.provider = orderData.provider;
      return this.http.post<ServiceListResponse>(servicesCombineFlightUrl, orderData)
        .pipe(map((res: ServiceListResponse) => {
            if (res !== null) {
              return handleServiceAvailabilityResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  servicesOfferPrice = this.actions$.pipe(
    ofType(FlightActions.SEARCH_OFFERPRICE_SERVICES_START),
    switchMap((actionData: FlightActions.ServiceOfferPriceFlightStart) => {
      const orderData = Object.assign({}, actionData.payload);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const offerPrice = new FlightServicesOfferPriceReq();
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      offerPrice.metadata = metadata;
      offerPrice.offerPriceReq = orderData.offerPriceReq;
      offerPrice.selectedServices = orderData.selectedServices;
      offerPrice.provider = orderData.provider;
      return this.http.post<OfferPriceRes>(serviceOfferPriceCombineFlightUrl, offerPrice).pipe(
        map((res: OfferPriceRes) => {
          if (res != null && res.errors == null) {
            return handleOfferPrice(res);
          } else {
            return handleError(res.errors.error[0].shortText);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(FlightActions.GET_VCN_START),
    switchMap((actionData: FlightActions.GetVcnStart) => {
      const clientData = actionData.payload;
      if (clientData.vcnPayment) {
        const paymentReq = this.flightPaymentService.buildFlightPaymentRequest(clientData);
      }
      const vcnRequest = new VcnRequest();
      vcnRequest.serviceName = this.getFlightServiceName();
      vcnRequest.sessionId = sessionStorage.getItem(flightConstant.EXECUTION_ID);
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.merchantPayment = clientData.merchantPayment;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = clientData.totalPrice;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      vcnRequest.metadata = metadata;
      return this.http.post<FlocashVCNRes>(requestVCNUrl, vcnRequest).pipe(
        map((res: FlocashVCNRes) => {
          if (res !== null) {
            return handleRequestVCNSuccess(res);
          }
        }),
        catchError((errorRes) => {
          sessionStorage.setItem(appConstant.OTP_ERROR_MESSAGE, errorRes.error.message);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  flightPayment = this.actions$.pipe(
    ofType(FlightActions.BOOKING_FLIGHTS_START),
    switchMap((actionData: FlightActions.BookingFlightStart) => {
      const orderData = Object.assign({}, actionData.payload);
      const searchFlightForm: any = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      orderData.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      orderData.executionId = sessionStorage.getItem(flightConstant.EXECUTION_ID);
      return this.http.post<FlightOrderResponse>(createOrderCombineFlightUrl, orderData)
        .pipe(map((res: FlightOrderResponse) => {
            if (res !== null) {
              return handleBookingResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );
  @Effect()
  issueFlightTicket = this.actions$.pipe(
    ofType(FlightActions.BOOKING_FLIGHTS_TICKET),
    switchMap((actionData: FlightActions.HoldBookingIssueTicket) => {
      const orderData = Object.assign({}, actionData.payload);
      orderData.provider = orderData.holdFlightResponse.flightPaymentReq.provider;
      const searchFlightForm: any = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      return this.http.post<FlightOrderResponse>(issueTicketCombineFlightUrl, orderData)
        .pipe(map((res: FlightOrderResponse) => {
            if (res !== null) {
              return handleBookingResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
   partialFlight = this.actions$.pipe(
    ofType(FlightActions.PARTIAL_BOOKING_START),
    switchMap((actionData: FlightActions.PartialFlightStart) => {
      const orderData = Object.assign({}, actionData.payload);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      return this.http.post<FlocashPaymentFlight>(partialBookingCombineFlightUrl, orderData)
        .pipe(map((res: FlocashPaymentFlight) => {
            if (res !== null) {
              return handlePartialBookingResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  boldBooking = this.actions$.pipe(
    ofType(FlightActions.HOLD_BOOKING_START),
    switchMap((actionData: FlightActions.HoldBookingStart) => {
      const orderData = Object.assign({}, actionData.payload);
      orderData.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      const searchFlightForm: any = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      return this.http.post<HoldFlightResponse>(holdBookingCombineFlightUrl, orderData)
        .pipe(map((res: HoldFlightResponse) => {
            if (res !== null) {
              return handleBookingHoldResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  flightChange = this.actions$.pipe(
    ofType(FlightActions.BOOKING_FLIGHTS_CHANGE),
    switchMap((actionData: FlightActions.BookingFlightChange) => {
      const orderData = Object.assign({}, actionData.payload);
      orderData.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      orderData.metadata = metadata;
      return this.http.post<FlightOrderResponse>(changeOrderCombineFlightUrl, orderData)
        .pipe(map((res: any) => {
            if (res !== null) {
              return handleChangeResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  private getFlightServiceName() {
    const selectedFlightProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
    if (selectedFlightProvider === flightProvider.ET) {
      return serviceName.ET;
    }
    if (selectedFlightProvider === flightProvider.HAHN_AIR) {
      return serviceName.HAHN_AIR;
    }
    if (selectedFlightProvider === flightProvider.AERO_CRS) {
      return serviceName.AEROCRS;
    }
    if (selectedFlightProvider === flightProvider.FLO_AIR) {
      return serviceName.FLOTRAVEL_SERVICE;
    }
    if (selectedFlightProvider === flightProvider.QR) {
      return serviceName.FLOTRAVEL_SERVICE;
    }
    return '';
  }

}
