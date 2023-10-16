import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { HoldFlightResponse } from 'src/app/model/flight/hold-booking';
import { appConstant, SERVICENAME} from 'src/app/app.constant';
import * as FlightListActions from 'src/app/flight/store/flight-list.actions';
import * as fromApp from 'src/app/store/app.reducer';
import {Store} from '@ngrx/store';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { DepositStep1 } from 'src/app/model/wallet/deposit/deposit-step-1';
import { depositConstant } from 'src/app/wallet/deposit-money/deposit.constant';


@Component({
  selector: 'app-view-saved-flight',
  templateUrl: './view-saved-flight.component.html',
  styleUrls: ['./view-saved-flight.component.css']
})
export class ViewSavedFlightComponent implements OnInit {

  bookingDetail: HoldFlightResponse;
  bookingId: string;
  isLoading = false;
  user: UserDetail;
  startRate = 1;
  currency: string;
  isEnoughBalance = false;
  countryCode: string;
  country = '';
  totalTripPriceCache: number;
  formSubmitError: boolean;
  isVcnPayment: boolean;
  merchantExist: boolean;

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private flightHistoryService: FlightBookingHistoryService) { }

  ngOnInit() {
    this.bookingDetail = new HoldFlightResponse();
    this.isVcnPayment = false;
    this.merchantExist = false;
    this.user = JSON.parse(localStorage.getItem('accountInfo'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['bookingId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
        this.flightHistoryService.flightHoldBookingDetail(this.bookingId).subscribe(
          (res: HoldFlightResponse) => {
            this.bookingDetail = res;
           // console.log(JSON.stringify(this.bookingDetail))
            this.totalTripPriceCache = res.holdBookingResponse.totalOrderPrice;
            this.startRate = 4;
            if (res != null) {
              this.currency = res.flightPaymentReq.paymentInfo.currency;
            } else {
              this.route.navigate(['/flight/hold-booking-result']);
            }
            this.isLoading = false;
          }, e => {
            this.isLoading = false;
            console.log(e);
          }
        ); 
      } else {
        this.route.navigate(['/login']);
      }
    });
  }

   buyNow() {
    let flightPaymentData: FlightPaymentData =  Object.assign({}, this.bookingDetail.flightPaymentReq);
      flightPaymentData.id = this.bookingDetail.id;
      flightPaymentData.accountBooking = this.bookingDetail.accountBooking;
      flightPaymentData.currency =  this.currency;
      flightPaymentData.merchantPayment = this.user ? this.user.merchantPayment : null;
      flightPaymentData.vcnPayment = this.isVcnPayment;;
      flightPaymentData.holdFlightResponse = this.bookingDetail;
      flightPaymentData.totalPrice = this.bookingDetail.holdBookingResponse.totalOrderPrice;
      flightPaymentData.bookingForUser = this.bookingDetail.bookingForUser;
      flightPaymentData.passegersInfo = this.bookingDetail.flightPaymentReq.customerInfos; 
      console.log(this.isVcnPayment);
      sessionStorage.setItem(appConstant.PAY_HOLD_BOOKING_REQ, JSON.stringify(flightPaymentData));
      sessionStorage.setItem('ISSUE_TICKET_ONLY', JSON.stringify(true));
      if (!this.isVcnPayment) {
        this.store.dispatch(
          new FlightListActions.HoldBookingIssueTicket(this.bookingDetail.flightPaymentReq)
        );
      //  this.route.navigate(['/flight/booking-result'], {
      //    relativeTo: this.activatedRoute,
       // });
      }else{
        this.store.dispatch(new FlightListActions.GetVcnStart(flightPaymentData));
        this.route.navigate(['/flight/updateOtp'], {
            relativeTo: this.activatedRoute,
        });

      }
   }


  VCNPayment(){
    this.isVcnPayment = true;
    this.buyNow();
  } 

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }
  }
  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
  }
}


