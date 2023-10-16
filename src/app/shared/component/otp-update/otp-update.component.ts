import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appConstant } from 'src/app/app.constant';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';
import * as fromApp from '../../../store/app.reducer';
import * as FlightListActions from 'src/app/flight/store/flight-list.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-otp-update',
  templateUrl: './otp-update.component.html',
  styleUrls: ['./otp-update.component.css'],
})
export class OtpUpdateComponent implements OnInit, OnDestroy {
  subHotel: Subscription;
  subFlight: Subscription;
  subPackage: Subscription;
  subHotelCollection: Subscription;
  otpForm: FormGroup;
  formSubmitError: boolean;
  agentVcn: FlocashVCNRes;
  fetching = false;
  fetchFailed = false;
  errorMes: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.initForm();
    this.GetVcnStatus();
  }
  private initForm() {
    this.formSubmitError = false;
    this.otpForm = this.fb.group({
      otpValue: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }
  updateOtp() {
    console.log(JSON.stringify(this.agentVcn));
    if (this.otpForm.valid && this.agentVcn.cardOrder.traceNumber) {
      const paymentInfo: PaymentInfo = new PaymentInfo();
      paymentInfo.vcnPayment = true;
      paymentInfo.traceNumber = this.agentVcn.cardOrder.traceNumber;
      paymentInfo.otpValue = this.otpForm.value.otpValue;
      sessionStorage.setItem(
        appConstant.paymentInfo,
        JSON.stringify(paymentInfo)
      );
      const flightPaymentInfo: FlightPaymentData = JSON.parse(sessionStorage.getItem(appConstant.FLIGHT_PAYMENT_INFO));
      const flightPaymentData: FlightPaymentRequest = JSON.parse(sessionStorage.getItem(appConstant.PAY_HOLD_BOOKING_REQ));
      if (flightPaymentInfo) {
        if (flightPaymentInfo.bookingHold == true) {
             paymentInfo.vcnPayment = paymentInfo.vcnPayment;
             paymentInfo.traceNumber = paymentInfo.traceNumber;
             paymentInfo.otpValue = paymentInfo.otpValue;
             paymentInfo.currency = flightPaymentInfo.currency;
             paymentInfo.price = flightPaymentInfo.totalPrice;
             flightPaymentData.paymentInfo = paymentInfo;
             this.store.dispatch(
                new FlightListActions.HoldBookingIssueTicket(flightPaymentData)
            );
        }
      }
      this.route.navigate(['../booking-result'], {
        relativeTo: this.activeRoute,
      });
    } else {
      this.formSubmitError = true;
    }
  }

  private GetVcnStatus() {
    this.subHotel =  this.store.select('hotel').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.agentVcn = data.agentVcn ||  JSON.parse(localStorage.getItem(appConstant.AGENT_VCN));
    });
    this.subFlight =  this.store.select('flightList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.agentVcn = data.agentVcn ||  JSON.parse(localStorage.getItem(appConstant.AGENT_VCN));
    });
    this.subPackage =  this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.agentVcn = data.agentVcn ||  JSON.parse(localStorage.getItem(appConstant.AGENT_VCN));
    });
    this.subHotelCollection =  this.store.select('specialPackagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.agentVcn = data.agentVcn ||  JSON.parse(localStorage.getItem(appConstant.AGENT_VCN));
    });
  }

  ngOnDestroy(): void {
    if (this.subHotel) {
      this.subHotel.unsubscribe();
    }
    if (this.subFlight) {
      this.subFlight.unsubscribe();
    }
    if (this.subPackage) {
      this.subPackage.unsubscribe();
    }
    if (this.subHotelCollection) {
      this.subHotelCollection.unsubscribe();
    }
  }
}
