import { Action } from '@ngrx/store';

import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { ExtraDetailAvailabilityView } from 'src/app/model/thing-to-do/tour-detail/extra-detail-view';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { OtpClientRes } from 'src/app/model/common/otp-client-res';
import { ExtrasShoppingRes } from 'src/app/model/thing-to-do/tour-list/extras-shopping-res';
import { ExtraDetailRes } from 'src/app/model/thing-to-do/tour-detail/extra-detail-res';
import { ExtraDetailAvailabilityCheckRQ } from 'src/app/model/thing-to-do/availability-check/extra-detail-availability-check-req';
import { ExtraDetailAvailabilityCheckRS } from 'src/app/model/thing-to-do/availability-check/extra-detail-availability-check-res';

export const SEARCH_TOURLIST_START = '[Tour] SEARCH_TOURLIST_START';
export const SEARCH_TOURLIST_SUCCESS = '[Tour] SEARCH_TOURLIST_SUCCESS';
export const SEARCH_TOURLIST_FAIL = '[Tour] SEARCH_TOURLIST_FAIL';

export const FETCH_TOURDETAIL_START = '[Tour] FETCH_TOURDETAIL_START';
export const FETCH_TOURDETAIL_SUCCESS = '[Tour] FETCH_TOURDETAIL_SUCCESS';
export const FETCH_TOURDETAIL_FAIL = '[Tour] FETCH_TOURDETAIL_FAIL';

export const CHECK_AVAILABILITY_START = '[Tour] CHECK_AVAILABILITY_START';
export const CHECK_AVAILABILITY_SUCCESS = '[Tour] CHECK_AVAILABILITY_SUCCESS';
export const CHECK_AVAILABILITY_FAIL = '[Tour] CHECK_AVAILABILITY_FAIL';

export const SELECT_SCHEDULE = '[Tour] SELECT_SCHEDULE';

export const GET_VCN_START = '[Tour] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Tour] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Tour] GET_VCN_FAIL';

export const PAYMENT_TOUR_START = '[Tour] PAYMENT_TOUR_START';
export const PAYMENT_TOUR_SUCCESS = '[Tour] PAYMENT_TOUR_SUCCESS';
export const PAYMENT_TOUR_FAIL = '[Tour] PAYMENT_TOUR_FAIL';

export class SearchTourListStart implements Action {
  readonly type = SEARCH_TOURLIST_START;

  constructor(public payload: { data: TourShoppingRQ }) { }
}

export class SearchTourListSuccess implements Action {
  readonly type = SEARCH_TOURLIST_SUCCESS;

  constructor(public payload: ExtrasShoppingRes) { }
}

export class SearchTourListFail implements Action {
  readonly type = SEARCH_TOURLIST_FAIL;

  constructor(public payload: string) { }
}

export class FetchTourDetailStart implements Action {
  readonly type = FETCH_TOURDETAIL_START;

  constructor(public payload: { data: ExtrasPackage, startDate: string, endDate: string }) { }
}

export class FetchTourlDetailSuccess implements Action {
  readonly type = FETCH_TOURDETAIL_SUCCESS;

  constructor(public payload: ExtraDetailRes) { }
}

export class FetchTourListFail implements Action {
  readonly type = FETCH_TOURDETAIL_FAIL;

  constructor(public payload: string) { }
}
export class ChecAvailabilityStart implements Action {
  readonly type = CHECK_AVAILABILITY_START;

  constructor(public payload: { data: ExtraDetailAvailabilityCheckRQ }) { }
}

export class ChecAvailabilitySuccess implements Action {
  readonly type = CHECK_AVAILABILITY_SUCCESS;

  constructor(public payload: ExtraDetailAvailabilityCheckRS) { }
}

export class ChecAvailabilityFail implements Action {
  readonly type = CHECK_AVAILABILITY_FAIL;

  constructor(public payload: string) { }
}

export class SelectSchedule implements Action {
  readonly type = SELECT_SCHEDULE;

  constructor(public payload: Schedule ) { }
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: { data: {
    cardPayment: CardPaymentModel;
    vcnPayment: boolean;
    currency: string;
    amount: number;
    customerRoomInfos: UserInfoModel[];
    tourBookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    tour: ExtrasPackage;
    schedule: ExtraDetailAvailabilityView;
    countryCode: string;
  } }) { }
}
export class GetVcnSuccess implements Action {
  readonly type = GET_VCN_SUCCESS;

  constructor(public payload: FlocashVCNRes) { }
}

export class GetVcnFail implements Action {
  readonly type = GET_VCN_FAIL;

  constructor(public payload: string) { }
}
export class PaymentTourStart implements Action {
  readonly type = PAYMENT_TOUR_START;

  constructor(public payload: { data: PaymentTourReq }) { }
}

export class PaymentTourSuccess implements Action {
  readonly type = PAYMENT_TOUR_SUCCESS;

  constructor(public payload: PaymentTour) { }
}

export class PaymentTourFail implements Action {
  readonly type = PAYMENT_TOUR_FAIL;

  constructor(public payload: string) { }
}

export type TourActions =
  | SearchTourListStart
  | SearchTourListSuccess
  | SearchTourListFail
  | FetchTourDetailStart
  | FetchTourlDetailSuccess
  | FetchTourListFail
  | ChecAvailabilityStart
  | ChecAvailabilitySuccess
  | ChecAvailabilityFail
  | SelectSchedule
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | PaymentTourStart
  | PaymentTourSuccess
  | PaymentTourFail;;
