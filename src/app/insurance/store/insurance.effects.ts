import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as InsuranceActions from './insurance.actions';
import { environment } from '../../../environments/environment';
import { InsurancePackageType } from 'src/app/model/insurance/package-type/insurance.package';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';
import { insuranceConstant } from '../insurance.constant';
import { AuthResponse } from 'src/app/model/insurance/get-token/auth.response';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { VcnRequest } from 'src/app/model/flocash/response/vcn-request';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { appConstant } from 'src/app/app.constant';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';

const insurancePackageListUrl = environment.baseUrl + 'insurance/packageList';
const insurancePackageDetailUrl = environment.baseUrl + 'insurance/package';
const insuranceAuthGetTokenUrl = environment.baseUrl + 'insurance/token';
const insuranceQoutelUrl = environment.baseUrl + 'insurance/quote';
const floInsuranceQoutelUrl = environment.baseUrl + 'floinsurance/quote';
const floInsuranceQouteFlightUrl = environment.baseUrl + 'floinsurance/quote/flight';
const insuranceSubscriotionlUrl = environment.baseUrl + 'insurance/subscription';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN/provider/axa';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';
const handleInsurancePackagesResult = (
  insuranceListRes: InsurancePackageType[]
) => {
  sessionStorage.setItem(
    insuranceConstant.PACKAGE_LIST,
    JSON.stringify(insuranceListRes)
  );
  return new InsuranceActions.SearchInsuranceListSuccess(insuranceListRes);
};

const handleInsurancePackageDetail = (
  insuranceDetailRes: InsurancePackageType
) => {
  sessionStorage.setItem(
    insuranceConstant.PACKAGE_SELECTED,
    JSON.stringify(insuranceDetailRes)
  );
  return new InsuranceActions.FetchInsuranceDetailSuccess(insuranceDetailRes);
};

const handleAxaGetToken = (authRes: AuthResponse) => {
  const timeExpire = authRes.expiresIn;
  const expirationDate = new Date().getTime() + timeExpire * 1000;
  sessionStorage.setItem(
    insuranceConstant.AXA_TOKEN_EXPIRE_TIME,
    expirationDate.toString()
  );
  sessionStorage.setItem(insuranceConstant.AUTH_AXA, JSON.stringify(authRes));
  return new InsuranceActions.AuthAxaSuccess(authRes);
};
const handleQouteResult = (quoteRes: QuoteResponse) => {
  sessionStorage.setItem(
    insuranceConstant.QUOTE_RESPONSE,
    JSON.stringify(quoteRes)
  );
  return new InsuranceActions.QouteListSuccess(quoteRes);
};

const handleSubscriptionResult = (subsriptionRes: FlocashPaymentInsurance) => {
  sessionStorage.setItem(
    insuranceConstant.SUBSCRIPTION_RESPONSE,
    JSON.stringify(subsriptionRes)
  );
  return new InsuranceActions.SubscriptionSuccess(subsriptionRes);
};

