import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {switchMap, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as TracemeActions from './traceme.actions';
import {environment} from '../../../environments/environment';
import {FlocashVCNRes} from 'src/app/model/common/flocash-vcn-res';
import {appConstant} from 'src/app/app.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {VcnRequest} from 'src/app/model/flocash/response/vcn-request';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {TraceMeShoppingReq} from 'src/app/model/traceme/shopping/traceme-shopping-req';
import {TraceMeShoppingRes} from 'src/app/model/traceme/shopping/traceme-shopping-res';
import {tracemeConstant} from '../traceme.constant';
import {FlocashPaymentTraceMe} from 'src/app/model/traceme/history/traceme-history-item';

const tracemeListUrl = environment.baseUrl + 'traceMe/shopping';

const tracemePaymentUrl = environment.baseUrl + 'traceMe/booking';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN/provider/traceme';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';

const handleTracemeResult = (trameRes: TraceMeShoppingRes) => {
  sessionStorage.setItem(
    tracemeConstant.TRACEME_LIST_RES,
    JSON.stringify(trameRes)
  );
  return new TracemeActions.SearchTracemeSuccess(trameRes);
};

const handleTracemePayment = (paymentRes: FlocashPaymentTraceMe) => {
  return new TracemeActions.PaymentTracemeSuccess(paymentRes);
};

const handleRequestVCNSuccess = (
  store: Store<fromApp.AppState>,
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new TracemeActions.GetVcnSuccess(vcnRes);
};


const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new TracemeActions.PaymentTracemeFail(errorMessage));
};

@Injectable()
export class TracemeEffects {
  @Effect()
  fetchTracemeList = this.actions$.pipe(
    ofType(TracemeActions.SEARCH_TRACEME_START),
    switchMap((actionData: TracemeActions.SearchTracemeStart) => {
      const data: TraceMeShoppingReq = actionData.payload.data;
      // header
      const headers = new HttpHeaders().set('environment', environment.paymentEnvironment);

      return this.http.post<TraceMeShoppingRes>(tracemeListUrl, data, {headers}).pipe(
        map((res: TraceMeShoppingRes) => {
          return handleTracemeResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(TracemeActions.GET_VCN_START),
    switchMap((actionData: TracemeActions.GetVcnStart) => {
      const clientData = actionData.payload;
      // tracemeQuote: this.selectedQuote,
      //   cardPayment,
      //   vcnPayment: this.isVcnPayment,
      //   merchantPayment: this.user.merchantPayment,
      //   currency: this.currency,
      //   amount: +this.selectedQuote.quote.premium,
      //   customerInfo: this.customersForm.value,
      //   tracemeBookingContact: bookingContact,
      //   accountBooking,
      //   bookingForUser: this.bookingForUser,
      //   userIsBooking: this.userIsBooking,
      //   countryCode: this.countryCode
      if (clientData.vcnPayment) {
        this.paymentService.buildTracemeRequest(
          clientData.tracemeQuote,
          clientData.vcnPayment,
          clientData.cardPayment,
          clientData.customerInfo,
          clientData.tracemeBookingContact,
          clientData.currency,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking,
          clientData.countryCode
        );
      }
      const vcnRequest = new VcnRequest();
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = +clientData.amount;

      return this.http.post<FlocashVCNRes>(requestVCNUrl, vcnRequest).pipe(
        map((res: FlocashVCNRes) => {
          if (res !== null) {
            return handleRequestVCNSuccess(this.store, res);
          }
        }),
        catchError((errorRes) => {
          sessionStorage.setItem(appConstant.OTP_ERROR_MESSAGE, errorRes.error.message);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  traceMePayment = this.actions$.pipe(
    ofType(TracemeActions.PAYMENT_TRACEME_START),
    switchMap((actionData: TracemeActions.PaymentTracemeStart) => {
      const paymentReq = actionData.payload.data;
      // header
      const headers = new HttpHeaders()
        .set('environment', environment.paymentEnvironment);
      return this.http.post<FlocashPaymentTraceMe>(tracemePaymentUrl, paymentReq, {headers}).pipe(
        map((res: FlocashPaymentTraceMe) => {
          if (res) {
            return handleTracemePayment(res);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
    private paymentService: PaymentService
  ) {
  }
}
