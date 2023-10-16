import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {CombineDestination} from 'src/app/model/combine/combine-destination';
import {CombineShoppingReq} from 'src/app/model/combine/shopping-req';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {MetaData} from 'src/app/model/dashboard/hotel/metadata';
import {hotelConstant, hotelProvider} from 'src/app/hotel/hotel.constant';
import {HotelShoppingResponse} from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import {catchError, map} from 'rxjs/operators';
import {
  classType,
  combineBookingConstant,
  demoFlightData,
} from 'src/app/combine-booking/combine-booking.constant';
import {HotelDetailReq} from 'src/app/model/hotel/hotel-detail/hotel-detail-req';
import {HotelDetailModel} from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import {FlightSearchReq} from 'src/app/model/flight/flight-list/request/flightSearchReq';
import {OriginalDestination} from 'src/app/model/flight/flight-list/request/OriginalDestination';
import {Arrival} from 'src/app/model/flight/create-order/arrival';
import {Departure} from 'src/app/model/flight/create-order/departure';
import {CalendarDates} from 'src/app/model/flight/flight-list/request/calendar-dates';
import {Preference} from 'src/app/model/flight/flight-list/request/preference';
import {CabinPreferences} from 'src/app/model/flight/flight-list/request/cabin-preference';
import {CabinType} from 'src/app/model/flight/flight-list/request/cabinType';
import {FareReferences} from 'src/app/model/flight/flight-list/request/fare-references';
import {Travellers} from 'src/app/model/flight/flight-list/request/travellers';
import {FlightType} from 'src/app/model/flight/flight-list/request/flight-type';
import {flightConstant, flightProvider, flightTypeValue} from 'src/app/flight/flight.constant';
import {OriginDestination} from 'src/app/model/flight/flight-list/originDestination';
import {forkJoin, of} from 'rxjs';
import {Airline} from 'src/app/model/flight/airline/airline';
import {OfferItem} from 'src/app/model/flight/flight-list/offerItem';
import {Flight} from 'src/app/model/flight/flight-list/flight';
import {OfferPriceReq} from 'src/app/model/flight/offer-price/request/offer-price-req';
import {OfferPriceRes} from 'src/app/model/flight/offer-price/offer-price-res';
import {AvailablePropertyRes} from 'src/app/model/hotel/hotel-cart/available-property-res';
import {AvailablePropertyReq} from 'src/app/model/hotel/hotel-cart/available-property-req';
import {CombineServicePaymentRequest} from 'src/app/model/combine/combine-service-request';
import {VcnRequest} from 'src/app/model/flocash/response/vcn-request';
import {appConstant} from 'src/app/app.constant';
import {SearchFlightForm} from 'src/app/model/flight/search-flight-form';
import {AirportRes} from 'src/app/model/flight/airport/airportRes';
import {HotelCombineShoppingResponse} from '../../model/combine/hotel-combine-shopping-res';
import {FlightShoppingResponse} from '../../model/combine/flight-combine-shopping-res';
import {HotelCombineDetailResponse} from '../../model/combine/hotel-combine-detail-res';

class FlightSelection {
  flightList: Flight;
  minPrice: OfferItem;
}

@Injectable({
  providedIn: 'root',
})
export class CombineBookingService {
  searchDestinationUrl = environment.baseUrl + 'combine/destinations';
  searchHotelCombineUrl = environment.baseUrl + 'combine/shopping/hotel';
  searchHotDetailUrl = environment.baseUrl + 'hotel-combine/detail';
  searchFlightCombineUrl = environment.baseUrl + 'combine/shopping/flight';
  searchAeroFlightUrl = environment.baseUrl + 'aero/AirShopping';
  searchETFlightUrl = environment.baseUrl + 'et/AirShopping';
  offerPriceFlightUrl = environment.baseUrl + 'ndc/OfferPrice';
  searchAirlineUrl = environment.baseUrl + 'ndc/airlines';
  checkRoomAvailablePropertyUrl = environment.baseUrl + 'hotel-combine/availability';
  combineServiceCreateORderUrl = environment.baseUrl + 'combine/createOrder';
  requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';

  constructor(private http: HttpClient) {
  }

  searchDestination(keyword: string) {
    const params = new HttpParams().set('keywords', keyword);
    return this.http.get<CombineDestination[]>(this.searchDestinationUrl, {
      params,
    });
  }

  shoppingCombineService(searchForm: CombineShoppingReq) {
    this.getAirlineList();
    return this.shoppingCombine(searchForm);
  }

