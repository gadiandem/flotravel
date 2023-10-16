import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FlocashData } from 'src/app/model/flocash/flocash-data';
import * as TracemeActions from 'src/app/traceme/store/traceme.actions';
import * as fromApp from 'src/app/store/app.reducer';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { tracemeConstant } from 'src/app/traceme/traceme.constant';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import {appConstant, appDefaultData, FLOCASH_CREATE_ORDER_STATUS, REDIRECTMETHOD, REQUESTSTATUS} from 'src/app/app.constant';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { TraceMeFinaliseAndBookingReq } from 'src/app/model/traceme/finalise/traceme-finalise-booking';
import { UserInfo } from 'src/app/model/common/user-info';
import { TracemeService } from 'src/app/service/traceme/traceme.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-traceme-payment-result',
  templateUrl: './traceme-payment-result.component.html',
  styleUrls: ['./traceme-payment-result.component.css']
})
export class TracemePaymentResultComponent implements OnInit {
  isPayment = false;
  paymentReq: any;
  floCash: FlocashData;
  searchTracemeReq: TraceMeShoppingReq;
  searchTracemeResult: TraceMeShoppingRes;
  tracemePaymentRes: FlocashPaymentTraceMe;
  selectedQuote: TraceMeData;
  currency: string;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialRequest: boolean;
  userInfo: UserInfo;
  testData: string;
  statusRequest: string;
  constructor(private store: Store<fromApp.AppState>, private tracemeService: TracemeService,
    private route: Router,
    private activeRoute: ActivatedRoute, ) { }

  ngOnInit() {
    this.selectedQuote = JSON.parse(sessionStorage.getItem(tracemeConstant.SELECTED_QUOTE));
    this.userInfo = JSON.parse(sessionStorage.getItem(tracemeConstant.USER_INFO));
    this.currency = this.selectedQuote.quote.currency || appDefaultData.DEFAULT_CURRENCY;
    this.initialRequest = true;
    this.store.select('tracemeList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchTracemeReq = data.searchTracemeReq || JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_LIST_REQ));
      this.tracemePaymentRes = data.tracemePaymentRes;
      if (this.tracemePaymentRes) {
        this.handlerBookingResult(this.tracemePaymentRes);
      }
      if (data.agentVcn && this.initialRequest) {
        this.initialRequest = false;
        this.tracemeCheckoutBooking();
      }

    });
  }

  tracemeCheckoutBooking() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    if (paymentInfo) {
      const tracemePaymentReq: TraceMeFinaliseAndBookingReq = JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_PAYMENT_REQ));
      // paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      // paymentInfo.traceNumber = paymentInfo.traceNumber;
      // paymentInfo.otpValue = paymentInfo.otpValue;
      paymentInfo.currency = tracemePaymentReq.paymentInfo.currency;
      paymentInfo.price = tracemePaymentReq.paymentInfo.price;
      paymentInfo.payer = tracemePaymentReq.paymentInfo.payer;
      paymentInfo.name = tracemePaymentReq.paymentInfo.name;
      tracemePaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new TracemeActions.PaymentTracemeStart(
           { data: tracemePaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }

  handlerBookingResult(bookingRes: FlocashPaymentTraceMe) {
      const paymentStatus = bookingRes.status;
      switch (paymentStatus) {
        case FLOCASH_CREATE_ORDER_STATUS['0009']:
          this.statusRequest = REQUESTSTATUS.PENDING;
          sessionStorage.setItem(appConstant.REDIRECT_SERVICE_NAME, bookingRes.serviceName);
          this.onRedirect(bookingRes.redirect);
          break;
        case FLOCASH_CREATE_ORDER_STATUS['0004']:
          this.statusRequest = REQUESTSTATUS.PENDING;
          break;
      }
  }

  onRedirect(redirect: any) {
    const method = redirect.method;
    switch (method.toUpperCase()) {
      case REDIRECTMETHOD.POST:
        console.log('post request to page: ' + redirect.url);
        this.sentPostRequest(redirect);
        break;
      case REDIRECTMETHOD.GET:
        console.log('redirect to page: ' + redirect.url);
        window.open(redirect.url, '_blank');
        break;
    }
  }

  sentPostRequest(redirect: any) {
    sessionStorage.setItem(appConstant.REDIRECT, JSON.stringify(redirect));
    this.route.navigate(['../redirect'], {
      relativeTo: this.activeRoute,
    });
  }

}
