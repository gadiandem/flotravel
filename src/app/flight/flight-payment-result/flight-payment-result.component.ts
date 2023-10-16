import { Component, OnDestroy, OnInit } from '@angular/core';

import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { PassegerInfo } from 'src/app/model/flight/payment-info/passeger.info';
import { flightConstant, flightProvider, flightTypeValue } from '../flight.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as FlightListActions from './../../flight/store/flight-list.actions';
import * as fromApp from '../../store/app.reducer';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { FlightOrderResponse } from 'src/app/model/flight/create-order/flight-order-res';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { appConstant } from 'src/app/app.constant';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { Flight } from '../../model/flight/flight-list/flight';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { Subscription } from 'rxjs';
import { OrderChangeReq } from 'src/app/model/flight/order-change';

@Component({
  selector: 'app-flight-payment-result',
  templateUrl: './flight-payment-result.component.html',
  styleUrls: ['./flight-payment-result.component.css']
})
export class FlightPaymentResultComponent implements OnInit, OnDestroy {
  sub: Subscription;
  typeFlight: string;
  fetchFailed = false;
  isPayment = false;
  errorMes: string;

  passengersInfo: PassegerInfo[];
  searchFlightForm: SearchFlightForm;
  departureFlight: SelectedFlight;
  returnFlight: SelectedFlight;
  nextFlights: SelectedFlight[];
  currency: string;
  totalTripPrice: number;
  totalTaxes: number;
  flightOrderRequest: FlightPaymentRequest;
  flightHoldBookingOrderRequest: FlightPaymentRequest;
  flightOrder: FlightOrderResponse;
  flightBooking: boolean;
  aeroProvider: boolean;
  etProvider: boolean;
  refundProtectItem: any;
  refundProtectPrice: number;
  smartDelayItem: any;
  axaInsuranceItem: any;
  traceMeItem: any;
  gcaItem: any;
  hourDuration: number;
  minuteDuration: number;
  orderChange: OrderChangeReq;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: Router,
    private activatedRoute: ActivatedRoute) { }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.flightBooking = true;
    this.orderChange = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_CHANGE));
    this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.etProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.ET;
    this.refundProtectItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_REFUND_PROTECT));
    this.refundProtectPrice = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_PRICE_REFUND_PROTECT));
    this.smartDelayItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_SMART_DELAY));
    this.axaInsuranceItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_INSURANCE));
    this.traceMeItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_TRACEME));
    this.gcaItem = JSON.parse(sessionStorage.getItem(flightConstant.ADD_ON_GCA));
    this.flightOrderRequest = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
    this.flightHoldBookingOrderRequest = JSON.parse(sessionStorage.getItem(appConstant.PAY_HOLD_BOOKING_REQ));
    this.sub = this.store.select('flightList').subscribe((data) => {
        this.fetchFailed = data.failure;
        this.isPayment = data.loading;
       // console.log(JSON.stringify(data));
       // this.fetchFailed = true;
        // this.isPayment = false;
        this.errorMes = data.errorMessage;
        this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
         if(this.departureFlight){
          console.log(JSON.stringify(this.departureFlight.flight.offerItemList[0].totalAmount));
         }
       
        this.totalTripPrice = 0;
        this.totalTaxes = 0;
        if(this.orderChange){
          this.totalTripPrice += this.departureFlight.flight.offerItemList[0].totalAmount;
        }
        if (this.departureFlight && this.departureFlight.offerItem) {
          this.currency = this.departureFlight.offerItem.currency;
          if (this.etProvider) {
            this.totalTripPrice += this.departureFlight.offerItem.totalPriceOfFlight;
          } else {
          this.totalTripPrice += this.departureFlight.offerItem.totalAmount;
          }
          this.totalTaxes += this.departureFlight.offerItem.taxes;
        }
        if(sessionStorage.getItem(flightConstant.FLIGHT_TYPE) == flightTypeValue.ROUND_TRIP){
        this.returnFlight = data.returnFlight || JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
        if (this.returnFlight && this.returnFlight.offerItem) {
          console.log(JSON.stringify(this.returnFlight));
          if (this.etProvider) {
            this.totalTripPrice += this.returnFlight.offerItem.totalPriceOfFlight;
          } else {
          this.totalTripPrice += this.returnFlight.offerItem.totalAmount;
          }
          this.totalTaxes += this.returnFlight.offerItem.taxes;
        }
      }
        this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
        if (this.searchFlightForm) {
          this.typeFlight = this.searchFlightForm.typeFlight;
        }
        this.flightOrderRequest = data.flightBookingReq || JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
        if (!data.failure && !data.loading) {
          this.flightOrder = data.flightBookingResult;
        }
        if (!sessionStorage.getItem('ISSUE_TICKET_ONLY')) {
           if (data.agentVcn && this.flightBooking) {
                 this.flightBooking = false;
                 this.flightBookingAndPayment();
           }
      }
    });
  }
flightBookingAndPayment() {
    const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    const flightPaymentInfo: FlightPaymentData = JSON.parse(sessionStorage.getItem(appConstant.FLIGHT_PAYMENT_INFO));
    const flightPaymentReq: FlightPaymentRequest = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
    if (paymentInfo) {
     paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      paymentInfo.currency = flightPaymentInfo.currency;
      paymentInfo.price = flightPaymentInfo.totalPrice;
      flightPaymentReq.paymentInfo = paymentInfo;
        this.store.dispatch(
          new FlightListActions.BookingFlightStart(
             flightPaymentReq
          )
        );
      } else {
        this.fetchFailed = true;
        this.errorMes = 'vcn payment not available';
      }
    }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if (data.flightSegments.length > 1) {
      data.flightSegments.forEach(segment => {
        const hour = segment.duration.split('H')[0];
        const minute  = segment.duration.split('M')[0].split('H')[1];
        this.hourDuration += +hour;
        this.minuteDuration += +minute;
        if (this.minuteDuration >= 60) {
          this.hourDuration += 1;
          this.minuteDuration -= 60;
        }
      });
      return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
    } else {
      return data.flightSegments[0].duration;
    }
  }
}
