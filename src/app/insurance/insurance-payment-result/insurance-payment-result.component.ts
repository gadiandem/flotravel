import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlocashData } from 'src/app/model/flocash/flocash-data';
import { CardPaymentModel } from 'src/app/model/insurance/card-payment.req';
import { Product } from 'src/app/model/insurance/quote/product';
import { SearchQouteRequest } from 'src/app/model/insurance/search-quote.request';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { UserInfoInsurance } from 'src/app/model/insurance/user-info-insurance.req';
import { insuranceConstant } from '../insurance.constant';
import * as InsuranceActions from "../store/insurance.actions";
import * as fromApp from "../../store/app.reducer";
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { SubscribePolicyRequest } from 'src/app/model/insurance/subscription-policy/subscription-policy.request';
@Component({
  selector: 'app-insurance-payment-result',
  templateUrl: './insurance-payment-result.component.html',
  styleUrls: ['./insurance-payment-result.component.css']
})
export class InsurancePaymentResultComponent implements OnInit {
  isPayment = false;
  cardPayment: CardPaymentModel;
  userInfo: UserInfoInsurance;
  paymentReq: any;
  floCash: FlocashData;
  selectedQuoteProduct: Product;
  defaultData : any;
  user: UserDetail;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  paymentResult: FlocashPaymentInsurance;
  searchQuoteForm: SearchQouteRequest;
  currency: string;
  sessionId: string;
  initialRequest: boolean;

  address: string;
  constructor(private route: Router, private store: Store<fromApp.AppState>,) { }

  ngOnInit() {
    this.initialRequest = true;
    this.selectedQuoteProduct = JSON.parse(sessionStorage.getItem(insuranceConstant.PRODUCT_SELECTED));
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.store.select("insuranceList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchQuoteForm = data.searchQuoteForm;
    //  console.log(JSON.stringify(data));
      if(this.searchQuoteForm == null){
        this.searchQuoteForm = JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_SEARCH_FORM));
      }
      this.userInfo = data.userInfoInsurance;
      if(this.userInfo){
        this.userInfo = JSON.parse(sessionStorage.getItem(insuranceConstant.USER_INFO))
      }
      this.paymentResult = data.subscriptionResponse;
      if(this.paymentResult != null){
        const place = this.paymentResult.policyHolder.address;
        this.address = `${place.streetAddress} - ${place.city} - ${place.country}`
      }
      const quoteResponse = data.qouteResponse
      if(quoteResponse != null){
        if(quoteResponse.context){
          this.currency = quoteResponse.context.currency;
        }else {
          this.currency = sessionStorage.getItem(insuranceConstant.INSURANCE_CURRENCY) || 'USD';
        }
      }else {
        this.currency = sessionStorage.getItem(insuranceConstant.INSURANCE_CURRENCY) || 'USD';
      }
      if(data.agentVcn && this.initialRequest){
        this.initialRequest = false;
        this.insuranceBooking();
      }
    
    });
  }

  insuranceBooking() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    if(paymentInfo){
      const insurancePaymentReq: SubscribePolicyRequest = JSON.parse(sessionStorage.getItem(insuranceConstant.INSURANCE_PAYMENT_REQ));
      paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      insurancePaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new InsuranceActions.SubscriptionStart(
           { data: insurancePaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }

}