  shoppingCombine(searchForm: CombineShoppingReq) {
    this.saveFlightSearchForm(searchForm);
    const searchData = this.buildFlightRequest(searchForm);
    const searchHotelList = this.buildShoppingHotel(searchForm);
    return forkJoin<FlightShoppingResponse, HotelCombineShoppingResponse>(
      this.http.post<FlightShoppingResponse>(this.searchFlightCombineUrl, searchData),
      this.http.post<HotelCombineShoppingResponse>(this.searchHotelCombineUrl, searchHotelList))
      .pipe(map((res: [FlightShoppingResponse, HotelCombineShoppingResponse]) => {
        const flight = res[0];
        if (flight) {
          this.handleFlightResult(flight);
        } else {
          sessionStorage.setItem(combineBookingConstant.FLIGHT_LIST_RESULT, JSON.stringify([]));
        }
        return res[1];
      }));
  }

  saveFlightSearchForm(searchForm: CombineShoppingReq) {
    const searchFlightForm: SearchFlightForm = new SearchFlightForm();
    const destinationAirport = new AirportRes();
    destinationAirport.displayName = searchForm.destination.displayName;
    searchFlightForm.destination = destinationAirport;
    const flyFromAirport = new AirportRes();
    flyFromAirport.displayName = searchForm.leaveFrom.displayName;
    searchFlightForm.flyFrom = flyFromAirport;
    searchFlightForm.departuring = searchForm.checkinDate;
    searchFlightForm.returning = searchForm.checkoutDate;
    let adults = 0;
    let child = 0;
    const infant = 0;
    searchForm.rooms.forEach((room) => (adults += room.adult));
    searchForm.rooms.forEach((room) => (child += room.children));
    searchFlightForm.adults = adults;
    searchFlightForm.children = child;
    searchFlightForm.typeFlight = flightTypeValue.ONE_WAY;
    sessionStorage.setItem(
      combineBookingConstant.SEARCH_FLIGHTS_FORM,
      JSON.stringify(searchFlightForm)
    );
  }

  getAirlineList() {
    const airlines: Airline[] = JSON.parse(localStorage.getItem(flightConstant.AIRLINE_LIST)) || [];
    if (airlines.length === 0) {
      return this.http.get<Airline[]>(this.searchAirlineUrl).subscribe(
        (res: Airline[]) => {
          localStorage.setItem(flightConstant.AIRLINE_LIST, JSON.stringify(res));
        }
      );
    }
  }

  shoppingHotel(searchForm: CombineShoppingReq) {
    const searchHotelList = this.buildShoppingHotel(searchForm);
    return this.http.post<HotelShoppingResponse>(
      this.searchHotelCombineUrl,
      searchHotelList
    );
  }

  buildShoppingHotel(searchForm: CombineShoppingReq) {
    const searchHotelList = new HotelShoppingReq();
    searchHotelList.metadata = new MetaData();
    searchHotelList.metadata.country = hotelConstant.METADATA_COUNTRY;
    searchHotelList.metadata.currency = hotelConstant.METADATA_CURRENCY;
    searchHotelList.cityCode = searchForm.destination.cityId;
    searchHotelList.destination = searchForm.destination.displayName;
    searchHotelList.checkinDate = searchForm.checkinDate;
    searchHotelList.checkoutDate = searchForm.checkoutDate;
    searchHotelList.rooms = searchForm.rooms;
    sessionStorage.setItem(
      combineBookingConstant.SEARCH_HOTEL_LIST_REQUEST,
      JSON.stringify(searchHotelList)
    );
    return searchHotelList;
  }

