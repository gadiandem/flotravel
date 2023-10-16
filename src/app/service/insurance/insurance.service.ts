import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

import { environment } from '../../../environments/environment';
import { InsurancePackageType } from 'src/app/model/insurance/package-type/insurance.package';
import { AuthResponse } from 'src/app/model/insurance/get-token/auth.response';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as InsuranceActions from '../../insurance/store/insurance.actions';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { CancelReq } from 'src/app/model/insurance/cancellation/cancellation.req';
import { Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { PolicyHolderUpdate } from 'src/app/model/insurance/policy/policy-holder-update';
import { InsuranceHistoryListRequest } from 'src/app/model/insurance/history/insurance-history-list-request';
import { InsuranceHistoryListRes } from 'src/app/model/insurance/history/insurance-history-list-res';
import { appConstant } from 'src/app/app.constant';
import { InsurancePackageForm } from 'src/app/model/insurance/linsurance-package-form';
import { FloInsuranceProducts } from 'src/app/model/insurance/flo_insurance_products';
import { CountryRes } from 'src/app/model/common/country/country-res';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  insurancePackageListUrl = environment.baseUrl + 'floinsurance/packages';
  createInsurancePackageUrl = environment.baseUrl + 'floinsurance/packages/create';
  editInsurancePackageUrl = environment.baseUrl + 'floinsurance/packages/edit';
  insurancePackageDetailUrl = environment.baseUrl + 'insurance/package/detail/';
  insuranceCountriesListUrl = environment.baseUrl + 'insurance/countries';

  insuranceGetTokenUrl = environment.baseUrl + 'insurance/token';
  insuranceQoutelUrl = environment.baseUrl + 'insurance/quote';
  subscribepolicyUrl = environment.baseUrl + 'insurance/subscription';
  insurancePolicyByIdUrl = environment.baseUrl + 'insurance/policy';
  insurancePolicyByCriteriaUrl =
    environment.baseUrl + 'insurance/policy/criteriaSearch';
  insuranceCancelUrl = environment.baseUrl + 'insurance/policy/cancel';
  insurancePaymentHistoryListUrl = environment.baseUrl + 'insurance/history';
  insurancePaymentHistoryListByDateUrl = environment.baseUrl + 'insurance/history/filterByDate';
  insuranceGetPolicyHoderInfoUrl = environment.baseUrl + 'insurance/policy/update/';
  insuranceUpdatetPolicyHoderInfoUrl =
    environment.baseUrl + 'insurance/policy/update';

  insuranceDeleteUrl = environment.baseUrl + 'insurance/delete';
  private isValidToken = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
  ) {}

  getInsuranceCountryAvailabilityList() {
    const user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (user) {
      let headers = new HttpHeaders();
      if (user) {
        headers = headers.set('user-id', user.id);
        return this.http.get<CountryRes[]>(this.insuranceCountriesListUrl, { headers });
     }
   }
  }

  getInsurancePackageList() {
    const user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (user) {
      let headers = new HttpHeaders();
      if (user) {
        headers = headers.set('user-id', user.id);
        return this.http.get<FloInsuranceProducts[]>(this.insurancePackageListUrl, { headers });
     }
  }
  }

  getInsurancePackage(packageId: string) {
    const user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (user) {
      let headers = new HttpHeaders();
      if (user) {
        headers = headers.set('user-id', user.id);
        return this.http.get<FloInsuranceProducts>(this.insurancePackageListUrl + '/' + packageId, { headers });
     }
  }
  }
  getInsurancePackageDetail(packageId: string) {
    return this.http.get<InsurancePackageType>(
      this.insurancePackageDetailUrl + packageId
    );
  }

   getToken() {
       return this.http.get<AuthResponse>(this.insuranceGetTokenUrl);
   }

   updateInsuranceProduct(request: InsurancePackageForm, packageId: string) {
    const user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (user) {
      let headers = new HttpHeaders();
      if (user) {
        headers = headers.set('user-id', user.id);
        return this.http.post<FlocashPaymentInsurance>(`${this.editInsurancePackageUrl}/${packageId}`, request, {headers});

     }
   }
  }

  createInsuranceProduct(request: InsurancePackageForm) {
    const user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (user) {
      let headers = new HttpHeaders();
      if (user) {
        headers = headers.set('user-id', user.id);
        return this.http.post<FlocashPaymentInsurance>(this.createInsurancePackageUrl, request, {headers});

     }
   }
  }

  deleteInsuranceProduct(id: string) {
    return this.http.delete<any>(`${this.insurancePackageListUrl}/${id}`);
  }
  // getQuoteInsurance(tokenType: string, accessToken: string) {
  //   const headers = this.addAuthorizationHeader(tokenType, accessToken);
  //   const quoteRequest = new QuoteRequest();
  //   return this.http.post<QuoteResponse>(
  //     this.insuranceQoutelUrl,
  //     quoteRequest,
  //     { headers }
  //   );
  // }

  // subscribePolicy(
  //   searchQuoteForm: SearchQouteRequest,
  //   cardPayment: CardPaymentModel,
  //   userInfo: UserInfoInsurance,
  //   selectedQuoteProduct: Product,
  //   currency: string
  // ) {
  //   const authRes: AuthResponse = JSON.parse(
  //     sessionStorage.getItem(insuranceConstant.AUTH_AXA)
  //   );
  //   const headers = this.addAuthorizationHeader(
  //     authRes.tokenType,
  //     authRes.accessToken
  //   );
  //   const vcnPayment = false;
  //   const subscribePayload = this.buildSubscriptionRequest(
  //     searchQuoteForm,
  //     vcnPayment,
  //     cardPayment,
  //     userInfo,
  //     selectedQuoteProduct,
  //     currency
  //   );
  //   return this.http.post<FlocashPaymentInsurance>(
  //     this.subscribepolicyUrl,
  //     subscribePayload,
  //     { headers }
  //   );
  // }

  // buildSubscriptionRequest(
  //   searchQuoteForm: SearchQouteRequest,
  //   vcnPayment: boolean,
  //   cardPayment: CardPaymentModel,
  //   userInfo: UserInfoInsurance,
  //   selectedQuoteProduct: Product,
  //   currency: string
  // ): SubscribePolicyRequest {
  //   const subscribePlolicyRequest = new SubscribePolicyRequest();
  //   const paymentInfo = new PaymentInfo();
  //   paymentInfo.price = selectedQuoteProduct.prices.priceAfterDiscountInclTax;
  //   paymentInfo.currency = currency;
  //   paymentInfo.name = selectedQuoteProduct.name;
  //   if (!vcnPayment) {
  //     const cardInfo = new CardInfo();
  //     cardInfo.cardHolder = cardPayment.cardName;
  //     cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, "");
  //     const month_year: string[] = cardPayment.expiry.split(" / ");
  //     cardInfo.expireMonth = month_year[0];
  //     cardInfo.expireYear = month_year[1];
  //     cardInfo.cvv = cardPayment.cvv;
  //     paymentInfo.cardInfo = cardInfo;
  //   } else {
  //     paymentInfo.vcnPayment = vcnPayment;
  //     paymentInfo.traceNumber = "";
  //     paymentInfo.otpValue = "";
  //   }
  //   subscribePlolicyRequest.paymentInfo = paymentInfo;
  //   const subscriptionPayload = new SubscribePolicyData();
  //   subscriptionPayload.quoteCode = selectedQuoteProduct.quoteCode;
  //   subscriptionPayload.currency = currency;
  //   subscriptionPayload.priceAfterDiscountIncTax =
  //     selectedQuoteProduct.prices.priceAfterDiscountInclTax;
  //   subscribePlolicyRequest.subscribePolicyData = subscriptionPayload;

  //   const travel = new InsuranceTravel();
  //   travel.destinationArea = searchQuoteForm.countryOfTravel;
  //   travel.startDate = searchQuoteForm.startDate;
  //   travel.endDate = searchQuoteForm.endDate;
  //   travel.cost = searchQuoteForm.price;
  //   const travellers = new Travelers();
  //   travellers.adults = searchQuoteForm.adults;
  //   travellers.children = searchQuoteForm.children;
  //   travellers.infants = searchQuoteForm.infants;
  //   travel.travelers = travellers;

  //   return subscribePlolicyRequest;
  // }

  // getPolicyById(tokenType: string, accessToken: string) {
  //   const headers = this.addAuthorizationHeader(tokenType, accessToken);
  //   return this.http.get<FlocashPaymentInsurance>(this.insurancePolicyByIdUrl, {
  //     headers,
  //   });
  // }

  // getPolicyByCriteria(email: string, agentScope: string) {
  //   const authRes: AuthResponse = JSON.parse(
  //     sessionStorage.getItem(insuranceConstant.AUTH_AXA)
  //   );
  //   if (authRes) {
  //     const headers = this.addAuthorizationHeader(
  //       authRes.tokenType,
  //       authRes.accessToken
  //     );
  //     const params = new HttpParams()
  //       .set("agentScope", agentScope)
  //       .set("email", email);
  //     return this.http.get<FlocashPaymentInsurance[]>(
  //       this.insurancePolicyByCriteriaUrl,
  //       { headers: headers, params: params }
  //     );
  //   } else {
  //     this.getToken().subscribe((res: AuthResponse) => {
  //       if (res) {
  //         sessionStorage.setItem(
  //           insuranceConstant.AUTH_AXA,
  //           JSON.stringify(res)
  //         );
  //         const headers = this.addAuthorizationHeader(
  //           res.tokenType,
  //           res.accessToken
  //         );
  //         const params = new HttpParams()
  //           .set("agentScope", agentScope)
  //           .set("email", email);
  //         return this.http.get<FlocashPaymentInsurance[]>(
  //           this.insurancePolicyByCriteriaUrl,
  //           { headers: headers, params: params }
  //         );
  //       }
  //     });
  //   }
  // }

  // cancelPolicy(paymentId: string, reason: string) {
  //   const expireTokenDate = sessionStorage.getItem(
  //     insuranceConstant.AXA_TOKEN_EXPIRE_TIME
  //   );
  //   const isAuth = +expireTokenDate - new Date().getTime() > 0;
  //   if (expireTokenDate && isAuth) {
  //     const authRes: AuthResponse = JSON.parse(
  //       sessionStorage.getItem(insuranceConstant.AUTH_AXA)
  //     );
  //     const headers = this.addAuthorizationHeader(
  //       authRes.tokenType,
  //       authRes.accessToken
  //     );
  //     const cancelReq = new CancelReq();
  //     const dateCancel = new Date();
  //     cancelReq.cancellationDate = this.datePipe.transform(
  //       dateCancel,
  //       "yyyy-MM-dd"
  //     );
  //     cancelReq.cancellationReason = reason;
  //     return this.http
  //       .post<FlocashPaymentInsurance>(
  //         `${this.insuranceCancelUrl}/${paymentId}`,
  //         cancelReq,
  //         { headers }
  //       )
  //       .subscribe(
  //         (res: any) => {
  //           console.log("res: " + JSON.stringify(res));
  //           this.alertify.success("Cancel booking successful!");
  //           this.router.navigate(["/insurance/history"]);
  //         },
  //         (e) => {
  //           console.log(e.error.message);
  //           this.alertify.error(e.error.message);
  //         }
  //       );
  //   }
  //   this.getToken().subscribe((res: AuthResponse) => {
  //     sessionStorage.setItem(insuranceConstant.AUTH_AXA, JSON.stringify(res));
  //     const headers = this.addAuthorizationHeader(
  //       res.tokenType,
  //       res.accessToken
  //     );
  //     const cancelReq = new CancelReq();
  //     const dateCancel = new Date();
  //     cancelReq.cancellationDate = this.datePipe.transform(
  //       dateCancel,
  //       "yyyy-MM-dd"
  //     );
  //     cancelReq.cancellationReason = reason;
  //     return this.http
  //       .post<FlocashPaymentInsurance>(
  //         `${this.insuranceCancelUrl}/${paymentId}`,
  //         cancelReq,
  //         { headers }
  //       )
  //       .subscribe(
  //         (res: any) => {
  //           console.log("res: " + JSON.stringify(res));
  //           this.alertify.success("Cancel booking successful!");
  //           this.router.navigate(["/insurance/history"]);
  //         },
  //         (e) => {
  //           console.log(e.error.message);
  //           this.alertify.error(e.error.message);
  //         }
  //       );
  //   });
  // }

  cancelPolicy2(paymentId: string, reason: string, item_name: string) {
    const cancelReq = new CancelReq();
    const dateCancel = new Date();
    cancelReq.cancellationDate = this.datePipe.transform(
      dateCancel,
      'yyyy-MM-dd'
    );
    cancelReq.cancellationReason = reason;
    cancelReq.itemName = item_name;
    let headers = new HttpHeaders();
    if (cancelReq.itemName != 'Flotravel Insurance') {
      this.store.dispatch(
        new InsuranceActions.AuthAxaStart({ data: null })
      );
      const authRes: AuthResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.AUTH_AXA));

      headers = this.addAuthorizationHeader( authRes.tokenType, authRes.accessToken);
    }
    return this.http.post<FlocashPaymentInsurance>(`${this.insuranceCancelUrl}/${paymentId}`, cancelReq, {headers});
  }

  getUpdatePilicyHolderInfo(policyId: string) {
    // const headers = this.addAuthorizationHeader(tokenType, accessToken);
    const authRes: AuthResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.AUTH_AXA));
    const headers = this.addAuthorizationHeader( authRes.tokenType, authRes.accessToken);
    return this.http.get<PolicyHolderUpdate>(
      this.insuranceGetPolicyHoderInfoUrl + policyId, { headers }
    );
  }

  updatePilicyHolderInfo(policyUpdate: PolicyHolderUpdate, policyId: string) {
    // const headers = this.addAuthorizationHeader(tokenType, accessToken);
    const authRes: AuthResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.AUTH_AXA));
    const headers = this.addAuthorizationHeader( authRes.tokenType, authRes.accessToken);
    return this.http.put<boolean>(
      this.insuranceUpdatetPolicyHoderInfoUrl + '/' + policyId,
      policyUpdate, {headers}
    );
  }
  getInsurancePaymentHistoryList(request: InsuranceHistoryListRequest) {
    return this.http.post<InsuranceHistoryListRes>(
      this.insurancePaymentHistoryListUrl, request
    );
  }
  getInsurancePaymentHistoryListbyDate(request: InsuranceHistoryListRequest) {
    return this.http.post<InsuranceHistoryListRes>(
      this.insurancePaymentHistoryListByDateUrl, request
    );
  }
  getInsurancePaymentHistoryDetail(paymentId: string) {
    return this.http.get<FlocashPaymentInsurance>(
      this.insurancePaymentHistoryListUrl + '/' + paymentId
    );
  }


  deleteInsuranceRecord(id: string) {
    return this.http.delete<any>(`${this.insuranceDeleteUrl}/${id}`);
  }

  addAuthorizationHeader(tokenType: string, accessToken: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('authorization', `${tokenType} ${accessToken}`);
    return headers;
  }
}
