import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as HotelActions from './hotel.actions';
import { environment } from '../../../environments/environment';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { MetaData } from 'src/app/model/dashboard/hotel/metadata';
import { HotelShoppingResponse } from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import { HotelDetailReq } from 'src/app/model/hotel/hotel-detail/hotel-detail-req';
import { HotelDetailModel } from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import { hotelConstant, hotelDemoData, hotelProvider } from '../hotel.constant';
import { AvailablePropertyReq } from 'src/app/model/hotel/hotel-cart/available-property-req';
import { CheckRoomReq } from 'src/app/model/hotel/hotel-cart/checkRoomReq';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import { PaymentRes } from 'src/app/model/hotel/hotel-payment/payment.res';
import { ConfirmedRoom } from 'src/app/model/hotel/hotel-cart/confirmedRoom';
import { RoomsList } from 'src/app/model/hotel/hotel-list/rooms-list';
import {appConstant, serviceName} from 'src/app/app.constant';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { VcnRequest } from 'src/app/model/flocash/response/vcn-request';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { HotelCombineShoppingResponse } from 'src/app/model/combine/hotel-combine-shopping-res';
import { HotelCombineDetailResponse } from 'src/app/model/combine/hotel-combine-detail-res';
import { HotelCombineAvailabilityResponse } from 'src/app/model/combine/hotel-combine-availability-response';
import { HotelCombineBookingRes } from '../../model/combine/hotel-combine-booking-res';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';

const searchHotelUrl = environment.baseUrl + 'hotel/Shopping';
const fetchHotelDetailUrl = environment.baseUrl + 'hotel/offerDetail';
const checkRoomAvailablePropertyUrl = environment.baseUrl + 'hotel/availableProperty';
const hotelPaymentUrl = environment.baseUrl + 'hotel/payment';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';

const searchHotelCombineUrl = environment.baseUrl + 'hotel-combine/shopping';
const detailHotelCombineUrl = environment.baseUrl + 'hotel-combine/detail';
const checkRoomAvailableCombineUrl = environment.baseUrl + 'hotel-combine/availability';
const bookingHotelCombineUrl = environment.baseUrl + 'hotel-combine/booking';
const searchPlanUrl = environment.baseUrl + 'flocash/search-plans';


const handleHotelCombineResult = (hotelListRes: HotelCombineShoppingResponse) => {
  sessionStorage.setItem(hotelConstant.HOTEL_LIS_RESULT, JSON.stringify(hotelListRes));
  return new HotelActions.SearchHotelListCommbineSuccess(hotelListRes);
};

const handleHotelCombineDetail = (hotelDetailRes: HotelCombineDetailResponse) => {
  return new HotelActions.FetchHotelDetailCombineSuccess(hotelDetailRes);
};

const handleCheckRoomAvailableCombineProperty = (availability: HotelCombineAvailabilityResponse) => {
 console.log(JSON.stringify(availability));
  sessionStorage.setItem(hotelConstant.HOTEL_ROOM_AVAILABILITY, JSON.stringify(availability));
  return new HotelActions.CheckRoomAvailableCombineSuccess(availability);
};

const handleHotelResult = (hotelListRes: HotelShoppingResponse) => {
  sessionStorage.setItem(hotelConstant.SESSION_ID, hotelListRes.sessionId);
  sessionStorage.setItem(hotelConstant.CURRENCY, hotelListRes.currency);
  sessionStorage.setItem(hotelConstant.HOTEL_LIS_RESULT, JSON.stringify(hotelListRes));
  return new HotelActions.SearchHotelListSuccess(hotelListRes);
};

const handleHotelDetail = (hotelDetailRes: HotelDetailModel) => {
  // console.log('!!!flightListRes: ' + JSON.stringify(flightListRes));
  // sessionStorage.setItem('hotelDetail', JSON.stringify(hotelDetailRes));
  return new HotelActions.FetchHotelDetailSuccess(hotelDetailRes);
};

