import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import {Flight} from 'src/app/model/flight/flight-list/flight';
import {OfferItem} from 'src/app/model/flight/flight-list/offerItem';
import * as FlightListActions from '../../../flight/store/flight-list.actions';
import * as fromApp from '../../../store/app.reducer';
import {OfferPriceReq} from 'src/app/model/flight/offer-price/request/offer-price-req';
import {OfferPriceRes} from 'src/app/model/flight/offer-price/offer-price-res';
import {SearchFlightForm} from 'src/app/model/flight/search-flight-form';
import {SelectedFlight} from 'src/app/model/flight/selected-flight';
import {AeroService} from 'src/app/service/aero/aero.service';
import {OriginalDestination} from 'src/app/model/flight/flight-list/request/OriginalDestination';
import {Departure} from 'src/app/model/flight/create-order/departure';
import {Arrival} from 'src/app/model/flight/create-order/arrival';
import {combineBookingConstant, flightTypeValue} from '../../combine-booking.constant';
import {CombineBookingService} from 'src/app/service/combine/combine-booking.service';
import {flightConstant} from 'src/app/flight/flight.constant';
import {appConstant, appDefaultData, defaultData} from 'src/app/app.constant';
import {HotelInfo} from 'src/app/model/hotel/hotel-list/hotel-info';
import {RateDetailList} from 'src/app/model/hotel/hotel-list/rate-detail-list';
import {AvailablePropertyReq} from 'src/app/model/hotel/hotel-cart/available-property-req';
import {AlertifyService} from 'src/app/service/alertify.service';
import {CheckRoomReq} from 'src/app/model/hotel/hotel-cart/checkRoomReq';
import {ConfirmedRoom} from 'src/app/model/hotel/hotel-cart/confirmedRoom';
import {RoomsList} from 'src/app/model/hotel/hotel-list/rooms-list';
import {OriginDestination} from 'src/app/model/flight/flight-list/originDestination';
import {hotelConstant, hotelProvider} from 'src/app/hotel/hotel.constant';
import {HotelDetailModel} from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import {Travellers} from 'src/app/model/flight/flight-list/request/travellers';
import {OfferItemSelected} from 'src/app/model/flight/offer-price/request/offer-item-selected';
import {CombineShoppingReq} from 'src/app/model/combine/shopping-req';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {Utils} from 'src/app/shared/utils';
import {HotelCombineDetailResponse} from '../../../model/combine/hotel-combine-detail-res';
import {HotelPackageDetailRes} from '../../../model/packages/consumer/hotel-package-detail-res';
import {ItemPrice} from '../../../model/packages/consumer/item-price';

@Component({
  selector: 'app-package-summary',
  templateUrl: './package-summary.component.html',
  styleUrls: ['./package-summary.component.css']
})
export class PackageSummaryComponent implements OnInit {
  typeFlight: string;

  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchdata = true;
  returnFlight: SelectedFlight;

  nextFlights: SelectedFlight[];
  totalTripPrice: number;
  changeLink: string;

  searchFlightForm: SearchFlightForm;
  totalPassegers: number;
  isCollapsed: boolean[];
  currency: string;
  loadMoreFlight: boolean;
  aeroProvider: boolean;

