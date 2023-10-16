import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as TourActions from './thing-to-do.actions';
import { environment } from '../../../environments/environment';
import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { thingToDoConstant } from '../thing-to-do.constant';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { appConstant } from 'src/app/app.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { VcnRequest } from 'src/app/model/flocash/response/vcn-request';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { ExtrasShoppingRes } from 'src/app/model/thing-to-do/tour-list/extras-shopping-res';
import { ExtraDetailReq } from 'src/app/model/thing-to-do/tour-detail/extra-detail-req';
import { ExtraDetailRes } from 'src/app/model/thing-to-do/tour-detail/extra-detail-res';
import { ExtraDetailAvailabilityCheckRS } from 'src/app/model/thing-to-do/availability-check/extra-detail-availability-check-res';

const tourListUrl = environment.baseUrl + 'extras/shopping';
const fetchTourDetailUrl = environment.baseUrl + 'extras/detail';
const checkExtraAvailabilitylUrl = environment.baseUrl + 'extras/checkAvailability';

const tourPaymentUrl = environment.baseUrl + 'extras/booking';
const requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';
const updateOtpUrl = environment.baseUrl + 'flocash/otp';

const handleTourResult = (extrasPackages: ExtrasShoppingRes) => {
  sessionStorage.setItem(
    thingToDoConstant.TOUR_LIST_RESULT,
    JSON.stringify(extrasPackages)
  );
  return new TourActions.SearchTourListSuccess(extrasPackages);
};

const handleTourDetail = (extraDetailRes: ExtraDetailRes) => {
  sessionStorage.setItem(
    thingToDoConstant.SCHEDULER_LIST,
    JSON.stringify(extraDetailRes)
  );
  return new TourActions.FetchTourlDetailSuccess(extraDetailRes);
};

const handleExtraAvailability = (extraAvailability: ExtraDetailAvailabilityCheckRS) => {
  sessionStorage.setItem(
    thingToDoConstant.AVAILABILITY_CHECK_RES,
    JSON.stringify(extraAvailability)
  );
  return new TourActions.ChecAvailabilitySuccess(extraAvailability);
};

const handleTourPayment = (paymentRes: PaymentTour) => {
  return new TourActions.PaymentTourSuccess(paymentRes);
};

const handleRequestVCNSuccess = (
  store: Store<fromApp.AppState>,
  vcnRes: FlocashVCNRes
) => {
  localStorage.setItem(appConstant.AGENT_VCN, JSON.stringify(vcnRes));
  return new TourActions.GetVcnSuccess(vcnRes);
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
  return of(new TourActions.SearchTourListFail(errorMessage));
};
@Injectable()
export class ThingToDoEffects {
  @Effect()
  fetchTourList = this.actions$.pipe(
    ofType(TourActions.SEARCH_TOURLIST_START),
    switchMap((actionData: TourActions.SearchTourListStart) => {
      const data: TourShoppingRQ = actionData.payload.data;
      return this.http.post<ExtrasShoppingRes>(tourListUrl, data).pipe(
        map((res: ExtrasShoppingRes) => {
          return handleTourResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  fetchTourDetail = this.actions$.pipe(
    ofType(TourActions.FETCH_TOURDETAIL_START),
    switchMap((actionData: TourActions.FetchTourDetailStart) => {
      const clientData = actionData.payload;
      const extraPackageId = clientData.data.id;
      const extraDetailReq = new ExtraDetailReq();
      extraDetailReq.extraPackageId = extraPackageId;
      extraDetailReq.startDate = clientData.startDate;
      extraDetailReq.endDate = clientData.endDate;

      return this.http.post<ExtraDetailRes>(fetchTourDetailUrl, extraDetailReq).pipe(
        map((res: ExtraDetailRes) => {
          if (res != undefined) {
            return handleTourDetail(res);
          }
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  checkExtraAvailability = this.actions$.pipe(
    ofType(TourActions.CHECK_AVAILABILITY_START),
    switchMap((actionData: TourActions.ChecAvailabilityStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      return this.http.post<ExtraDetailAvailabilityCheckRS>(checkExtraAvailabilitylUrl, clientData).pipe(
        map((res: ExtraDetailAvailabilityCheckRS) => {
          if (res != undefined) {
            return handleExtraAvailability(res);
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
    ofType(TourActions.GET_VCN_START),
    switchMap((actionData: TourActions.GetVcnStart) => {
      const clientData = Object.assign({}, actionData.payload.data);
      if (clientData.vcnPayment) {
        const paymentReq = this.paymentService.buildTourPaymentRequest(
          clientData.cardPayment,
          clientData.vcnPayment,
          clientData.currency,
          clientData.amount,
          clientData.customerRoomInfos,
          clientData.tourBookingContact,
          clientData.accountBooking,
          clientData.bookingForUser,
          clientData.userIsBooking,
          clientData.tour,
          clientData.schedule,
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
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  tourPayment = this.actions$.pipe(
    ofType(TourActions.PAYMENT_TOUR_START),
    switchMap((actionData: TourActions.PaymentTourStart) => {
      const paymentReq = actionData.payload.data;

      return this.http.post<PaymentTour>(tourPaymentUrl, paymentReq).pipe(
        map((res: PaymentTour) => {
          if (res !== null) {
            return handleTourPayment(res);
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
  ) {}
}
