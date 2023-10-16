import * as TraceActions from "./traceme.actions";

import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { TraceMeShoppingReq } from "src/app/model/traceme/shopping/traceme-shopping-req";
import { TraceMeShoppingRes } from "src/app/model/traceme/shopping/traceme-shopping-res";
import { QuoteItem } from "src/app/model/traceme/shopping/quote-item";
import { TraceMeFinaliseAndBookingReq } from "src/app/model/traceme/finalise/traceme-finalise-booking";
import { FlocashPaymentTraceMe } from "src/app/model/traceme/history/traceme-history-item";

export interface State {
  searchTracemeReq: TraceMeShoppingReq;
  searchTracemeResult: TraceMeShoppingRes;
  selectedTraceme: QuoteItem;
  agentVcn: FlocashVCNRes,
  tracemePaymentReq: TraceMeFinaliseAndBookingReq;
  tracemePaymentRes: FlocashPaymentTraceMe;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchTracemeReq: null,
  searchTracemeResult: null,
  selectedTraceme: null,
  agentVcn: null,
  tracemePaymentReq: null,
  tracemePaymentRes: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function tracemeReducer(
  state: State = initialState,
  action: TraceActions.TracemeActions
) {
  switch (action.type) {
    case TraceActions.SEARCH_TRACEME_START:
      return {
        ...state,
        searchTracemeReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TraceActions.SEARCH_TRACEME_SUCCESS:
      return {
        ...state,
        searchTracemeResult: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case TraceActions.SEARCH_TRACEME_FAIL:
      return {
        ...state,
        searchTracemeResult: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case TraceActions.GET_VCN_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case TraceActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TraceActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case TraceActions.PAYMENT_TRACEME_START:
      return {
        ...state,
        tracemePaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TraceActions.PAYMENT_TRACEME_SUCCESS:
      return {
        ...state,
        tracemePaymentRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TraceActions.PAYMENT_TRACEME_FAIL:
      return {
        ...state,
        tracemePaymentRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