  buildFlightRequest(searchForm: CombineShoppingReq) {
    const searchData = new FlightSearchReq();
    searchData.orgId = '';
    const metadata = new MetaData();
    metadata.country = demoFlightData.COUNTRY;
    metadata.currency = demoFlightData.CURRENCY;
    metadata.locale = '';
    searchData.metadata = metadata;
    searchData.simulator = false;
    searchData.bspBooking = false;
    // original-destination-list
    const originDestinations: OriginalDestination[] = [];
    // origin-destination
    const originDestination = new OriginalDestination();
    // arrival
    const arrival = new Arrival();
    arrival.airportCode = searchForm.destination.airportCode;
    originDestination.arrival = arrival;
    // departure
    const depature = new Departure();
    depature.airportCode = searchForm.leaveFrom.airportCode;
    depature.date = searchForm.checkinDate;
    originDestination.departure = depature;
    // add to original destination list
    originDestinations.push(originDestination);
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
    cabinType.code = classType.AnyCabin;
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
    let adults = 0;
    let child = 0;
    const infant = 0;
    searchForm.rooms.forEach((room) => (adults += room.adult));
    searchForm.rooms.forEach((room) => (child += room.children));
    // searchForm.rooms.forEach((room) => (child += room.infants));
    travellers.adt = adults !== 0 ? adults : 1;
    travellers.chd = child || 0;
    travellers.inf = 0;
    travellers.ins = 0;
    travellers.unn = 0;
    searchData.travellers = travellers;
    sessionStorage.setItem(
      combineBookingConstant.SEARCH_FLIGHTS,
      JSON.stringify(searchData)
    );
    return searchData;
  }

  handleFlightResult(shoppingResponse: FlightShoppingResponse) {
    if (!shoppingResponse.hahnAir) {
      shoppingResponse.hahnAir = [];
    }
    if (!shoppingResponse.et) {
      shoppingResponse.et = [];
    }
    if (!shoppingResponse.aero) {
      shoppingResponse.aero = [];
    }
    // console.log('!!!flightListRes: ' + JSON.stringify(flightListRes));
    const airlines: Airline[] = JSON.parse(
      localStorage.getItem(flightConstant.AIRLINE_LIST)
    );
    const hahnAir = shoppingResponse.hahnAir;
    hahnAir.forEach((o) => {
      o.flightList.forEach((f) => {
        if (f.flightSegments) {
          f.flightSegments.forEach((s) => {
            const airline = airlines.find((e) => e.iata === s.airline);
            s.airline = s.airline.concat('-', airline.name);
          });
        }
      });
    });
    this.sortFlight(hahnAir);
    if (shoppingResponse.hahnAir && shoppingResponse.hahnAir.length > 0) {
      sessionStorage.setItem(combineBookingConstant.EXECUTION_ID_HAHN_AIR, shoppingResponse.hahnAir[0].executionId);
    }
    sessionStorage.setItem(combineBookingConstant.FLIGHT_LIST_RESULT,
      JSON.stringify([...shoppingResponse.hahnAir, ...shoppingResponse.et, ...shoppingResponse.aero]));
  }

  sortFlight(originDestinations: OriginDestination[]) {
    originDestinations.forEach((o) => {
      const allOfferItemList = [];
      o.flightList.forEach((e) => {
        allOfferItemList.push(e.offerItemList);
      });
      o.flightList = this.getMinOfferItem(allOfferItemList, [...o.flightList]);
    });
  }

  getMinOfferItem(allOfferItemList: any, flightList: Flight[]) {
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
  }

  getHotelDetail(hotelCode: string) {
    const searchHoteDetail = new HotelDetailReq();
    searchHoteDetail.hotelCode = hotelCode;
    const sessionId = sessionStorage.getItem(combineBookingConstant.SESSION_ID);
    const selectedHotelProvider = sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL_PROVIDER) || hotelProvider.NUITEE;
    searchHoteDetail.sessionId = sessionId;
    searchHoteDetail.provider = selectedHotelProvider;
    return this.http.post<HotelCombineDetailResponse>(this.searchHotDetailUrl, searchHoteDetail);
  }

  offerPrice(request: OfferPriceReq) {
    const headers = new HttpHeaders().set('environment', environment.paymentEnvironment);
    return this.http.post<OfferPriceRes>(this.offerPriceFlightUrl, request, {headers});
  }

  checkHotelRoomAvailability(request: AvailablePropertyReq) {
    const selectedHotelProvider = sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL_PROVIDER) || hotelProvider.NUITEE;
    request.provider = selectedHotelProvider;
    return this.http.post<AvailablePropertyRes>(this.checkRoomAvailablePropertyUrl, request);
  }

  requestVcn(request: VcnRequest) {
    return this.http.post<any>(this.requestVCNUrl, request).subscribe(
      (res) => {
        localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(res));
      }, e => {
        sessionStorage.setItem(appConstant.OTP_ERROR_MESSAGE, e.error.message);
      }
    );
  }

  paymentAndBooking(request: CombineServicePaymentRequest) {
    return this.http.post<any>(this.combineServiceCreateORderUrl, request);
  }
}

function handleError(errorRes: any): any {
  throw new Error('Function not implemented.');
}

