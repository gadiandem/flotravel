import * as GcaActions from "./gca.actions"
import { SearchGcaForm } from '../../model/gca/shopping/request/search-gca-form';
import { GcaListRes } from '../../model/gca/shopping/response/gca-list-res';
import { gcaConstant } from '../gca.constant';
import { GcaQuoteReq } from '../../model/gca/quote/request/gca-quote-req';
import { QuoteCreatedRes } from '../../model/gca/quote/response/quote-created-res';
import { PaymentBookingResult } from "src/app/model/gca/payment-booking-result/payment-booking-result";
import { PaymentInfoReq } from "src/app/model/gca/payment-info/payment-info-req";
import { FlocashVCNRes } from '../../model/common/flocash-vcn-res';

export interface State {
  searchGcaForm: SearchGcaForm;
  searchGcaResult: GcaListRes;
  searchQuoteGcaForm: GcaQuoteReq;
  gcaQuoteResult: QuoteCreatedRes;
  checkoutReq: PaymentInfoReq;
  checkoutResult: PaymentBookingResult;
  agentVcn: FlocashVCNRes;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchGcaForm:  JSON.parse(sessionStorage.getItem(gcaConstant.SEARCH_GCA)) || null,
  searchGcaResult:  JSON.parse(sessionStorage.getItem(gcaConstant.GCA_LIST_RESULT)) || null,
  searchQuoteGcaForm: JSON.parse(sessionStorage.getItem(gcaConstant.SEARCH_QUOTE)) || null,
  gcaQuoteResult: JSON.parse(sessionStorage.getItem(gcaConstant.GCA_QUOTE_RESULT)) || null,
  checkoutReq: null,
  checkoutResult: JSON.parse(sessionStorage.getItem(gcaConstant.CHECKOUT_BOOKING_RESULT)),
  agentVcn: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function gcaReducer(
  state: State = initialState,
  action: GcaActions.GcaActions
) {
  switch (action.type) {
    case GcaActions.SEARCH_GCA_START:
      return {
        ...state,
        searchGcaForm: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.SEARCH_GCA_SUCCESS:
      return {
        ...state,
        searchGcaResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.SEARCH_GCA_FAIL:
      return {
        ...state,
        searchGcaResult: null,
        loading: false,
        failure: true,
        errorMessage: action.payload,
      };

    case GcaActions.CREATE_GCA_QUOTE_START:
      return {
        ...state,
        searchQuoteGcaForm: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.CREATE_GCA_QUOTE_SUCCESS:
      return {
        ...state,
        gcaQuoteResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.CREATE_GCA_QUOTE_FAIL:
      return {
        ...state,
        gcaQuoteResult: null,
        loading: false,
        failure: true,
        errorMessage: action.payload,
      };

    case GcaActions.PAYMENT_GCA_START:
      return {
        ...state,
        checkoutReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.PAYMENT_GCA_SUCCESS:
      return {
        ...state,
        checkoutResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
        errorMessage: null,
      };
    case GcaActions.PAYMENT_GCA_FAIL:
      return {
        ...state,
        checkoutResult: null,
        loading: false,
        failure: true,
        errorMessage: action.payload,
      };
    case GcaActions.GET_VCN_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case GcaActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case GcaActions.GET_VCN_FAIL:
      return {
        ...state,
        agentVcn: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
