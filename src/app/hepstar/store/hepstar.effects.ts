import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as HepstarActions from './hepstar.actions';
import { environment } from '../../../environments/environment';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { appConstant } from 'src/app/app.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { VcnRequest } from 'src/app/model/flocash/response/vcn-request';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { hepstarConstant } from '../hepstar.constant';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';

const hepstarProductListUrl = environment.baseUrl + 'hepstar/shopping';

const hepstarPaymentUrl = environment.baseUrl + 'hepstar/booking';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';

const handleHepstarResult = (hepstarProductListRes: SearchHepstarRes) => {
  sessionStorage.setItem(
    hepstarConstant.PRODUCT_LIST,
    JSON.stringify(hepstarProductListRes)
  );
  sessionStorage.setItem(
    hepstarConstant.SESSION,
    hepstarProductListRes.sessionId
  );

  return new HepstarActions.SearchHepstarSuccess(hepstarProductListRes);
};

const handleHepstarPayment = (paymentRes: FlocashPaymentTraceMe) => {
  return new HepstarActions.PaymentHepstarSuccess(paymentRes);
};

const handleRequestVCNSuccess = (
  store: Store<fromApp.AppState>,
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new HepstarActions.GetVcnSuccess(vcnRes);
};


const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new HepstarActions.PaymentHepstarFail(errorMessage));
};

@Injectable()
export class HepstarEffects {
  @Effect()
  fetchHepstarList = this.actions$.pipe(
    ofType(HepstarActions.SEARCH_HEPSTAR_START),
    switchMap((actionData: HepstarActions.SearchHepstarStart) => {
      const data: HepstarSearchFormData = actionData.payload.data;
      const request  = this.hepstarService.buildHepstarShopping(data);
      sessionStorage.setItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM, JSON.stringify(request));
      return this.http.post<SearchHepstarRes>(hepstarProductListUrl, request).pipe(
        map((res: SearchHepstarRes) => {
          return handleHepstarResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(HepstarActions.GET_VCN_START),
    switchMap((actionData: HepstarActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      const vcnRequest = new VcnRequest();
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = +clientData.amount;
      // header
      const headers = new HttpHeaders()
      .set('environment', environment.paymentEnvironment);
      return this.http.post<FlocashVCNRes>(requestVCNUrl, vcnRequest, { headers }).pipe(
        map((res: FlocashVCNRes) => {
          if (res !== null) {
            sessionStorage.removeItem(appConstant.OTP_ERROR_MESSAGE);
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
    ofType(HepstarActions.PAYMENT_HEPSTAR_START),
    switchMap((actionData: HepstarActions.PaymentHepstarStart) => {
      const paymentReq = actionData.payload.data;
       // header
       const headers = new HttpHeaders()
       .set('environment', environment.paymentEnvironment);
      return this.http.post<FlocashPaymentTraceMe>(hepstarPaymentUrl, paymentReq, {headers}).pipe(
        map((res: FlocashPaymentTraceMe) => {
          if (res) {
            return handleHepstarPayment(res);
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
    private hepstarService: HepstarService,
    public datepipe: DatePipe,
    private paymentService: PaymentService
  ) {}
}
