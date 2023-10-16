import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import { OfferPriceRes } from 'src/app/model/flight/offer-price/offer-price-res';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { AeroService } from 'src/app/service/aero/aero.service';
import { combineBookingConstant, flightTypeValue } from '../../combine-booking.constant';
import { CombineBookingService } from 'src/app/service/combine/combine-booking.service';
import { flightConstant } from 'src/app/flight/flight.constant';
import {appConstant, defaultData} from 'src/app/app.constant';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { AvailablePropertyReq } from 'src/app/model/hotel/hotel-cart/available-property-req';
import { AlertifyService } from 'src/app/service/alertify.service';
import { CheckRoomReq } from 'src/app/model/hotel/hotel-cart/checkRoomReq';
import { ConfirmedRoom } from 'src/app/model/hotel/hotel-cart/confirmedRoom';
import { RoomsList } from 'src/app/model/hotel/hotel-list/rooms-list';
import { CombineShoppingReq } from 'src/app/model/combine/shopping-req';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-combine-summary',
  templateUrl: './combine-summary.component.html',
  styleUrls: ['./combine-summary.component.css'],
})
export class CombineSummaryComponent implements OnInit {
  typeFlight: string;
  departureFlight: SelectedFlight;
  // departureFlightPrice: OfferItem;
  defaultAirlineLogo: string;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchdata = true;
  returnFlight: SelectedFlight;

  nextFlights: SelectedFlight[];
  totalTripPrice: number;
  changeLink: string;
  searchCombineListRequest: CombineShoppingReq;
  searchHotelListRequest: HotelShoppingReq;
  offerPrices: OfferPriceRes;
  offerPricesReq: OfferPriceReq;
  searchFlightForm: SearchFlightForm;
  totalPassegers: number;
  isCollapsed: boolean[];
  currency: string;
  loadMoreFlight: boolean;
  aeroProvider: boolean;
  numberOfNight = 1;
  selectedHotel: HotelInfo;
  selectedRoom: RateDetailList;
  sessionId: string;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private aeroService: AeroService,
    private alertify: AlertifyService,
    private combineService: CombineBookingService
  ) {}

  ngOnInit() {
    // this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.defaultAirlineLogo = defaultData.aeroAirlineLogo;
    this.changeLink = '/combine/hotelList';
    this.searchCombineListRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_REQUEST));
    this.searchHotelListRequest = Utils.combineSearchToHotelSearch(this.searchCombineListRequest);
    this.selectedHotel = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL));
    this.selectedRoom = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_ROOM_DETAIL));
    this.offerPricesReq = JSON.parse(sessionStorage.getItem(combineBookingConstant.OFFER_PRICE));
    this.searchFlightForm = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS_FORM));
    this.departureFlight = JSON.parse(sessionStorage.getItem(combineBookingConstant.DEPARTURE_FLIGHT));
    this.sessionId = sessionStorage.getItem(combineBookingConstant.SESSION_ID);
    window.scroll(0, 0);
    this.totalTripPrice = 0;
    this.isCollapsed = [true];
    this.loadMoreFlight = true;
    this.getOfferPrice();
    this.checkHotelRoomAvailability();
  }
  checkHotelRoomAvailability() {
    const request = new AvailablePropertyReq();
    const selectedRoom = new CheckRoomReq();
    const confirmedRooms: ConfirmedRoom[] = [];
    this.selectedRoom.rooms.rooms.forEach((r: RoomsList) => {
      const confirmedRoom = new ConfirmedRoom();
      confirmedRoom.broadId =
        r.boards.broads != undefined ? r.boards.broads[0].boardId : '';
      confirmedRoom.roomCode = r.roomCode;
      confirmedRooms.push(confirmedRoom);
      this.numberOfNight =  r.roomRate.initialPricePerNight.length;
    });
    selectedRoom .confirmedRooms = confirmedRooms;
    selectedRoom.hotelId = +this.selectedHotel.code;
    selectedRoom.rateDetailCode = this.selectedRoom.rateDetailCode;
    selectedRoom.sessionId = this.sessionId;
    request.selectedRoom = selectedRoom;
    this.combineService.checkHotelRoomAvailability(request).subscribe(
      res => {
        sessionStorage.setItem(combineBookingConstant.HOTEL_AVAILABILITY, JSON.stringify(res));
      }, e => {
        this.alertify.error(e.message);
      }
    );
  }

  refresh() {
    this.totalTripPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value + (+this.selectedRoom.totalPrice);
    if (this.departureFlight) {
      this.currency = this.departureFlight.offerItem.currency;
    } else {
      this.currency = appConstant.CURRENCY;
    }
    if (this.searchFlightForm) {
      this.typeFlight =
        this.searchFlightForm.typeFlight || flightTypeValue.ONE_WAY;
      this.totalPassegers = this.searchFlightForm.adults + this.searchFlightForm.children;
    }
  }

  getOfferPrice() {
    // this.offerPrices = JSON.parse(sessionStorage.getItem(combineBookingConstant.OFFER_PRICE_RES));
    // this.refresh();
    this.fetching = true;
    this.combineService.offerPrice(this.offerPricesReq).subscribe(
      (res: OfferPriceRes) => {
        this.offerPrices = res;
        sessionStorage.setItem(combineBookingConstant.OFFER_PRICE_RES, JSON.stringify(res));
        this.fetching = false;
        this.fetchFailed = false;
        this.refresh();
      }, e => {
        this.fetching = false;
        this.fetchFailed = true;
        this.errorMes = e.message;
      }
    );
  }

  goToPayment() {
    this.route.navigate(['../cart'], {
      relativeTo: this.activatedRoute,
    });
  }
}
