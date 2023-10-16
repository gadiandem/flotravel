import { Action } from '@ngrx/store';

import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { ExtraDetailAvailabilityView } from 'src/app/model/thing-to-do/tour-detail/extra-detail-view';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { TraceMeFinaliseAndBookingReq } from 'src/app/model/traceme/finalise/traceme-finalise-booking';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { UserInfo } from 'src/app/model/common/user-info';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';

export const SEARCH_TRACEME_START = '[Traceme] SEARCH_TRACEME_START';
export const SEARCH_TRACEME_SUCCESS = '[Traceme] SEARCH_TRACEME_SUCCESS';
export const SEARCH_TRACEME_FAIL = '[Traceme] SEARCH_TRACEME_FAIL';

export const GET_VCN_START = '[Traceme] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Traceme] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Traceme] GET_VCN_FAIL';

export const PAYMENT_TRACEME_START = '[Traceme] PAYMENT_TRACEME_START';
export const PAYMENT_TRACEME_SUCCESS = '[Traceme] PAYMENT_TRACEME_SUCCESS';
export const PAYMENT_TRACEME_FAIL = '[Traceme] PAYMENT_TRACEME_FAIL';
export class SearchTracemeStart implements Action {
  readonly type = SEARCH_TRACEME_START;

  constructor(public payload: { data: TraceMeShoppingReq }) { }
}

export class SearchTracemeSuccess implements Action {
  readonly type = SEARCH_TRACEME_SUCCESS;

  constructor(public payload: TraceMeShoppingRes) { }
}

export class SearchTracemeFail implements Action {
  readonly type = SEARCH_TRACEME_FAIL;

  constructor(public payload: string) { }
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: {
    tracemeQuote: TraceMeData;
    cardPayment: CardPaymentModel;
    vcnPayment: boolean;
    merchantPayment: MerchantPayment,
    currency: string;
    amount: number;
    customerInfo: UserInfo;
    tracemeBookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    countryCode: string
  }) { }
}
export class GetVcnSuccess implements Action {
  readonly type = GET_VCN_SUCCESS;

  constructor(public payload: FlocashVCNRes) { }
}

export class GetVcnFail implements Action {
  readonly type = GET_VCN_FAIL;

  constructor(public payload: string) { }
}
export class PaymentTracemeStart implements Action {
  readonly type = PAYMENT_TRACEME_START;

  constructor(public payload: { data: TraceMeFinaliseAndBookingReq }) { }
}

export class PaymentTracemeSuccess implements Action {
  readonly type = PAYMENT_TRACEME_SUCCESS;

  constructor(public payload: FlocashPaymentTraceMe) { }
}

export class PaymentTracemeFail implements Action {
  readonly type = PAYMENT_TRACEME_FAIL;

  constructor(public payload: string) { }
}

export type TracemeActions =
  | SearchTracemeStart
  | SearchTracemeSuccess
  | SearchTracemeFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | PaymentTracemeStart
  | PaymentTracemeSuccess
  | PaymentTracemeFail;;
