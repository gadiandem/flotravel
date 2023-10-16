import * as TourActions from "./thing-to-do.actions";
import { TourShoppingRQ } from "src/app/model/thing-to-do/tour-shopping-req";
import { ExtrasPackage } from "src/app/model/thing-to-do/insert-tour/extras-package";
import { ScheduleExtra } from "src/app/model/thing-to-do/schedule-extra-data";
import { PaymentTour } from "src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour";
import { PaymentTourReq } from "src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request";
import { Schedule } from "src/app/model/thing-to-do/insert-tour/shedule";
import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { OtpClientRes } from "src/app/model/common/otp-client-res";
import { ExtrasShoppingRes } from "src/app/model/thing-to-do/tour-list/extras-shopping-res";
import { ExtraDetailRes } from "src/app/model/thing-to-do/tour-detail/extra-detail-res";
import { ExtraDetailAvailabilityCheckRS } from "src/app/model/thing-to-do/availability-check/extra-detail-availability-check-res";
import { ExtraDetailAvailabilityCheckRQ } from "src/app/model/thing-to-do/availability-check/extra-detail-availability-check-req";

export interface State {
  searchTourReq: TourShoppingRQ;
  searchTourListResult: ExtrasShoppingRes;
  selectedTour: ExtrasPackage;
  schedulerListResult: ExtraDetailRes;
  extraAvailabilityReq: ExtraDetailAvailabilityCheckRQ;
  extraAvailability: ExtraDetailAvailabilityCheckRS;
  selectedSchedule: Schedule;
  agentVcn: FlocashVCNRes,
  tourPaymentReq: PaymentTourReq;
  tourPaymentRes: PaymentTour;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchTourReq: null,
  searchTourListResult: null,
  selectedTour: null,
  schedulerListResult: null,
  extraAvailabilityReq: null,
  extraAvailability: null,
  selectedSchedule: null,
  agentVcn: null,
  tourPaymentReq: null,
  tourPaymentRes: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function thingToDoReducer(
  state: State = initialState,
  action: TourActions.TourActions
) {
  switch (action.type) {
    case TourActions.SEARCH_TOURLIST_START:
      return {
        ...state,
        searchTourReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TourActions.SEARCH_TOURLIST_SUCCESS:
      return {
        ...state,
        searchTourListResult: Object.assign({}, action.payload),
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case TourActions.SEARCH_TOURLIST_FAIL:
      return {
        ...state,
        searchTourListResult: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case TourActions.FETCH_TOURDETAIL_START:
      return {
        ...state,
        selectedTour: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TourActions.FETCH_TOURDETAIL_SUCCESS:
      return {
        ...state,
        schedulerListResult: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TourActions.FETCH_TOURDETAIL_FAIL:
      return {
        ...state,
        schedulerListResult: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

      case TourActions.CHECK_AVAILABILITY_START:
      return {
        ...state,
        extraAvailabilityReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TourActions.CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        extraAvailability: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TourActions.CHECK_AVAILABILITY_FAIL:
      return {
        ...state,
        extraAvailability: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case TourActions.SELECT_SCHEDULE:
      return {
        ...state,
        selectedSchedule: Object.assign({}, action.payload),
        loading: true,
        failure: false,
      };
    case TourActions.GET_VCN_START:
      return {
        ...state,
        // tourPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case TourActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TourActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case TourActions.PAYMENT_TOUR_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case TourActions.PAYMENT_TOUR_SUCCESS:
      return {
        ...state,
        tourPaymentRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case TourActions.PAYMENT_TOUR_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
