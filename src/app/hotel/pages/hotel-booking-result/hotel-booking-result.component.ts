import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { PaymentRes } from 'src/app/model/hotel/hotel-payment/payment.res';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import * as fromApp from 'src/app/store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { FlocashData } from 'src/app/model/flocash/flocash-data';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { appConstant, defaultData } from 'src/app/app.constant';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';
import {Subscription} from 'rxjs';
import {flightConstant} from '../../../flight/flight.constant';
import {Product} from '../../../model/insurance/quote/product';

@Component({
  selector: 'app-hotel-booking-result',
  templateUrl: './hotel-booking-result.component.html',
  styleUrls: ['./hotel-booking-result.component.css']
})
export class HotelBookingResultComponent implements OnInit, OnDestroy {

  userInfo: UserInfoModel[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  sub: Subscription;
  // user: UserDetail;
  selectedRoom: RateDetailList;
  selectedHotel: HotelInfo;
  paymentResult: PaymentRes;
  hotelPaymentRequest: HotelPaymentRequest;
  searchHotelForm: HotelShoppingReq;
  currency: string;
  sessionId: string;
  initialRequest: boolean;
  defaultData: string;
  insuranceItemItem: Product;
  constructor(private store: Store<fromApp.AppState>, private route: Router) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultData = defaultData.noImage;
    this.initialRequest = true;
    this.currency = sessionStorage.getItem(hotelConstant.CURRENCY) || hotelConstant.METADATA_CURRENCY;
    this.insuranceItemItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_INSURANCE));
    this.sub = this.store.select('hotel').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.paymentResult = data.paymentRes;
      if (data.paymentRes) {
        this.currency = data.paymentRes.currencyName;
      }
      this.hotelPaymentRequest = JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_PAYMENT_REQ));
      this.searchHotelForm = data.searchHotelListForm || JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
      if (!this.searchHotelForm || !this.searchHotelForm.destination) {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.selectedHotel = data.selectedHotel || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
      this.sessionId = data.sessionId || sessionStorage.getItem(hotelConstant.SESSION_ID);

      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
      this.userInfo = JSON.parse(sessionStorage.getItem(hotelConstant.CUSTOMERS_INFO));
      if (data.agentVcn && this.initialRequest) {
        this.initialRequest = false;
        this.hotelBooking();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  hotelBooking() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    if (paymentInfo) {
      const hotelPaymentReq: HotelPaymentRequest = JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_PAYMENT_REQ));
      paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      hotelPaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new HotelActions.HotelPaymentStart(
           { data: hotelPaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }
}
