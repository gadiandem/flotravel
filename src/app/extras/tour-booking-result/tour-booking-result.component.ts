import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TourPaymentService } from 'src/app/service/extras/tour-payment.service';
import { TourPaymentReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-req';
import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import { Payer } from 'src/app/model/flocash/payer';
import { User } from 'src/app/model/auth/user/user';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { ScheduleExtra } from 'src/app/model/thing-to-do/schedule-extra-data';
import * as fromApp from '../../store/app.reducer';
import * as TourActions from '../store/thing-to-do.actions';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';
import { thingToDoConstant } from '../thing-to-do.constant';
import { ExtraDetailAvailabilityView } from 'src/app/model/thing-to-do/tour-detail/extra-detail-view';
import { appConstant } from 'src/app/app.constant';
import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
@Component({
  selector: 'app-tour-booking-result',
  templateUrl: './tour-booking-result.component.html',
  styleUrls: ['./tour-booking-result.component.css']
})
export class TourBookingResultComponent implements OnInit {

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  tourPaymentData: TourPaymentReq;
  searchTourForm: TourShoppingRQ;
  userInfo: UserInfoModel;
  cardPayment: CardPaymentModel;
  user: UserDetail;
  userId: string;
  paymentRes: PaymentTour;
  // payer = new Payer();
  selectedTour: ExtrasPackage;
  selectedSchedule: ExtraDetailAvailabilityView;
  itemPrice = 0;
  currency = 'USD';
  initialRequest: boolean;

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.initialRequest = true;
    this.store.select('tourList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchTourForm = data.searchTourReq || JSON.parse(sessionStorage.getItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST));
      this.selectedTour = data.selectedTour || JSON.parse(sessionStorage.getItem(thingToDoConstant.SELECTED_TOUR));
      if(this.selectedTour){
        this.currency = this.selectedTour.currency;
      }
      this.selectedSchedule = data.selectedSchedule || JSON.parse(sessionStorage.getItem(thingToDoConstant.SELECTED_SCHEDULE));
      this.paymentRes = data.tourPaymentRes;
      if (this.selectedSchedule && this.selectedTour) {
        this.itemPrice = (this.selectedSchedule.adultCount || 0) * (this.selectedTour.price + this.selectedSchedule.extraPrice)
        + (this.selectedSchedule.childCount || 0) * (this.selectedTour.priceForChild + this.selectedSchedule.extraPrice);
    }

    if(data.agentVcn && this.initialRequest){
      this.initialRequest = false;
      this.tourBooking();
    }
  
  });
  }

  tourBooking(){
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    const tourPaymentReq: PaymentTourReq = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_PAYMENT_REQ));
    if(paymentInfo){
      const tourPaymentReq: PaymentTourReq = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_PAYMENT_REQ));
      paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      paymentInfo.currency = tourPaymentReq.paymentInfo.currency;
      paymentInfo.price = tourPaymentReq.paymentInfo.price;
      paymentInfo.payer = tourPaymentReq.paymentInfo.payer;
      paymentInfo.name = tourPaymentReq.paymentInfo.name;
      tourPaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new TourActions.PaymentTourStart(
           { data: tourPaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }
}
