import { Action } from '@ngrx/store';

import {SearchGcaForm} from '../../model/gca/shopping/request/search-gca-form';
import {GcaListRes} from '../../model/gca/shopping/response/gca-list-res';
import {GcaQuoteReq} from '../../model/gca/quote/request/gca-quote-req';
import {QuoteCreatedRes} from '../../model/gca/quote/response/quote-created-res';
import { PaymentInfoReq } from 'src/app/model/gca/payment-info/payment-info-req';
import { PaymentBookingResult } from 'src/app/model/gca/payment-booking-result/payment-booking-result';
import {CardPaymentModel} from '../../model/thing-to-do/tour-payment/card-payment-model';
import {MerchantPayment} from '../../model/auth/user/merchant-payment';
import {UserInfo} from '../../model/common/user-info';
import {BookingContact} from '../../model/common/booking-contact';
import {FlocashVCNRes} from '../../model/common/flocash-vcn-res';

export const SEARCH_GCA_START = '[Gca] SEARCH_GCA_START';
export const SEARCH_GCA_SUCCESS = '[Gca] SEARCH_GCA_SUCCESS';
export const SEARCH_GCA_FAIL = '[Gca] SEARCH_GCA_FAIL';

export const CREATE_GCA_QUOTE_START = '[Gca] CREATE_GCA_QUOTE_START';
export const CREATE_GCA_QUOTE_SUCCESS = '[Gca] CREATE_GCA_QUOTE_SUCCESS';
export const CREATE_GCA_QUOTE_FAIL = '[Gca] CREATE_GCA_QUOTE_FAIL';

export const PAYMENT_GCA_START = '[Gca] PAYMENT_GCA_START';
export const PAYMENT_GCA_SUCCESS = '[Gca] PAYMENT_GCA_SUCCESS';
export const PAYMENT_GCA_FAIL = '[Gca] PAYMENT_GCA_FAIL';

export const GET_VCN_START = '[Gca] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Gca] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Gca] GET_VCN_FAIL';

export class SearchGcaStart implements Action {
  readonly type = SEARCH_GCA_START;

  constructor(public payload: { data: SearchGcaForm }) { }
}

export class SearchGcaSuccess implements Action {
  readonly type = SEARCH_GCA_SUCCESS;

  constructor(public payload: GcaListRes) { }
}

export class SearchGcaFail implements Action {
  readonly type = SEARCH_GCA_FAIL;

  constructor(public payload: string) { }
}

export class CreateGcaQuoteStart implements Action {
  readonly type = CREATE_GCA_QUOTE_START;

  constructor(public payload: { data: GcaQuoteReq }) { }
}

export class CreateGcaQuoteSuccess implements Action {
  readonly type = CREATE_GCA_QUOTE_SUCCESS;

  constructor(public payload: QuoteCreatedRes) { }
}

export class CreateGcaQuoteFail implements Action {
  readonly type = CREATE_GCA_QUOTE_FAIL;

  constructor(public payload: string) { }
}

export class PaymentGcaStart implements Action {
  readonly type = PAYMENT_GCA_START;

  constructor(public payload: { data: PaymentInfoReq }) { }
}

export class PaymentGcaSuccess implements Action {
  readonly type = PAYMENT_GCA_SUCCESS;

  constructor(public payload: PaymentBookingResult) { }
}

export class PaymentGcaFail implements Action {
  readonly type = PAYMENT_GCA_FAIL;

  constructor(public payload: string) { }
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: { data: {
      bookingId: string;
      cardPayment: CardPaymentModel;
      vcnPayment: boolean;
      merchantPayment: MerchantPayment,
      currency: string;
      amount: number;
      customerInfo: UserInfo;
      gcaBookingContact: BookingContact;
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

export type GcaActions =
  | SearchGcaStart
  | SearchGcaSuccess
  | SearchGcaFail
  | CreateGcaQuoteStart
  | CreateGcaQuoteSuccess
  | CreateGcaQuoteFail
  | PaymentGcaStart
  | PaymentGcaSuccess
  | PaymentGcaFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
