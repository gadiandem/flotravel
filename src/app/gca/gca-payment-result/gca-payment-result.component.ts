import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FlocashData } from 'src/app/model/flocash/flocash-data';
import * as GcaActions from "../store/gca.actions";
import * as fromApp from "../../store/app.reducer";
import { PaymentBookingResult } from 'src/app/model/gca/payment-booking-result/payment-booking-result';
import { gcaConstant } from '../gca.constant';
import {SearchGcaForm} from '../../model/gca/shopping/request/search-gca-form';
import {AirportRes} from '../../model/flight/airport/airportRes';
import {Meta} from '../../model/gca/common/meta';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { appConstant, FLOCASH_CREATE_ORDER_STATUS, REDIRECTMETHOD, REQUESTSTATUS } from 'src/app/app.constant';
import { PaymentInfoReq } from 'src/app/model/gca/payment-info/payment-info-req';
import {QuoteCreatedRes} from '../../model/gca/quote/response/quote-created-res';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectedTerminal } from 'src/app/model/gca/common/selected-terminal';
import { ServiceTerminalGca } from 'src/app/model/gca/shopping/response/service-terminal-gca';

@Component({
  selector: 'app-gca-payment-result',
  templateUrl: './gca-payment-result.component.html',
  styleUrls: ['./gca-payment-result.component.css']
})
export class GcaPaymentResultComponent implements OnInit {
  isPayment = false;
  paymentReq: any;
  floCash: FlocashData;
  searchGcaForm: SearchGcaForm;
  gcaPaymentRes: PaymentBookingResult;
  gcaQuoteResult: QuoteCreatedRes;
  departureAirport: AirportRes;
  arrivalAirport: AirportRes;
  currency: string;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialRequest: boolean;

  selectedDepartureService: any;
  selectedArrivalService: any
  // userInfo: UserInfo;

  adults: number;
  children: number;
  infants: number;
  metaReq: Meta;
  statusRequest: string;

  selectedDepartureServices: ServiceTerminalGca[];
  selectedDepartureTerminal: SelectedTerminal;

  selectedArrivalServices: ServiceTerminalGca[];
  selectedArrivalTerminal: SelectedTerminal;
  
  constructor(private store: Store<fromApp.AppState>, private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.selectedDepartureServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_SERVICES)) || [];
    this.selectedDepartureTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_TERMINAL));
    this.selectedArrivalServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_SERVICE)) || [];
    this.selectedArrivalTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_TERMINAL));
    this.searchGcaForm = JSON.parse(sessionStorage.getItem(gcaConstant.SEARCH_GCA));
    this.departureAirport = JSON.parse(sessionStorage.getItem(gcaConstant.DEPARTURE_AIRPORT));
    this.arrivalAirport = JSON.parse(sessionStorage.getItem(gcaConstant.ARRIVAL_AIRPORT));
    this.metaReq = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER)) || null;
    this.gcaQuoteResult = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_QUOTE_RESULT)) || null;
    if (this.metaReq) {
      this.adults = this.metaReq.adult;
      this.children = this.metaReq.child;
      this.infants = this.metaReq.infant;
    }
    this.currency = 'USD';
    this.initialRequest = true;
    this.store.select("gcaList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gcaPaymentRes = data.checkoutResult;
      if(this.gcaPaymentRes){
        this.handlerBookingResult(this.gcaPaymentRes);
      }
      if(data.agentVcn && this.initialRequest){
        this.initialRequest = false;
        this.gcaCheckoutBooking();
      }
    });
  }

  gcaCheckoutBooking() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    if(paymentInfo){
      const gcaCheckoutPaymentReq: PaymentInfoReq = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PAYMENT_REQ));
      // paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      // paymentInfo.traceNumber = paymentInfo.traceNumber;
      // paymentInfo.otpValue = paymentInfo.otpValue;
      paymentInfo.currency = gcaCheckoutPaymentReq.paymentInfo.currency;
      paymentInfo.price = gcaCheckoutPaymentReq.paymentInfo.price;
      paymentInfo.payer = gcaCheckoutPaymentReq.paymentInfo.payer;
      paymentInfo.name = gcaCheckoutPaymentReq.paymentInfo.name;
      gcaCheckoutPaymentReq.paymentInfo = paymentInfo;

      this.store.dispatch(
        new GcaActions.PaymentGcaStart(
           { data: gcaCheckoutPaymentReq}
        )
      );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'vcn payment not available';
    }
  }

  handlerBookingResult(bookingRes: PaymentBookingResult){
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