const handleRequestVCNSuccess = (
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new InsuranceActions.GetVcnSuccess(vcnRes);
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new InsuranceActions.SearchInsuranceListFail(errorMessage));
};
@Injectable()
export class InsuranceEffects {
  @Effect()
  fetchInsurancePackages = this.actions$.pipe(
    ofType(InsuranceActions.SEARCH_INSURANCE_PACKAGE_LIST_START),
    switchMap((actionData: InsuranceActions.SearchInsurancePackageListStart) => {
      const quoteRequest = actionData.payload.data;
     // console.log(JSON.stringify(quoteRequest));
      return this.http
      .post<InsurancePackageType[]>(insurancePackageListUrl, quoteRequest)
        .pipe(
          map((res: InsurancePackageType[]) => {
            if (res.length > 0) {
              // console.log('!!!dataHotel: ' + JSON.stringify(res.result));
              sessionStorage.setItem(insuranceConstant.PACKAGE_LIST,JSON.stringify(res));
              return handleInsurancePackagesResult(res);
            } else {
              return of([]);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  fetchInsurancePackageDetail = this.actions$.pipe(
    ofType(InsuranceActions.FETCH_INSURANCE_DETAIL_START),
    switchMap((actionData: InsuranceActions.FetchInsuranceDetailStart) => {
      return this.http
        .get<InsurancePackageType>(
          `${insurancePackageDetailUrl}/${actionData.payload.packageId}`
        )
        .pipe(
          map((res: InsurancePackageType) => {
            // console.log('!!!dataHotel: ' + JSON.stringify(res.result));
            return handleInsurancePackageDetail(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  axaGetToken = this.actions$.pipe(
    ofType(InsuranceActions.AUTH_AXA_START),
    switchMap((actionDate: InsuranceActions.AuthAxaStart) => {
      const expireTokenDate = actionDate.payload.data;
      const isAuth = +expireTokenDate - new Date().getTime() > 0;
      if (expireTokenDate && isAuth) {
        const authRes: AuthResponse = JSON.parse(
          sessionStorage.getItem(insuranceConstant.AUTH_AXA)
        );
        if (authRes) {
          return of(handleAxaGetToken(authRes));
        }
      }
      return this.http.get<AuthResponse>(insuranceAuthGetTokenUrl).pipe(
        map((res: AuthResponse) => {
          // console.log('!!!dataHotel: ' + JSON.stringify(res.result));
          return handleAxaGetToken(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  fetchQouteList = this.actions$.pipe(
    ofType(InsuranceActions.QOUTE_LIST_START),
    switchMap((actionData: InsuranceActions.QouteListStart) => {
      const quoteRequest = actionData.payload.data;
      let headers = new HttpHeaders();
      const authRes: AuthResponse = JSON.parse(
        sessionStorage.getItem(insuranceConstant.AUTH_AXA)
      );
      if (quoteRequest.countryOfTravel == 'KE') {
      headers = this.addAuthorizationHeader(
        authRes.tokenType,
        authRes.accessToken
      );
      }
      let urlInsurance = floInsuranceQoutelUrl;
      if(quoteRequest.executionId){
        urlInsurance = floInsuranceQouteFlightUrl;
      }
     // console.log(JSON.stringify(headers));
      return this.http
        .post<QuoteResponse>(urlInsurance, quoteRequest, { headers })
        .pipe(
          map((response: QuoteResponse) => {
            if (response != undefined) {
            //console.log('Quote: ' + JSON.stringify(response));
              return handleQouteResult(response);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );
  @Effect()
  subscription = this.actions$.pipe(
    ofType(InsuranceActions.SUBSCRIPTION_START),
    switchMap((actionData: InsuranceActions.SubscriptionStart) => {
      const subscriptionRequest = actionData.payload;
      const subsriptionRequest = subscriptionRequest.data;
      let headers = new HttpHeaders();
       if (subsriptionRequest.quoteRequest.countryOfTravel == 'KE') {
          const authRes: AuthResponse = JSON.parse(
               sessionStorage.getItem(insuranceConstant.AUTH_AXA)
          );
          headers = this.addAuthorizationHeader(
               authRes.tokenType,
              authRes.accessToken
          );
      }
      return this.http
        .post<FlocashPaymentInsurance>(
          insuranceSubscriotionlUrl,
          subsriptionRequest,
          { headers }
        )
        .pipe(
          map((res: FlocashPaymentInsurance) => {
            if (res != undefined) {
              return handleSubscriptionResult(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(InsuranceActions.GET_VCN_START),
    switchMap((actionData: InsuranceActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildSubscriptionRequest(
          clientData.searchQuoteForm,
          clientData.vcnPayment,
          clientData.cardPayment,
          clientData.customerInfos,
          clientData.selectedQuoteProduct,
          clientData.bookingContact,
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
      vcnRequest.price = +clientData.selectedQuoteProduct.prices.priceAfterDiscountInclTax;
       // header
       const headers = new HttpHeaders()
       .set('environment', environment.paymentEnvironment);
      return this.http.post<FlocashVCNRes>(requestVCNUrl, vcnRequest, { headers }).pipe(
        map((res: FlocashVCNRes) => {
          if (res !== null) {
            return handleRequestVCNSuccess(res);
          }
        }),
        catchError((errorRes) => {
          sessionStorage.setItem(appConstant.OTP_ERROR_MESSAGE, errorRes.error.message);
          return handleError(errorRes);
        })
      );
    })
  );

  addAuthorizationHeader(tokenType: string, accessToken: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('authorization', `${tokenType} ${accessToken}`);
    return headers;
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    public datepipe: DatePipe,
    private paymentService: PaymentService
  ) {}
}
