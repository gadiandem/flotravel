import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as PackagesActions from './special-packages.actions';
import {environment} from '../../../environments/environment';
import {FlocashVCNRes} from 'src/app/model/common/flocash-vcn-res';
import {appConstant, serviceName} from 'src/app/app.constant';
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
import {specialPackagesConstant} from '../special-packages.constant';
import {OrderPackageCreateRes} from 'src/app/model/packages/consumer/order-package-create-res';
import {PackageOptionalReq} from 'src/app/model/packages/consumer/package-optional-req';
import {PackageOptionalRes} from 'src/app/model/packages/consumer/package-optional-res';
import {packagesConstant} from '../../packages/packages.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { MetaData } from 'src/app/model/dashboard/hotel/metadata';
import { demoFlightData } from 'src/app/flight/flight.constant';

const packageShoppingUrl = environment.baseUrl + 'specialPackages/shopping';
const packageHotelDetailUrl = environment.baseUrl + 'specialPackages/hotelRoom';
const packageSupplementUrl = environment.baseUrl + 'specialPackages/supplement';
const packageTourUrl = environment.baseUrl + 'specialPackages/tour';
const packageTransferUrl = environment.baseUrl + 'specialPackages/transfer';
const packageOptionalUrl = environment.baseUrl + 'specialPackages/optional';
const packageSummaryUrl = environment.baseUrl + 'specialPackages/summary';

const packagesPaymentUrl = environment.baseUrl + 'specialPackages/packageOrder';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';

const handlePackageShoppingResult = (packagesRes: PackageShoppingRes[]) => {
  sessionStorage.setItem(specialPackagesConstant.PACKAGE_SHOPPING_RES, JSON.stringify(packagesRes));
  if (packagesRes.length > 0) {
  sessionStorage.setItem(specialPackagesConstant.SESSION_ID, packagesRes[0].sessionId);
  }
  return new PackagesActions.SearchPackagesListSuccess(packagesRes);
};

const handlePackageHotelDetail = (roomList: HotelPackageDetailRes[]) => {
  sessionStorage.setItem(
    specialPackagesConstant.HOTEL_ROOM_LIST,
    JSON.stringify(roomList)
  );
  return new PackagesActions.PackagesHotelDetailSuccess(roomList);
};

const handleSupplementResult = (supplementList: SupplementPackageRes[]) => {
  sessionStorage.setItem(
    specialPackagesConstant.SUPPLEMENT_LIST,
    JSON.stringify(supplementList)
  );
  return new PackagesActions.PackagesSupplementSuccess(supplementList);
};

const handleTourResult = (tourList: TourPackageRes[]) => {
  sessionStorage.setItem(specialPackagesConstant.TOUR_LIST, JSON.stringify(tourList));
  return new PackagesActions.PackagesTourSuccess(tourList);
};

const handleTransferResult = (transferList: TransferPackageRes[]) => {
  sessionStorage.setItem(
    specialPackagesConstant.TRANSFER_LIST,
    JSON.stringify(transferList)
  );
  return new PackagesActions.PackagesTransferSuccess(transferList);
};

const handleOptionalResult = (optionalRes: PackageOptionalRes) => {
  sessionStorage.setItem(
    specialPackagesConstant.PACKAGE_OPTIONAL,
    JSON.stringify(optionalRes)
  );
  return new PackagesActions.PackagesOptionalSuccess(optionalRes);
};


const handleSummaryResult = (summaryRes: SummaryPackageRes) => {
  sessionStorage.setItem(
    specialPackagesConstant.SUMMARY_RESULT,
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
    errorMessage = 'Server have some error! try again.';
  }
  if (errorRes.error != null) {
    errorMessage = (errorRes.error.message as string).split('-')[1];
  }
  return of(new PackagesActions.SearchPackagesListFail(errorMessage));
};

@Injectable({
  providedIn: 'root',
})

export class SpecialPackagesEffects {

  user: UserDetail;
  traceId: string;
  
  @Effect()
  packageShopping = this.actions$.pipe(
    ofType(PackagesActions.SEARCH_PACKAGESLIST_START),
    switchMap((actionData: PackagesActions.SearchPackagesListStart) => {
      const data: PackageShoppingReq  = Object.assign({}, actionData.payload.data);
      sessionStorage.setItem(
        specialPackagesConstant.PACKAGE_SHOPPING_REQ,
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
      return this.http
        .post<PackageShoppingRes[]>(packageShoppingUrl, data)
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
  packageHotelDetail = this.actions$.pipe(
    ofType(PackagesActions.PACKAGES_HOTEL_DETAIL_START),
    switchMap((actionData: PackagesActions.PackagesHotelDetailStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
      clientData.sessionId = sessionId;
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
      
      return this.http
        .post<HotelPackageDetailRes[]>(packageHotelDetailUrl, clientData)
        .pipe(
          map((res: HotelPackageDetailRes[]) => {
            return handlePackageHotelDetail(res);
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
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      const data: TourPackageReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      const data: TransferPackageReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      const data: PackageOptionalReq = Object.assign({}, actionData.payload.data);
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      return this.http.post<SummaryPackageRes>(packageSummaryUrl, data).pipe(
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
          null,
          null,
        );
        sessionStorage.setItem(
          specialPackagesConstant.PACKAGES_PAYMENT_REQ,
          JSON.stringify(paymentReq)
        );
      }

      const vcnRequest = new VcnRequest();
      vcnRequest.serviceName = serviceName.HOTEL_COLLECTION;
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
      vcnRequest.sessionId = sessionId;
      vcnRequest.accountId = clientData.accountBooking;
      vcnRequest.currency = clientData.currency;
      vcnRequest.price = +clientData.amount;
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
      // header
      const headers = new HttpHeaders()
        .set('environment', environment.paymentEnvironment);
      // .set('agent-id', agentId);
      return this.http.post<FlocashVCNRes>(requestVCNUrl, vcnRequest, {headers}).pipe(
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
      const sessionId = sessionStorage.getItem(specialPackagesConstant.SESSION_ID);
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
      return this.http
        .post<OrderPackageCreateRes>(packagesPaymentUrl, paymentReq)
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