const handleCheckRoomAvailableProperty = (avaibility: AvailablePropertyRes) => {
  // console.log('!!!flightListRes: ' + JSON.stringify(flightListRes));
  sessionStorage.setItem(hotelConstant.HOTEL_ROOM_AVAILABILITY, JSON.stringify(avaibility));
  return new HotelActions.CheckRoomAvailableSuccess(avaibility);
};

const handleHotelPayment = (paymentRes: PaymentRes) => {
  // console.log('!!!flightListRes: ' + JSON.stringify(flightListRes));
  // sessionStorage.setItem('hotelDetail', JSON.stringify(hotelDetailRes));
  return new HotelActions.HotelPaymentSuccess(paymentRes);
};
const handleRequestVCNSuccess = (
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new HotelActions.GetVcnSuccess(vcnRes);
};
const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = errorRes.error.message;
  }
  return of(new HotelActions.SearchHotelListFail(errorMessage));
};
@Injectable()
export class HotelEffects {

  user: UserDetail;
  traceId: string;
  @Effect()
  fetchHotelList = this.actions$.pipe(
    ofType(HotelActions.SEARCH_HOTELLIST_START),
    switchMap((actionData: HotelActions.SearchHotelListStart) => {
      const searchHotelList = new HotelShoppingReq();
      searchHotelList.metadata = new MetaData();
      searchHotelList.metadata.country = hotelConstant.METADATA_COUNTRY;
      searchHotelList.metadata.currency = hotelConstant.METADATA_CURRENCY;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      if(this.user){
        searchHotelList.metadata.user = this.user.email;
      }
      searchHotelList.cityCode = actionData.payload.data.cityCode;
      searchHotelList.destination = actionData.payload.data.destination;
      searchHotelList.simulator = actionData.payload.data.simulator;
      searchHotelList.checkinDate = actionData.payload.data.checkinDate;
      searchHotelList.checkoutDate = actionData.payload.data.checkoutDate;
      searchHotelList.rooms = actionData.payload.data.rooms;
      sessionStorage.setItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST, JSON.stringify(searchHotelList));
      return this.http
        .post<HotelShoppingResponse>(searchHotelUrl, searchHotelList)
        .pipe(
          map((res: HotelShoppingResponse) => {
              return handleHotelResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  fetchHotelDetail = this.actions$.pipe(
    ofType(HotelActions.FETCH_HOTEL_DETAIL_START),
    switchMap((actionData: HotelActions.FetchHotelDetailStart) => {
      const searchHotelDetail = new HotelDetailReq();
      searchHotelDetail.hotelCode = actionData.payload.data.code;
      searchHotelDetail.sessionId = actionData.payload.sessionId;
      const metadata = new MetaData();
      metadata.country = hotelConstant.METADATA_COUNTRY;;
      metadata.currency = hotelConstant.METADATA_CURRENCY;
      metadata.locale = '';
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      searchHotelDetail.metadata = metadata;
      // const demo: boolean = JSON.parse(sessionStorage.getItem(hotelConstant.DEMO));
      const demo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
      searchHotelDetail.simulator = demo;
      return this.http
        .post<HotelDetailModel>(fetchHotelDetailUrl, searchHotelDetail)
        .pipe(
          map((res: HotelDetailModel) => {
            if (res != null) {
              // console.log('!!!dataHotel: ' + JSON.stringify(res.result));
              return handleHotelDetail(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  checkRoomAvailable = this.actions$.pipe(
    ofType(HotelActions.CHECK_ROOM_AVAILABLE_START),
    switchMap((actionData: HotelActions.CheckRoomAvailableStart) => {
      const rateDetailList = actionData.payload.data;
      const checkRoomReq = new CheckRoomReq();
      const confirmedRooms: ConfirmedRoom[] = [];

      // confirmedRoom.broadId =rateDetailList.rooms.rooms[0].boards.broads != undefined
      //     ? rateDetailList.rooms.rooms[0].boards.broads[0].boardId : "";
      //     confirmedRoom.roomCode = rateDetailList.rooms.rooms[0].roomCode;
      rateDetailList.rooms.rooms.forEach((r: RoomsList) => {
        const confirmedRoom = new ConfirmedRoom();
        confirmedRoom.broadId =
          r.boards.broads != undefined ? r.boards.broads[0].boardId : '';
        confirmedRoom.roomCode = r.roomCode;
        confirmedRooms.push(confirmedRoom);
      });
      checkRoomReq.confirmedRooms = confirmedRooms;
      checkRoomReq.hotelId = actionData.payload.hotelCode;
      checkRoomReq.sessionId = actionData.payload.sessionId;
      checkRoomReq.rateDetailCode = rateDetailList.rateDetailCode;
      const metadata = new MetaData();
      metadata.country = hotelConstant.METADATA_COUNTRY;;
      metadata.currency = hotelConstant.METADATA_CURRENCY;
      metadata.locale = '';
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      const availabilityReq = new AvailablePropertyReq();
      availabilityReq.selectedRoom = checkRoomReq;
      availabilityReq.metadata = metadata;
      const demo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
      availabilityReq.simulator = demo;
      return this.http
        .post<AvailablePropertyRes>(
          checkRoomAvailablePropertyUrl,
          availabilityReq)
        .pipe(
          map((res: AvailablePropertyRes) => {
            if (res !== null) {
              return handleCheckRoomAvailableProperty(res);
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
    ofType(HotelActions.GET_VCN_START),
    switchMap((actionData: HotelActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildHotelPaymentRequest(
          clientData.cardPayment,
          clientData.vcnPayment,
          clientData.currency,
          clientData.selectedRoom,
          clientData.customerRoomInfos,
          clientData.sessionId,
          clientData.availableProperty,
          clientData.hotelSelected,
          clientData.hotelBookingContact,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking,
          clientData.countryCode,
          clientData.totalPrice,
          JSON.parse(sessionStorage.getItem(insuranceConstant.SUBSCRIBE_POLICY_DATA))
        );
      }
      const vcnRequest = new VcnRequest();
      vcnRequest.serviceName = serviceName.NUITEE;
      vcnRequest.sessionId = clientData.sessionId;
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.merchantPayment = clientData.merchantPayment;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = clientData.totalPrice;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = clientData.currency;
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
  requestSimulatorVcn = this.actions$.pipe(
    ofType(HotelActions.GET_VCN_SIMULATOR_START),
    switchMap((actionData: HotelActions.GetVcnSimulatorStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildHotelSimulatorPaymentRequest(
          clientData.cardPayment,
          clientData.vcnPayment,
          clientData.currency,
          clientData.totalPrice,
          clientData.selectedRoom,
          clientData.customerRoomInfos,
          clientData.hotelSelected,
          clientData.hotelBookingContact,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking,
          clientData.countryCode,
          clientData.hotelShoppingReq);
      }
      const vcnRequest = new VcnRequest();
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.merchantPayment = clientData.merchantPayment;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = +clientData.totalPrice;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = clientData.currency;
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
  hotelPayment = this.actions$.pipe(
    ofType(HotelActions.HOTEL_PAYMENT_START),
    switchMap((actionData: HotelActions.HotelPaymentStart) => {
      const paymentReq = Object.assign({}, actionData.payload.data);
      const metadata = new MetaData();
      metadata.country = hotelConstant.METADATA_COUNTRY;;
      metadata.currency = hotelConstant.METADATA_CURRENCY;
      metadata.locale = '';
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      paymentReq.metadata = metadata;
      return this.http.post<PaymentRes>(hotelPaymentUrl, paymentReq).pipe(
        map((res: PaymentRes) => {
          if (res !== null) {
            return handleHotelPayment(res);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  fetchHotelCombineList = this.actions$.pipe(
    ofType(HotelActions.SEARCH_HOTELLIST_COMBINE_START),
    switchMap((actionData: HotelActions.SearchHotelListCombineStart) => {
      const searchHotelList = new HotelShoppingReq();
      searchHotelList.metadata = new MetaData();
      searchHotelList.metadata.country = hotelConstant.METADATA_COUNTRY;
      searchHotelList.metadata.currency = hotelConstant.METADATA_CURRENCY;
      searchHotelList.cityCode = actionData.payload.data.cityCode;
      searchHotelList.destination = actionData.payload.data.destination;
      searchHotelList.checkinDate = actionData.payload.data.checkinDate;
      searchHotelList.checkoutDate = actionData.payload.data.checkoutDate;
      searchHotelList.countryCode = actionData.payload.data.countryCode;
      searchHotelList.rooms = actionData.payload.data.rooms;
      sessionStorage.setItem(
        hotelConstant.SEARCH_HOTEL_LIST_REQUEST,
        JSON.stringify(searchHotelList)
      );
      return this.http
        .post<HotelCombineShoppingResponse>(searchHotelCombineUrl, searchHotelList)
        .pipe(
          map((res: HotelCombineShoppingResponse) => {
            if (res != null) {
              return handleHotelCombineResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  fetchHotelDetailCombine = this.actions$.pipe(
    ofType(HotelActions.FETCH_HOTEL_DETAIL_COMBINE_START),
    switchMap((actionData: HotelActions.FetchHotelDetailCombineStart) => {
      const searchHotelDetail = new HotelDetailReq();
      searchHotelDetail.hotelCode = actionData.payload.data.code;
      searchHotelDetail.sessionId = actionData.payload.sessionId;
      searchHotelDetail.provider = actionData.payload.provider;
      return this.http
        .post<HotelCombineDetailResponse>(detailHotelCombineUrl, searchHotelDetail)
        .pipe(
          map((res: HotelCombineDetailResponse) => {
            if (res != null) {
              // console.log('!!!dataHotel: ' + JSON.stringify(res.result));
              return handleHotelCombineDetail(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  checkRoomAvailableCombine = this.actions$.pipe(
    ofType(HotelActions.CHECK_ROOM_AVAILABLE_COMBINE_START),
    switchMap((actionData: HotelActions.CheckRoomAvailableCombineStart) => {
      const selectedRoom = actionData.payload.data;
      const provider = actionData.payload.provider;
      const availabilityReq = new AvailablePropertyReq();
      // confirmedRoom.broadId =rateDetailList.rooms.rooms[0].boards.broads != undefined
      //     ? rateDetailList.rooms.rooms[0].boards.broads[0].boardId : "";
      //     confirmedRoom.roomCode = rateDetailList.rooms.rooms[0].roomCode;
      if (provider === hotelProvider.NUITEE) {
        const checkRoomReq = new CheckRoomReq();
        const confirmedRooms: ConfirmedRoom[] = [];
        selectedRoom.rooms.rooms.forEach((r: RoomsList) => {
          const confirmedRoom = new ConfirmedRoom();
          confirmedRoom.broadId =
            r.boards.broads != undefined ? r.boards.broads[0].boardId : '';
          confirmedRoom.roomCode = r.roomCode;
          confirmedRooms.push(confirmedRoom);
        });
        checkRoomReq.confirmedRooms = confirmedRooms;
        checkRoomReq.hotelId = actionData.payload.hotelCode;
        checkRoomReq.sessionId = actionData.payload.sessionId;
        checkRoomReq.rateDetailCode = selectedRoom.rateDetailCode;
        availabilityReq.selectedRoom = checkRoomReq;
      }
      if (provider === hotelProvider.NCT) {
        availabilityReq.hotelId = actionData.payload.hotelNctId;
        availabilityReq.hotelRooms = actionData.payload.hotelRoom;
        availabilityReq.packageInfo = actionData.payload.packageInfo;
      }
      if (provider === hotelProvider.HOTEL_SIMULATOR) {
        availabilityReq.hotelRoomSimulatorId = selectedRoom.id;
        availabilityReq.numberOfRoom = actionData.payload.numberOfRoom;
      }
      availabilityReq.startDate = actionData.payload.startDate;
      availabilityReq.endDate = actionData.payload.endDate;
      availabilityReq.provider = provider;
      return this.http
        .post<HotelCombineAvailabilityResponse>(checkRoomAvailableCombineUrl, availabilityReq)
        .pipe(
          map((res: HotelCombineAvailabilityResponse) => {
            if (res !== null) {
              return handleCheckRoomAvailableCombineProperty(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    public datepipe: DatePipe,
    private paymentService: PaymentService
  ) {}
}
