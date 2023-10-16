import * as InsuranceActions from "./insurance.actions";
import { SearchInsurancePackageReq } from "src/app/model/insurance/search-insurance-package.req";
import { InsurancePackageType } from "src/app/model/insurance/package-type/insurance.package";
import { QuoteResponse } from "src/app/model/insurance/quote/quote.response";
import { SearchQouteRequest } from "src/app/model/insurance/search-quote.request";
import { AuthResponse } from "src/app/model/insurance/get-token/auth.response";
import { UserInfoInsurance } from "src/app/model/insurance/user-info-insurance.req";
import { CardPaymentModel } from "src/app/model/insurance/card-payment.req";
import { FlocashPaymentInsurance } from "src/app/model/insurance/subscription-policy/response/flocash-payment.insurance";
import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { insuranceConstant } from "../insurance.constant";

export interface State {
  searchInsuranceForm: SearchInsurancePackageReq;
  searchInsurancePackageListResult: InsurancePackageType[];
  selectedPackage: InsurancePackageType;
  searchQuoteForm: SearchQouteRequest;
  axaAuth: AuthResponse;
  qouteResponse: QuoteResponse;
  subscriptionRequest: any;
  subscriptionResponse: FlocashPaymentInsurance;
  agentVcn: FlocashVCNRes;
  userInfoInsurance: UserInfoInsurance;
  cardPayment: CardPaymentModel;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchInsuranceForm: null,
  searchInsurancePackageListResult: [],
  selectedPackage: null,
  searchQuoteForm: null,
  axaAuth: null,
  qouteResponse: JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_RESPONSE)),
  subscriptionRequest: null,
  subscriptionResponse: null,
  agentVcn: null,
  userInfoInsurance: null,
  cardPayment: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function insuranceReducer(
  state: State = initialState,
  action: InsuranceActions.InsuranceActions
) {
  switch (action.type) {
    case InsuranceActions.SEARCH_INSURANCE_PACKAGE_LIST_START:
      return {
        ...state,
        searchInsuranceForm: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case InsuranceActions.SEARCH_INSURANCE_LIST_SUCCESS:
      return {
        ...state,
        searchInsurancePackageListResult: [...action.payload],
        qouteResponse: null,
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case InsuranceActions.SEARCH_INSURANCE_LIST_FAIL:
      return {
        ...state,
        searchInsurancePackageListResult: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case InsuranceActions.FETCH_INSURANCE_DETAIL_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case InsuranceActions.FETCH_INSURANCE_DETAIL_SUCCESS:
      return {
        ...state,
        selectedPackage: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case InsuranceActions.FETCH_INSURANCE_DETAIL_FAIL:
      return {
        ...state,
        selectedPackage: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case InsuranceActions.AUTH_AXA_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case InsuranceActions.AUTH_AXA_SUCCESS:
      return {
        ...state,
        axaAuth: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case InsuranceActions.AUTH_AXA_FAIL:
      return {
        ...state,
        axaAuth: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case InsuranceActions.QOUTE_LIST_START:
      return {
        ...state,
        searchQuoteForm: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case InsuranceActions.QOUTE_LIST_SUCCESS:
      return {
        ...state,
        qouteResponse: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case InsuranceActions.QOUTE_LIST_FAIL:
      return {
        ...state,
        qouteResponse: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case InsuranceActions.GET_VCN_START:
      return {
        ...state,
        // tourPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case InsuranceActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case InsuranceActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case InsuranceActions.SUBSCRIPTION_START:
      return {
        ...state,
        subscriptionRequest: Object.assign({}, action.payload),
        loading: true,
        failure: false,
      };
    case InsuranceActions.SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        subscriptionResponse: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case InsuranceActions.SUBSCRIPTION_FAIL:
      return {
        ...state,
        subscriptionResponse: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case InsuranceActions.SAVE_CART_INFO:
      return {
        ...state,
        userInfoInsurance: action.payload.customers,
        cardPayment: action.payload.cardPayment,
      };
    default:
      return state;
  }
}
