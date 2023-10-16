import * as HepstarActions from "./hepstar.actions";

import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { TraceMeShoppingReq } from "src/app/model/traceme/shopping/traceme-shopping-req";
import { TraceMeShoppingRes } from "src/app/model/traceme/shopping/traceme-shopping-res";
import { QuoteItem } from "src/app/model/traceme/shopping/quote-item";
import { TraceMeFinaliseAndBookingReq } from "src/app/model/traceme/finalise/traceme-finalise-booking";
import { FlocashPaymentTraceMe } from "src/app/model/traceme/history/traceme-history-item";
import { HepstarSearchFormData } from "src/app/model/hepstar/search-from-data";
import { SearchHepstarRes } from "src/app/model/hepstar/search-hepstar-res";
import { hepstarConstant } from "../hepstar.constant";

export interface State {
  searchHepstarReq: HepstarSearchFormData;
  searchHepstarResult: SearchHepstarRes;
  selectedTraceme: QuoteItem;
  agentVcn: FlocashVCNRes,
  hepstarPaymentReq: any;
  hepstarPaymentRes: FlocashPaymentTraceMe;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchHepstarReq: JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM)),
  searchHepstarResult: JSON.parse(sessionStorage.getItem(hepstarConstant.PRODUCT_LIST)),
  selectedTraceme: null,
  agentVcn: null,
  hepstarPaymentReq: null,
  hepstarPaymentRes: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function hepstarReducer(
  state: State = initialState,
  action: HepstarActions.HepstarActions
) {
  switch (action.type) {
    case HepstarActions.SEARCH_HEPSTAR_START:
      return {
        ...state,
        searchHepstarReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case HepstarActions.SEARCH_HEPSTAR_SUCCESS:
      return {
        ...state,
        searchHepstarResult: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case HepstarActions.SEARCH_HEPSTAR_FAIL:
      return {
        ...state,
        searchHepstarResult: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case HepstarActions.GET_VCN_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case HepstarActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HepstarActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case HepstarActions.PAYMENT_HEPSTAR_START:
      return {
        ...state,
        hepstarPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case HepstarActions.PAYMENT_HEPSTAR_SUCCESS:
      return {
        ...state,
        hepstarPaymentRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HepstarActions.PAYMENT_HEPSTAR_FAIL:
      return {
        ...state,
        hepstarPaymentRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
