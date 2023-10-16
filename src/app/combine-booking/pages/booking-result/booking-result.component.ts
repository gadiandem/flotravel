import { Component, OnInit } from '@angular/core';

import { PassegerInfo } from 'src/app/model/flight/payment-info/passeger.info';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { appConstant } from 'src/app/app.constant';
import { CombineServicePaymentRequest } from 'src/app/model/combine/combine-service-request';
import { combineBookingConstant } from '../../combine-booking.constant';
import { CombineBookingService } from 'src/app/service/combine/combine-booking.service';
import { CombineShoppingReq } from 'src/app/model/combine/shopping-req';
import { CombineServicePaymentResponse } from 'src/app/model/combine/combine-service-response';
@Component({
  selector: 'app-booking-result',
  templateUrl: './booking-result.component.html',
  styleUrls: ['./booking-result.component.css']
})
export class BookingResultComponent implements OnInit {

  typeFlight: string;
  fetchFailed = false;
  isPayment = false;
  errorMes: string;

  passegersInfo: PassegerInfo[];
  searchListRequest: CombineShoppingReq;
  departureFlight: SelectedFlight;
  returnFlight: SelectedFlight;
  nextFlights: SelectedFlight[];
  currency: string;
  totalTripPrice: number;
  totalTaxes: number;
  combineOrderRequest: CombineServicePaymentRequest;
  bookingOrderRes: CombineServicePaymentResponse;
  constructor(
    private store: Store<fromApp.AppState>,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private combineService: CombineBookingService) { }

  ngOnInit() {
    // this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.combineOrderRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_ORDER_CREATE_REQ));
    this.searchListRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_REQUEST));
    this.departureFlight = JSON.parse(sessionStorage.getItem(combineBookingConstant.DEPARTURE_FLIGHT));
    if (this.combineOrderRequest) {
      // this.bookingOrderRes = JSON.parse(sessionStorage.getItem(combineBookingConstant.SERVICE_BOOKING_RES));
      this.bookingAndPayment();
    }
    // this.store.select('flightList').subscribe((data) => {
    //     this.fetchFailed = data.failure;
    //     this.isPayment = data.loading;
    //     this.errorMes = data.errorMessage
    //     this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
    //     this.totalTripPrice = 0;
    //     this.totalTaxes = 0;
    //     if(this.departureFlight){
    //       this.currency = this.departureFlight.offerItem.currency;
    //       this.totalTripPrice += this.departureFlight.offerItem.totalAmount;
    //       this.totalTaxes += this.departureFlight.offerItem.taxes;
    //     }
    //     this.returnFlight = data.returnFlight || JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
    //     if(this.returnFlight){
    //       this.totalTripPrice += this.returnFlight.offerItem.totalAmount;
    //       this.totalTaxes += this.returnFlight.offerItem.taxes;
    //     }
    //     this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
    //     if(this.searchFlightForm){
    //       this.typeFlight = this.searchFlightForm.typeFlight;
    //     }
    //     this.combineOrderRequest = data.flightBookingReq || JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
    //     console.log(this.combineOrderRequest);
    //     if(!data.failure && !data.loading){
    //       this.flightOrder = data.flightBookingResult;
    //     }

    //     if(data.agentVcn && this.flightBooking){
    //       this.flightBooking = false;
    //       this.bookingAndPayment();
    //     }
    // });
  }
bookingAndPayment() {
  const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
  const isVcnPayment = this.combineOrderRequest.paymentInfo.vcnPayment;
  if (paymentInfo && isVcnPayment) {
      paymentInfo.vcnPayment = paymentInfo.vcnPayment;
      paymentInfo.traceNumber = paymentInfo.traceNumber;
      paymentInfo.otpValue = paymentInfo.otpValue;
      this.combineOrderRequest.paymentInfo = paymentInfo;
  }
  this.isPayment = true;
  this.combineService.paymentAndBooking(this.combineOrderRequest).subscribe(
    (res) => {
      this.isPayment = false;
      this.fetchFailed = false;
      console.log(res);
      sessionStorage.setItem(combineBookingConstant.SERVICE_BOOKING_RES, JSON.stringify(res));
      this.bookingOrderRes = res;
    }, e => {
      console.log(e);
      this.isPayment = false;
      this.fetchFailed = true;
      this.errorMes = e.message;
    }
  );

    // const paymentInfo: PaymentInfo = JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
    // if(paymentInfo){
    //   const flightPaymentReq: FlightPaymentRequest = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
    //   paymentInfo.vcnPayment = paymentInfo.vcnPayment;
    //   paymentInfo.traceNumber = paymentInfo.traceNumber;
    //   paymentInfo.otpValue = paymentInfo.otpValue;
    //   flightPaymentReq.paymentInfo = paymentInfo;

    //   this.store.dispatch(
    //     new FlightListActions.BookingFlightStart(
    //        flightPaymentReq
    //     )
    //   );
    // } else {
    //   this.fetchFailed = true;
    //   this.errorMes = 'vcn payment not available';
    // }
  }
}
