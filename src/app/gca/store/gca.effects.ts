import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as GcaActions from './gca.actions';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { gcaConstant } from '../gca.constant';
import { GcaListRes } from '../../model/gca/shopping/response/gca-list-res';
import { SearchGcaForm } from '../../model/gca/shopping/request/search-gca-form';
import { GcaQuoteReq } from '../../model/gca/quote/request/gca-quote-req';
import { QuoteCreatedRes } from '../../model/gca/quote/response/quote-created-res';
import { PaymentInfoReq } from 'src/app/model/gca/payment-info/payment-info-req';
import { PaymentBookingResult } from 'src/app/model/gca/payment-booking-result/payment-booking-result';
import { FlocashVCNRes } from '../../model/common/flocash-vcn-res';
import { appConstant } from '../../app.constant';
import {PaymentService} from '../../service/payment/payment.service';
import {VcnRequest} from '../../model/flocash/response/vcn-request';

const gcaListUrl = environment.baseUrl + 'gca/shopping';
const gcaQuoteCreateUrl = environment.baseUrl + 'gca/quote';
const gcaCheckoutBookingUrl = environment.baseUrl + 'gca/booking';
const requestVCNGcaUrl = environment.baseUrl + 'flocash/requestVCN/provider/gca';

const handleGcaResult = (gcaRes: GcaListRes) => {
  sessionStorage.setItem(gcaConstant.GCA_LIST_RESULT, JSON.stringify(gcaRes));
  return new GcaActions.SearchGcaSuccess(gcaRes);
};

const handleCreateGcaQuoteResult = (quoteGcaCreatedRes: QuoteCreatedRes) => {
  sessionStorage.setItem(gcaConstant.GCA_QUOTE_RESULT, JSON.stringify(quoteGcaCreatedRes));
  return new GcaActions.CreateGcaQuoteSuccess(quoteGcaCreatedRes);
};

const handleCheckoutBookingGca = (checkoutRes: PaymentBookingResult) => {
  sessionStorage.setItem(gcaConstant.CHECKOUT_BOOKING_RESULT, JSON.stringify(checkoutRes));
  return new GcaActions.PaymentGcaSuccess(checkoutRes);
};

const handleRequestVCNSuccess = (
  store: Store<fromApp.AppState>,
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new GcaActions.GetVcnSuccess(vcnRes);
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new GcaActions.PaymentGcaFail(errorMessage));
};

@Injectable()
export class GcaEffects {
  @Effect()
  fetchGcaList = this.actions$.pipe(
    ofType(GcaActions.SEARCH_GCA_START),
    switchMap((actionData: GcaActions.SearchGcaStart) => {
      const data: SearchGcaForm = actionData.payload.data;
      return this.http.post<GcaListRes>(gcaListUrl, data).pipe(
        map((res: GcaListRes) => {
          return handleGcaResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  createGcaQuote = this.actions$.pipe(
    ofType(GcaActions.CREATE_GCA_QUOTE_START),
    switchMap((actionData: GcaActions.CreateGcaQuoteStart) => {
      const data: GcaQuoteReq = actionData.payload.data;
      return this.http.post<QuoteCreatedRes>(gcaQuoteCreateUrl, data).pipe(
        map((res: QuoteCreatedRes) => {
          console.log(res);
          return handleCreateGcaQuoteResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  checkoutGcaBooking = this.actions$.pipe(
    ofType(GcaActions.PAYMENT_GCA_START),
    switchMap((actionData: GcaActions.PaymentGcaStart) => {
      const data: PaymentInfoReq = actionData.payload.data;
      return this.http.post<PaymentBookingResult>(gcaCheckoutBookingUrl, data).pipe(
        map((res: PaymentBookingResult) => {
          console.log(res);
          return handleCheckoutBookingGca(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(GcaActions.GET_VCN_START),
    switchMap((actionData: GcaActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildGcaRequest(
          clientData.bookingId,
          clientData.vcnPayment,
          clientData.cardPayment,
          clientData.customerInfo,
          clientData.gcaBookingContact,
          clientData.currency,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking
        );
      }
      const vcnRequest = new VcnRequest();
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.merchantPayment = clientData.merchantPayment;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = +clientData.amount;
      // header
      const headers = new HttpHeaders()
        .set('environment', environment.paymentEnvironment);
      return this.http.post<FlocashVCNRes>(requestVCNGcaUrl, vcnRequest, { headers }).pipe(
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

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
    private paymentService: PaymentService
  ) {}
}