  selectedHotel: HotelInfo;
  selectedRoom: RateDetailList;
  selectedRoomNCT: HotelPackageDetailRes;
  sessionId: string;
  flightListSource: Flight[] = [];
  originDestination: OriginDestination[] = [];
  flightMinPrice: number;
  flightMin: Flight;
  executionId: string;
  executionIdET: string;
  minPricePerNight = 0;
  numberOfNight = 1;
  hotelDetailRes: HotelDetailModel;
  nctHotelDetailRes: HotelPackageDetailRes;
  offerPrices: OfferPriceRes;
  searchCombineListRequest: CombineShoppingReq;
  searchHotelListRequest: HotelShoppingReq;
  provider: string;
  defaultAirlineLogo: string;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private aeroService: AeroService,
    private alertify: AlertifyService,
    private combineService: CombineBookingService
  ) {
  }

  ngOnInit() {
    this.defaultAirlineLogo = defaultData.aeroAirlineLogo;
    this.changeLink = '/combine/hotelList';
    this.searchCombineListRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_REQUEST));
    this.searchHotelListRequest = Utils.combineSearchToHotelSearch(this.searchCombineListRequest);
    this.selectedHotel = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL));
    this.searchFlightForm = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS_FORM));
    this.sessionId = sessionStorage.getItem(combineBookingConstant.SESSION_ID);
    this.flightMinPrice = 0;
    window.scroll(0, 0);
    this.totalTripPrice = 0;
    this.isCollapsed = [true];
    this.loadMoreFlight = true;
    this.flightListSource = [];
    this.refresh();
    this.fetchHotelDetail();
    this.fetchFlightPriceDetail();
  }

  refresh() {
    this.getMinFlightPrice();
    this.totalTripPrice = this.selectedHotel.minPrice + this.flightMinPrice;
    this.executionId = sessionStorage.getItem(combineBookingConstant.EXECUTION_ID_HAHN_AIR);
    this.currency = sessionStorage.getItem(combineBookingConstant.METADATA_CURRENCY) || 'USD';
    if (this.searchFlightForm) {
      this.typeFlight =
        this.searchFlightForm.typeFlight || flightTypeValue.ONE_WAY;
      this.totalPassegers = this.searchFlightForm.adults + this.searchFlightForm.children;
    }
  }

  getMinFlightPrice() {
    this.originDestination = JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_LIST_RESULT)) || [];
    if (this.originDestination.length > 0) {
      this.originDestination.forEach(o => {
        this.flightListSource.push(...o.flightList);
      });
      this.flightMin = this.flightListSource[0];
      this.flightMinPrice = this.flightListSource[0].offerItemList[0].totalAmount;
    }
  }

  fetchHotelDetail() {
    this.fetching = true;
    this.combineService.getHotelDetail(this.selectedHotel.code).subscribe(
      (res: HotelCombineDetailResponse) => {
        this.fetching = false;
        this.fetchFailed = false;
        this.errorMes = null;
        this.processData(res);
      }, e => {
        this.fetching = false;
        this.fetchFailed = false;
        this.errorMes = e;
      }
    );
  }

  fetchFlightPriceDetail() {
    if (this.flightMin) {
      const offerData = new OfferPriceReq();
      switch (this.searchFlightForm.typeFlight) {
        case flightTypeValue.ONE_WAY:
          // if(+sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightSelectedProvider.ET){
          //     this.executionId = this.executionIdET;
          // }
          offerData.executionId = this.executionId || '';

          const selectItem: OfferItem = this.flightMin.offerItemList[0];
          const offerItem = new OfferItemSelected();
          offerItem.offerId = selectItem.offerId;
          offerItem.offerItemId = selectItem.offerItemId;
          offerItem.owner = selectItem.owner || 'HR';
          offerData.offerItems = [];
          offerData.offerItems.push(offerItem);
          const travellers = new Travellers();
          travellers.adt = this.searchFlightForm.adults;
          travellers.chd = this.searchFlightForm.children;
          travellers.inf = 0;
          travellers.ins = 0;
          travellers.unn = 0;
          offerData.travellers = travellers;
          const bspBooking = sessionStorage.getItem(
            flightConstant.FLIGHT_BSP_BOOKING
          );
          if (bspBooking == '1') {
            offerData.bspBooking = true;
          } else {
            offerData.bspBooking = false;
          }
          sessionStorage.setItem(
            combineBookingConstant.OFFER_PRICE,
            JSON.stringify(offerData)
          );
      }
      this.getOfferPrice(offerData);
    }
  }

  checkHotelRoomAvailability() {
    const request = new AvailablePropertyReq();
    if (!this.provider || this.provider === hotelProvider.NUITEE) {
      const selectedRoom = new CheckRoomReq();
      const confirmedRooms: ConfirmedRoom[] = [];
      this.selectedRoom.rooms.rooms.forEach((r: RoomsList) => {
        const confirmedRoom = new ConfirmedRoom();
        confirmedRoom.broadId =
          r.boards.broads != undefined ? r.boards.broads[0].boardId : '';
        confirmedRoom.roomCode = r.roomCode;
        confirmedRooms.push(confirmedRoom);
      });
      selectedRoom.confirmedRooms = confirmedRooms;
      selectedRoom.hotelId = +this.selectedHotel.code;
      selectedRoom.rateDetailCode = this.selectedRoom.rateDetailCode;
      selectedRoom.sessionId = this.sessionId;
      request.selectedRoom = selectedRoom;
      request.provider = hotelProvider.NUITEE;
    } else {
      const nctSelectedRoom = new ItemPrice();
      nctSelectedRoom.id = this.selectedRoomNCT.id;
      nctSelectedRoom.count = 1;
      request.hotelRooms = [nctSelectedRoom];
      request.hotelId = this.selectedRoomNCT.hotelId;
      request.provider = hotelProvider.NCT;
      const packageInfo = new ItemPrice();
      packageInfo.id = this.selectedHotel.packageId;
      packageInfo.count = 1;
      request.packageInfo = packageInfo;
    }
    this.combineService.checkHotelRoomAvailability(request).subscribe(
      res => {
        sessionStorage.setItem(combineBookingConstant.HOTEL_AVAILABILITY, JSON.stringify(res));
      }, e => {
        this.alertify.error(e.message);
      }
    );
  }

  getOfferPrice(offerData: OfferPriceReq) {
    // this.offerPrices = JSON.parse(sessionStorage.getItem(combineBookingConstant.OFFER_PRICE_RES));
    // this.refresh();
    this.fetching = true;
    this.combineService.offerPrice(offerData).subscribe(
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

  processData(res: HotelCombineDetailResponse) {
    if (res) {
      this.hotelDetailRes = res.hotelNuitee;
      if (this.hotelDetailRes) {
        this.provider = hotelProvider.NUITEE;
        this.selectedRoom = this.hotelDetailRes.rateDetails.rateDetails[0];
        this.selectedRoom.rooms.rooms.forEach(
          (r: RoomsList) => {
            this.minPricePerNight += +r.roomRate.initialPricePerNight[0];
          }
        );
        this.numberOfNight = this.hotelDetailRes.rateDetails.rateDetails[0].rooms.rooms[0].roomRate.initialPricePerNight.length;
      }
      if (res.hotelNCT) {
        this.provider = hotelProvider.NCT;
        this.nctHotelDetailRes = res.hotelNCT[0];
        this.selectedRoomNCT = this.nctHotelDetailRes;
      }
    }
    this.checkHotelRoomAvailability();
  }

  goToPayment() {
    if (this.flightMin) {
      const selectFlight = new SelectedFlight();
      selectFlight.flight = this.flightMin;
      selectFlight.offerItem = this.flightMin.offerItemList[0];
      sessionStorage.setItem(combineBookingConstant.DEPARTURE_FLIGHT, JSON.stringify(selectFlight));
    }
    if (this.selectedRoom) {
      sessionStorage.setItem(combineBookingConstant.SELECTED_ROOM_DETAIL, JSON.stringify(this.selectedRoom));
    }
    if (this.nctHotelDetailRes) {
      sessionStorage.setItem(combineBookingConstant.SELECTED_ROOM_DETAIL_NCT, JSON.stringify(this.nctHotelDetailRes));
    }
    this.route.navigate(['../cart'], {
      relativeTo: this.activatedRoute,
    });
  }

  moreOption() {
    this.route.navigate([`../hotelDetail/${this.selectedHotel.code}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
