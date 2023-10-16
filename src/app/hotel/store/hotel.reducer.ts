import * as HotelActions from './hotel.actions';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { HotelShoppingResponse } from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import { HotelDetailModel } from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import { PaymentRes } from 'src/app/model/hotel/hotel-payment/payment.res';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { hotelConstant } from '../hotel.constant';
import { HotelCombineShoppingResponse } from 'src/app/model/combine/hotel-combine-shopping-res';
import { HotelCombineDetailResponse } from 'src/app/model/combine/hotel-combine-detail-res';
import { HotelCombineBookingRes } from 'src/app/model/combine/hotel-combine-booking-res';
import { HotelCombineAvailabilityResponse } from 'src/app/model/combine/hotel-combine-availability-response';

export interface State {
  searchHotelListForm: HotelShoppingReq;
  searchHotelListResult: HotelShoppingResponse;
  searchHotelCombineListResult: HotelCombineShoppingResponse;
  sessionId: string;
  selectedHotel: HotelInfo;
  selectedHotelDetail: HotelDetailModel;
  selectedHotelCombineDetail: HotelCombineDetailResponse;
 // selectedRoom: RateDetailList;
  selectedRoom: RateDetailList;
  avalableProperty: AvailablePropertyRes;
  avalablePropertyCombine: HotelCombineAvailabilityResponse;
  agentVcn: FlocashVCNRes;
  // customers: UserInfoModel[];
  // cardPayment: CardPaymentModel;
  paymentRes: PaymentRes;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchHotelListForm: null,
  searchHotelListResult: JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_LIS_RESULT)),
  searchHotelCombineListResult: JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_LIS_RESULT)),
  sessionId: null,
  selectedHotel: null,
  selectedHotelDetail: null,
  selectedHotelCombineDetail: null,
  selectedRoom: null,
  avalableProperty: null,
  avalablePropertyCombine: null,
  agentVcn: null,
  // customers: [],
  // cardPayment: null,
  paymentRes: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function hotelReducer(
  state: State = initialState,
  action: HotelActions.HotelActions
) {
  switch (action.type) {
    case HotelActions.SEARCH_HOTELLIST_START:
      return {
        ...state,
        searchHotelListForm: Object.assign({}, action.payload.data),
        searchHotelListResult: null,
        loading: true,
        failure: false,
      };
      case HotelActions.SEARCH_HOTELLIST_COMBINE_START:
        return {
          ...state,
          searchHotelListForm: Object.assign({}, action.payload.data),
          searchHotelCombineListResult: null,
          loading: true,
          failure: false,
        };
    case HotelActions.SEARCH_HOTELLIST_SUCCESS:
      return {
        ...state,
        searchHotelListResult: Object.assign({}, action.payload),
        sessionId: action.payload.sessionId,
        errorMessage: null,
        loading: false,
        failure: false,
      };
      case HotelActions.SEARCH_HOTEL_LIST_COMBINE_SUCCESS:
      return {
        ...state,
        searchHotelCombineListResult: Object.assign({}, action.payload),
        // sessionId: action.payload.sessionId,
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case HotelActions.SEARCH_HOTELLIST_FAIL:
      return {
        ...state,
        searchHotelListResult: null,
        sessionId: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case HotelActions.FETCH_HOTEL_DETAIL_START:
      return {
        ...state,
        selectedHotel: Object.assign({}, action.payload.data),
        loading: true,
        // loading: false,
        failure: false,
      };
      case HotelActions.FETCH_HOTEL_DETAIL_COMBINE_START:
      return {
        ...state,
        selectedHotel: Object.assign({}, action.payload.data),
        // loading: true,
        loading: false,
        failure: false,
      };
    case HotelActions.FETCH_HOTELDETAIL_SUCCESS:
      return {
        ...state,
        selectedHotelDetail: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
      case HotelActions.FETCH_HOTEL_COMBINE_DETAIL_SUCCESS:
      return {
        ...state,
        selectedHotelCombineDetail: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HotelActions.FETCH_HOTELDETAIL_FAIL:
      return {
        ...state,
        selectedHotelDetail: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case HotelActions.CHECK_ROOM_AVAILABLE_START:
      return {
        ...state,
        selectedRoom: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
      case HotelActions.CHECK_ROOM_AVAILABLE_COMBINE_START:
      return {
        ...state,
        selectedRoom: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case HotelActions.CHECK_ROOM_AVAILABLE_SUCCESS:
      return {
        ...state,
        avalableProperty: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
      case HotelActions.CHECK_ROOM_AVAILABLE_COMBINE_SUCCESS:
      return {
        ...state,
        avalablePropertyCombine: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HotelActions.CHECK_ROOM_AVAILABLE_FAIL:
      return {
        ...state,
        avalableProperty: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case HotelActions.GET_VCN_START:
      return {
        ...state,
        // tourPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case HotelActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HotelActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case HotelActions.HOTEL_PAYMENT_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case HotelActions.HOTEL_PAYMENT_SUCCESS:
      return {
        ...state,
        paymentRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case HotelActions.HOTEL_PAYMENT_FAIL:
      return {
        ...state,
        paymentRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    // case HotelActions.SAVE_CART_INFO:
    //   return {
    //     ...state,
    //     customers: [...action.payload.customers],
    //     cardPayment: action.payload.cardPayment,
    //   };
    default:
      return state;
  }
}
