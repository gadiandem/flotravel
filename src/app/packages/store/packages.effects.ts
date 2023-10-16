import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {switchMap, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as PackagesActions from './packages.actions';
import {environment} from '../../../environments/environment';
import {FlocashVCNRes} from 'src/app/model/common/flocash-vcn-res';
import {appConstant} from 'src/app/app.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {VcnRequest} from 'src/app/model/flocash/response/vcn-request';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {PackageShoppingReq} from 'src/app/model/packages/consumer/package-shopping-req';
import {PackageShoppingRes} from 'src/app/model/packages/consumer/package-shopping-res';
import {HotelPackageDetailRes} from 'src/app/model/packages/consumer/hotel-package-detail-res';
import {SupplementPackageReq} from 'src/app/model/packages/consumer/supplement-package-req';
import {SupplementPackageRes} from 'src/app/model/packages/consumer/supplement-package-res';
import {TourPackageReq} from 'src/app/model/packages/consumer/tour-package-req';
import {TourPackageRes} from 'src/app/model/packages/consumer/tour-package-res';
import {TransferPackageReq} from 'src/app/model/packages/consumer/transfer-pacakge-req';
import {TransferPackageRes} from 'src/app/model/packages/consumer/transfer-pacakge-res';
import {SummaryPackageReq} from 'src/app/model/packages/consumer/summary-package-req';
import {SummaryPackageRes} from 'src/app/model/packages/consumer/summary-package-res';
import {packagesConstant} from '../packages.constant';
import {OrderPackageCreateRes} from 'src/app/model/packages/consumer/order-package-create-res';
import {PackageOptionalReq} from 'src/app/model/packages/consumer/package-optional-req';
import {PackageOptionalRes} from 'src/app/model/packages/consumer/package-optional-res';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {insuranceConstant} from 'src/app/insurance/insurance.constant';
import { MetaData } from 'src/app/model/dashboard/hotel/metadata';
import { demoFlightData } from 'src/app/flight/flight.constant';

const packageShoppingUrl = environment.baseUrl + 'packages/shopping';
const packageShoppingForImageUrl = environment.baseUrl + 'packages/shopping/forImage';
const packageHotelDetailUrl = environment.baseUrl + 'packages/hotelRoom';
const packageSupplementUrl = environment.baseUrl + 'packages/supplement';
const packageTourUrl = environment.baseUrl + 'packages/tour';
const packageTransferUrl = environment.baseUrl + 'packages/transfer';
const packageOptionalUrl = environment.baseUrl + 'packages/optional';
const packageSummaryUrl = environment.baseUrl + 'packages/summary';

const packagesPaymentUrl = environment.baseUrl + 'packages/packageOrder';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';

const handlePackageShoppingResult = (packagesRes: PackageShoppingRes[]) => {
  sessionStorage.setItem(
    packagesConstant.PACKAGE_SHOPPING_RES,
    JSON.stringify(packagesRes)
  );
  if (packagesRes.length > 0) {
    sessionStorage.setItem(packagesConstant.SESSION_ID, packagesRes[0].sessionId);
  }
  return new PackagesActions.SearchhPackagesListSuccess(packagesRes);
};

const handlePackageShoppingForImageResult = (packagesRes: PackageShoppingRes[]) => {
  sessionStorage.setItem(
    packagesConstant.PACKAGE_SHOPPING_FOR_IMAGE_RES,
    JSON.stringify(packagesRes)
  );
  return new PackagesActions.PackageListForImageSuccess(packagesRes);
};

const handlePackageHotelShoppingForImageResult = (packageHotelRes: PackageShoppingRes[]) => {
  sessionStorage.setItem(
    packagesConstant.PACKAGE_HOTEL_SHOPPING_FOR_IMAGE_RES,
    JSON.stringify(packageHotelRes)
  );
  sessionStorage.setItem(packagesConstant.SESSION_ID, packageHotelRes[0].sessionId);
  return new PackagesActions.PackageHotelForImageSuccess(packageHotelRes);
};

const handlePackageHotelDetail = (roomList: HotelPackageDetailRes[]) => {
  sessionStorage.setItem(
    packagesConstant.HOTEL_ROOM_LIST,
    JSON.stringify(roomList)
  );
  return new PackagesActions.PackagesHotelDetailSuccess(roomList);
};

const handleSupplementResult = (supplementList: SupplementPackageRes[]) => {
  sessionStorage.setItem(
    packagesConstant.SUPPLEMENT_LIST,
    JSON.stringify(supplementList)
  );
  return new PackagesActions.PackagesSupplementSuccess(supplementList);
};

const handleTourResult = (tourList: TourPackageRes[]) => {
  sessionStorage.setItem(packagesConstant.TOUR_LIST, JSON.stringify(tourList));
  return new PackagesActions.PackagesTourSuccess(tourList);
};

const handleTransferResult = (transferList: TransferPackageRes[]) => {
  sessionStorage.setItem(
    packagesConstant.TRANSFER_LIST,
    JSON.stringify(transferList)
  );
  return new PackagesActions.PackagesTransferSuccess(transferList);
};

const handleOptionalResult = (optionalRes: PackageOptionalRes) => {
  sessionStorage.setItem(
    packagesConstant.PACKAGE_OPTIONAL,
    JSON.stringify(optionalRes)
  );
  return new PackagesActions.PackagesOptionalSuccess(optionalRes);
};


const handleSummaryResult = (summaryRes: SummaryPackageRes) => {
  sessionStorage.setItem(
    packagesConstant.SUMMARY_RESULT,
    JSON.stringify(summaryRes)
  );
  return new PackagesActions.PackagesSummarySuccess(summaryRes);
};

const handlePackagesPayment = (paymentRes: OrderPackageCreateRes) => {
  return new PackagesActions.PaymentPackagesSuccess(paymentRes);
};

const handleRequestVCNSuccess = (
  store: Store<fromApp.AppState>,
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new PackagesActions.GetVcnSuccess(vcnRes);
};

// const handleUpdateOtpSuccess = (
//   store: Store<fromApp.AppState>,
//   otpRes: OtpClientRes
// ) => {
//   localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(otpRes));
//   const tourPaymentReq = JSON.parse(
//     sessionStorage.getItem(thingToDoConstant.TOUR_PAYMENT_REQ)
//   );
//   return new TourActions.UpdateOtpSuccess(tourPaymentReq);
// };

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred! try again.';
  if (errorRes.status === 500) {
    errorMessage = 'Server error occurred ! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new PackagesActions.SearchPackagesListFail(errorMessage));
};

@Injectable({
  providedIn: 'root',
})
export class PackagesEffects {

  user: UserDetail;
  traceId: string;

  @Effect()
  packageShopping = this.actions$.pipe(
    ofType(PackagesActions.SEARCH_PACKAGESLIST_START),
    switchMap((actionData: PackagesActions.SearchPackagesListStart) => {
      const data: PackageShoppingReq = Object.assign({}, actionData.payload.data);
      sessionStorage.setItem(
        packagesConstant.PACKAGE_SHOPPING_REQ,
        JSON.stringify(data)
      );
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      const metadata = new MetaData();
      metadata.currency = appConstant.CURRENCY;
      metadata.locale = '';
      if (this.user) {
          metadata.user = this.user.email;
      }
      data.metadata = metadata;
      let headers = new HttpHeaders();
      if (this.user) {
        headers = headers.set('user-id', this.user.id);
      }
      return this.http
        .post<PackageShoppingRes[]>(packageShoppingUrl, data, {headers})
        .pipe(
          map((res: PackageShoppingRes[]) => {
            return handlePackageShoppingResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageShoppingForImage = this.actions$.pipe(
    ofType(PackagesActions.PACKAGE_LIST_FOR_IMAGE_START),
    switchMap((actionData: PackagesActions.PackageListForImageStart) => {
      const data = actionData.payload;
      const params = new HttpParams()
        .set('filter', data.filter)
        .set('dataFilter', data.dataFilter);
      return this.http
        .get<PackageShoppingRes[]>(packageShoppingForImageUrl, {params})
        .pipe(
          map((res: PackageShoppingRes[]) => {
            return handlePackageShoppingForImageResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageHotelShoppingForImage = this.actions$.pipe(
    ofType(PackagesActions.PACKAGE_HOTEL_FOR_IMAGE_START),
    switchMap((actionData: PackagesActions.PackageHotelForImageStart) => {
      const data = actionData.payload;
      const params = new HttpParams()
        .set('filter', data.filter)
        .set('dataFilter', data.dataFilter);
      return this.http
        .get<PackageShoppingRes[]>(packageShoppingForImageUrl, {params})
        .pipe(
          map((res: PackageShoppingRes[]) => {
            return handlePackageHotelShoppingForImageResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageHotelDetail = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_HOTEL_DETAIL_START),
    switchMap((actionData: PackagesActions.PackagesHotelDetailStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(packagesConstant.SESSION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      clientData.metadata = metadata;
      clientData.sessionId = sessionId;
      let headers = new HttpHeaders();
      if (this.user) {
        headers = headers.set('user-id', this.user.id);
      }
      return this.http
        .post<HotelPackageDetailRes[]>(packageHotelDetailUrl, clientData, {headers})
        .pipe(
          map((res: HotelPackageDetailRes[]) => {
            if (res.length > 0) {
              return handlePackageHotelDetail(res);
            }
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageSupplement = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_SUPPLEMENT_START),
    switchMap((actionData: PackagesActions.PackagesSupplementStart) => {
      const data: SupplementPackageReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(packagesConstant.SESSION_ID);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      data.metadata = metadata;
      data.sessionId = sessionId;
      return this.http
        .post<SupplementPackageRes[]>(packageSupplementUrl, data)
        .pipe(
          map((res: SupplementPackageRes[]) => {
            return handleSupplementResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageTour = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_TOUR_START),
    switchMap((actionData: PackagesActions.PackagesTourStart) => {
      const data: TourPackageReq = Object.assign({},actionData.payload.data);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      data.metadata = metadata;
      return this.http.post<TourPackageRes[]>(packageTourUrl, data).pipe(
        map((res: TourPackageRes[]) => {
          return handleTourResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  packageTransfer = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_TRANSFER_START),
    switchMap((actionData: PackagesActions.PackagesTransferStart) => {
      const data: TransferPackageReq = Object.assign({},actionData.payload.data);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      data.metadata = metadata;
      return this.http
        .post<TransferPackageRes[]>(packageTransferUrl, data)
        .pipe(
          map((res: TransferPackageRes[]) => {
            return handleTransferResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageOptional = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_OPTIONAL_START),
    switchMap((actionData: PackagesActions.PackagesOptionalStart) => {
      const data: PackageOptionalReq = Object.assign({},actionData.payload.data);
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      data.metadata = metadata;
      return this.http
        .post<PackageOptionalRes>(packageOptionalUrl, data)
        .pipe(
          map((res: PackageOptionalRes) => {
            return handleOptionalResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  packageSummary = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_SUMMARY_START),
    switchMap((actionData: PackagesActions.PackagesSummaryStart) => {
      const data: SummaryPackageReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(packagesConstant.SESSION_ID);
      data.sessionId = sessionId;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      data.metadata = metadata;
      this.store.select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
          this.user = user;
        });
      let headers = new HttpHeaders();
      if (this.user) {
        headers = headers.set('user-id', this.user.id);
      }
      return this.http.post<SummaryPackageRes>(packageSummaryUrl, data, {headers}).pipe(
        map((res: SummaryPackageRes) => {
          return handleSummaryResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  requestVcn = this.actions$.pipe(
    ofType(PackagesActions.GET_VCN_START),
    switchMap((actionData: PackagesActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildPackagesPaymentRequest(
          clientData.cardPayment,
          clientData.vcnPayment,
          clientData.merchantPayment,
          clientData.currency,
          clientData.customerRoomInfos,
          clientData.tourBookingContact,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking,
          clientData.selectedPackage,
          clientData.summary,
          clientData.countryName,
          clientData.countryCode,
          clientData.totalTripPrice,
          JSON.parse(sessionStorage.getItem(insuranceConstant.SUBSCRIBE_POLICY_DATA))
        );
        sessionStorage.setItem(
          packagesConstant.PACKAGES_PAYMENT_REQ,
          JSON.stringify(paymentReq)
        );
      }

      const vcnRequest = new VcnRequest();
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = clientData.totalTripPrice;
      vcnRequest.merchantPayment = clientData.merchantPayment;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = clientData.currency;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      vcnRequest.metadata = metadata;
      sessionStorage.removeItem(appConstant.OTP_ERROR_MESSAGE);

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
  packagePayment = this.actions$.pipe(
    ofType(PackagesActions.PAYMENT_PACKAGES_START),
    switchMap((actionData: PackagesActions.PaymentPackagesStart) => {
      const paymentReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(packagesConstant.SESSION_ID);
      paymentReq.sessionId = sessionId;
      this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
      this.traceId = sessionStorage.getItem(appConstant.TRANSACTION_ID);
      const metadata = new MetaData();
      metadata.currency = demoFlightData.CURRENCY;
      metadata.locale = '';
      if (this.user) {
        metadata.user = this.user.email;
      }
      if (this.traceId) {
        metadata.traceId = this.traceId;
      }
      paymentReq.metadata = metadata;
      // header
      let headers = new HttpHeaders();
      headers = headers.set('environment', environment.paymentEnvironment).set('user-id', this.user.id);
      // .set('agent-id', agentId);
      return this.http
        .post<OrderPackageCreateRes>(packagesPaymentUrl, paymentReq, {headers})
        .pipe(
          map((res: OrderPackageCreateRes) => {
            if (res !== null) {
              return handlePackagesPayment(res);
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
