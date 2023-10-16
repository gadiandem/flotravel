import { Action } from "@ngrx/store";

import { UserInfoModel } from "src/app/model/hotel/hotel-payment/user-info.model";
import { CardPaymentModel } from "src/app/model/hotel/hotel-payment/card-payment.model";
import { SearchInsurancePackageReq } from "src/app/model/insurance/search-insurance-package.req";
import { InsurancePackageType } from "src/app/model/insurance/package-type/insurance.package";
import { QuoteResponse } from "src/app/model/insurance/quote/quote.response";
import { SearchQouteRequest } from "src/app/model/insurance/search-quote.request";
import { AuthResponse } from "src/app/model/insurance/get-token/auth.response";
import { UserInfoInsurance } from "src/app/model/insurance/user-info-insurance.req";
import { Product } from "src/app/model/insurance/quote/product";
import { FlocashPaymentInsurance } from "src/app/model/insurance/subscription-policy/response/flocash-payment.insurance";
import { BookingContact } from "src/app/model/common/booking-contact";
import { UserInfo } from "src/app/model/common/user-info";
import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { SubscribePolicyRequest } from "src/app/model/insurance/subscription-policy/subscription-policy.request";
import { MerchantPayment } from "src/app/model/auth/user/merchant-payment";

export const SEARCH_INSURANCE_PACKAGE_LIST_START =
  "[Insurance] SEARCH_INSURANCE_PACKAGE_LIST_START";
export const SEARCH_INSURANCE_LIST_SUCCESS =
  "[Insurance] SEARCH_INSURANCE_LIST_SUCCESS";
export const SEARCH_INSURANCE_LIST_FAIL =
  "[Insurance] SEARCH_INSURANCE_LIST_FAIL";

export const FETCH_INSURANCE_DETAIL_START =
  "[Insurance] FETCH_INSURANCE_DETAIL_START";
export const FETCH_INSURANCE_DETAIL_SUCCESS =
  "[Insurance] FETCH_HOTELDETAIL_SUCCESS";
export const FETCH_INSURANCE_DETAIL_FAIL = "[Insurance] FETCH_HOTELDETAIL_FAIL";

export const AUTH_AXA_START = "[Insurance] AUTH_AXA_START";
export const AUTH_AXA_SUCCESS = "[Insurance] AUTH_AXA_SUCCESS";
export const AUTH_AXA_FAIL = "[Insurance] AUTH_AXA_FAIL";

export const QOUTE_LIST_START = "[Insurance] QOUTE_LIST_START";
export const QOUTE_LIST_SUCCESS = "[Insurance] QOUTE_LIST_SUCCESS";
export const QOUTE_LIST_FAIL = "[Insurance] QOUTE_LIST_FAIL";

export const GET_VCN_START = '[Insurance] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Insurance] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Insurance] GET_VCN_FAIL';

export const SUBSCRIPTION_START = "[Insurance] SUBSCRIPTION_START";
export const SUBSCRIPTION_SUCCESS = "[Insurance] SUBSCRIPTION_SUCCESS";
export const SUBSCRIPTION_FAIL = "[Insurance] SUBSCRIPTION_FAIL";

export const SAVE_CART_INFO = "[Insurance] SAVE_CART_INFO";

// search insurance list
export class SearchInsurancePackageListStart implements Action {
  readonly type = SEARCH_INSURANCE_PACKAGE_LIST_START;

  constructor(public payload: { data: SearchInsurancePackageReq }) {}
}

export class SearchInsuranceListSuccess implements Action {
  readonly type = SEARCH_INSURANCE_LIST_SUCCESS;

  constructor(public payload: InsurancePackageType[]) {}
}

export class SearchInsuranceListFail implements Action {
  readonly type = SEARCH_INSURANCE_LIST_FAIL;

  constructor(public payload: string) {}
}

// insurance detail
export class FetchInsuranceDetailStart implements Action {
  readonly type = FETCH_INSURANCE_DETAIL_START;

  constructor(public payload: { packageId: string , data: SearchQouteRequest }) {}
}

export class FetchInsuranceDetailSuccess implements Action {
  readonly type = FETCH_INSURANCE_DETAIL_SUCCESS;

  constructor(public payload: InsurancePackageType) {}
}

export class FetchInsuranceListFail implements Action {
  readonly type = FETCH_INSURANCE_DETAIL_FAIL;

  constructor(public payload: string) {}
}

// auth AXAinsurance
export class AuthAxaStart implements Action {
  readonly type = AUTH_AXA_START;

  constructor(public payload: { data: string }) {}
}

export class AuthAxaSuccess implements Action {
  readonly type = AUTH_AXA_SUCCESS;

  constructor(public payload: AuthResponse) {}
}

export class AuthAxaFail implements Action {
  readonly type = AUTH_AXA_FAIL;

  constructor(public payload: string) {}
}

// quote search
export class QouteListStart implements Action {
  readonly type = QOUTE_LIST_START;

  constructor(public payload: { data: SearchQouteRequest}) {}
}

export class QouteListSuccess implements Action {
  readonly type = QOUTE_LIST_SUCCESS;

  constructor(public payload: QuoteResponse) {}
}

export class QouteListFail implements Action {
  readonly type = QOUTE_LIST_FAIL;

  constructor(public payload: string) {}
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: { data: {
      searchQuoteForm: SearchQouteRequest;
      vcnPayment: boolean;
      merchantPayment: MerchantPayment,
      cardPayment: CardPaymentModel;
      customerInfos: UserInfo[];
      selectedQuoteProduct: Product;
      bookingContact: BookingContact;
      currency: string;
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

// subscription
export class SubscriptionStart implements Action {
  readonly type = SUBSCRIPTION_START;

  constructor(
    public payload: {
      data: SubscribePolicyRequest
    }
  ) {}
}

export class SubscriptionSuccess implements Action {
  readonly type = SUBSCRIPTION_SUCCESS;

  constructor(public payload: FlocashPaymentInsurance) {}
}

export class SubscriptionFail implements Action {
  readonly type = SUBSCRIPTION_FAIL;

  constructor(public payload: string) {}
}

export class SaveCartInfo implements Action {
  readonly type = SAVE_CART_INFO;

  constructor(
    public payload: {
      customers: UserInfoInsurance;
      cardPayment: CardPaymentModel;
    }
  ) {}
}
export type InsuranceActions =
  | SearchInsurancePackageListStart
  | SearchInsuranceListSuccess
  | SearchInsuranceListFail
  | FetchInsuranceDetailStart
  | FetchInsuranceDetailSuccess
  | FetchInsuranceListFail
  | AuthAxaStart
  | AuthAxaSuccess
  | AuthAxaFail
  | QouteListStart
  | QouteListSuccess
  | QouteListFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | SubscriptionStart
  | SubscriptionSuccess
  | SubscriptionFail
  | SaveCartInfo;
