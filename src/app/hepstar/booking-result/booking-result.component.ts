import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FlocashData } from 'src/app/model/flocash/flocash-data';
import * as HepstarActions from "../store/hepstar.actions";
import * as fromApp from "../../store/app.reducer";
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { appConstant, FLOCASH_CREATE_ORDER_STATUS, REDIRECTMETHOD, REQUESTSTATUS } from 'src/app/app.constant';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { TraceMeFinaliseAndBookingReq } from 'src/app/model/traceme/finalise/traceme-finalise-booking';
import { UserInfo } from 'src/app/model/common/user-info';
import { TracemeService } from 'src/app/service/traceme/traceme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { hepstarConstant } from '../hepstar.constant';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';

@Component({
  selector: 'app-booking-result',
  templateUrl: './booking-result.component.html',
  styleUrls: ['./booking-result.component.css']
})
export class BookingResultComponent implements OnInit {
  isPayment = false;
  paymentReq: any;
  floCash: FlocashData;
  paymentInfo: PaymentInfo;
  searchHepstarReq: HepstarSearchFormData;
  searchHepstarResult: SearchHepstarRes;

  hepstarPaymentRes: any;

  selectedProduct: any;
  currency: string;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialRequest: boolean;
  userInfo: UserInfo;
  testData: string;
  statusRequest: string;
  constructor(private store: Store<fromApp.AppState>, private hepstarService: HepstarService,
    private route: Router,
    private activeRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.searchHepstarReq = JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM));
    this.selectedProduct = JSON.parse(sessionStorage.getItem(hepstarConstant.PRODUCT_SELECTED));
    this.userInfo = JSON.parse(sessionStorage.getItem(hepstarConstant.USER_INFO));
    this.paymentReq = JSON.parse(sessionStorage.getItem(hepstarConstant.HEPSTAR_PAYMENT_REQ));
    this.currency = 'USD';
    this.initialRequest = true;
    this.store.select("hepstarList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchHepstarReq = data.searchHepstarReq || JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM));
      this.hepstarPaymentRes = data.hepstarPaymentRes;
      if(this.hepstarPaymentRes){
        this.handlerBookingResult(this.hepstarPaymentRes);
      }
      if(data.agentVcn && this.initialRequest){
        this.initialRequest = false;
        this.paymentBooking();
      }
    
    });
    // this.paymentAndBooking();
  }

  paymentBooking() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    if(paymentInfo){
      const hepstarPaymentReq: any = JSON.parse(sessionStorage.getItem(hepstarConstant.HEPSTAR_PAYMENT_REQ));
      paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      paymentInfo.currency = hepstarPaymentReq.paymentInfo.currency;
      paymentInfo.price = hepstarPaymentReq.paymentInfo.price;
      paymentInfo.payer = hepstarPaymentReq.paymentInfo.payer;
      paymentInfo.name = hepstarPaymentReq.paymentInfo.name;
      hepstarPaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new HepstarActions.PaymentHepstarStart(
           { data: hepstarPaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }

  handlerBookingResult(bookingRes: any){
      const paymentStatus = bookingRes.status;
      switch (paymentStatus) {
        case FLOCASH_CREATE_ORDER_STATUS["0009"]:
          this.statusRequest = REQUESTSTATUS.PENDING;
          sessionStorage.setItem(appConstant.REDIRECT_SERVICE_NAME, bookingRes.serviceName);
          this.onRedirect(bookingRes.redirect);
          break;
        case FLOCASH_CREATE_ORDER_STATUS["0004"]:
          this.statusRequest = REQUESTSTATUS.PENDING;
          break;
      }
  }

  onRedirect(redirect: any) {
    const method = redirect.method;
    switch (method.toUpperCase()) {
      case REDIRECTMETHOD.POST:
        console.log("post request to page: " + redirect.url);
        this.sentPostRequest(redirect);
        break;
      case REDIRECTMETHOD.GET:
        console.log("redirect to page: " + redirect.url);
        window.open(redirect.url, "_blank");
        break;
    }
  }

  sentPostRequest(redirect: any){
    sessionStorage.setItem(appConstant.REDIRECT, JSON.stringify(redirect))
    this.route.navigate(["../redirect"], {
      relativeTo: this.activeRoute,
    })
  }
}
