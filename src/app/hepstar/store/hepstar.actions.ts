import { Action } from '@ngrx/store';

import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { UserInfo } from 'src/app/model/common/user-info';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';

export const SEARCH_HEPSTAR_START = '[Hepstar] SEARCH_HEPSTAR_START';
export const SEARCH_HEPSTAR_SUCCESS = '[Hepstar] SEARCH_HEPSTAR_SUCCESS';
export const SEARCH_HEPSTAR_FAIL = '[Hepstar] SEARCH_HEPSTAR_FAIL';

export const GET_VCN_START = '[Hepstar] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Hepstar] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Hepstar] GET_VCN_FAIL';

export const PAYMENT_HEPSTAR_START = '[Hepstar] PAYMENT_HEPSTAR_START';
export const PAYMENT_HEPSTAR_SUCCESS = '[Hepstar] PAYMENT_HEPSTAR_SUCCESS';
export const PAYMENT_HEPSTAR_FAIL = '[Hepstar] PAYMENT_HEPSTAR_FAIL';

export class SearchHepstarStart implements Action {
  readonly type = SEARCH_HEPSTAR_START;

  constructor(public payload: { data: HepstarSearchFormData }) { }
}

export class SearchHepstarSuccess implements Action {
  readonly type = SEARCH_HEPSTAR_SUCCESS;

  constructor(public payload: SearchHepstarRes) { }
}

export class SearchHepstarFail implements Action {
  readonly type = SEARCH_HEPSTAR_FAIL;

  constructor(public payload: string) { }
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: { data: {
    seletecProduct: any;
    cardPayment: CardPaymentModel;
    vcnPayment: boolean;
    merchantPayment: MerchantPayment,
    currency: string;
    amount: number;
    customerInfo: UserInfo;
    HepstarBookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
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
export class PaymentHepstarStart implements Action {
  readonly type = PAYMENT_HEPSTAR_START;

  constructor(public payload: { data: any }) { }
}

export class PaymentHepstarSuccess implements Action {
  readonly type = PAYMENT_HEPSTAR_SUCCESS;

  constructor(public payload: any) { }
}

export class PaymentHepstarFail implements Action {
  readonly type = PAYMENT_HEPSTAR_FAIL;

  constructor(public payload: string) { }
}

export type HepstarActions =
  | SearchHepstarStart
  | SearchHepstarSuccess
  | SearchHepstarFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | PaymentHepstarStart
  | PaymentHepstarSuccess
  | PaymentHepstarFail;;
