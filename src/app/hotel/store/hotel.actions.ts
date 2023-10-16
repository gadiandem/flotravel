import { Action } from '@ngrx/store';

import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { HotelShoppingResponse } from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import { HotelDetailModel } from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import { User } from 'src/app/model/auth/user/user';
import { PaymentRes } from 'src/app/model/hotel/hotel-payment/payment.res';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { HotelRoomSimulator } from 'src/app/model/hotel/simulator/hotel-room-simulator';
import { HotelInfoSimulator } from 'src/app/model/hotel/simulator/hotel-info-simulator';
import { HotelCombineShoppingResponse } from 'src/app/model/combine/hotel-combine-shopping-res';
import { HotelCombineDetailResponse } from 'src/app/model/combine/hotel-combine-detail-res';
import { HotelCombineAvailabilityResponse } from 'src/app/model/combine/hotel-combine-availability-response';
import { ItemPrice } from 'src/app/model/packages/consumer/item-price';
import { HotelCombineBookingRes } from '../../model/combine/hotel-combine-booking-res';


export const SEARCH_HOTELLIST_START = '[Hotel] SEARCH_HOTELLIST_START';
export const SEARCH_HOTELLIST_COMBINE_START = '[Hotel] SEARCH_HOTELLIST_COMBINE_START';
export const SEARCH_HOTELLIST_SUCCESS = '[Hotel] SEARCH_HOTELLIST_SUCCESS';
export const SEARCH_HOTEL_LIST_COMBINE_SUCCESS = '[Hotel] SEARCH_HOTEL_LIST_COMBINE_SUCCESS';
export const SEARCH_HOTELLIST_FAIL = '[Hotel] SEARCH_HOTELLIST_FAIL';

export const FETCH_HOTEL_DETAIL_START = '[Hotel] FETCH_HOTEL_DETAIL_START';
export const FETCH_HOTELDETAIL_SUCCESS = '[Hotel] FETCH_HOTELDETAIL_SUCCESS';
export const FETCH_HOTEL_DETAIL_COMBINE_START = '[Hotel] FETCH_HOTEL_DETAIL_COMBINE_START';
export const FETCH_HOTEL_COMBINE_DETAIL_SUCCESS = '[Hotel] FETCH_HOTEL_COMBINE_DETAIL_SUCCESS';
export const FETCH_HOTELDETAIL_FAIL = '[Hotel] FETCH_HOTELDETAIL_FAIL';

export const CHECK_ROOM_AVAILABLE_START = '[Hotel] CHECK_ROOM_AVAILABLE_START';
export const CHECK_ROOM_AVAILABLE_COMBINE_START = '[Hotel] CHECK_ROOM_AVAILABLE_COMBINE_START';
export const CHECK_ROOM_AVAILABLE_COMBINE_SUCCESS = '[Hotel] CHECK_ROOM_AVAILABLE_COMBINE_SUCCESS';
export const CHECK_ROOM_AVAILABLE_SUCCESS = '[Hotel] CHECK_ROOM_AVAILABLE_SUCCESS';
export const CHECK_ROOM_AVAILABLE_FAIL = '[Hotel] CHECK_ROOM_AVAILABLE_FAIL';

export const GET_VCN_START = '[Hotel] GET_VCN_START';
export const GET_VCN_SIMULATOR_START = '[Hotel] GET_VCN_SIMULATOR_START';
export const GET_VCN_SUCCESS = '[Hotel] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Hotel] GET_VCN_FAIL';

export const HOTEL_PAYMENT_START = '[Hotel] HOTEL_PAYMENT_START';
export const HOTEL_PAYMENT_SUCCESS = '[Hotel] HOTEL_PAYMENT_SUCCESS';
export const HOTEL_PAYMENT_FAIL = '[Hotel] HOTEL_PAYMENT_FAIL';

export const SAVE_CART_INFO = '[Hotel] SAVE_CART_INFO';

export class SearchHotelListStart implements Action {
  readonly type = SEARCH_HOTELLIST_START;

  constructor(public payload: { data: HotelShoppingReq }) {}
}
export class SearchHotelListCombineStart implements Action {
  readonly type = SEARCH_HOTELLIST_COMBINE_START;

  constructor(public payload: { data: HotelShoppingReq }) {}
}

export class SearchHotelListSuccess implements Action {
  readonly type = SEARCH_HOTELLIST_SUCCESS;

  constructor(public payload: HotelShoppingResponse) {}
}

export class SearchHotelListCommbineSuccess implements Action {
  readonly type = SEARCH_HOTEL_LIST_COMBINE_SUCCESS;

  constructor(public payload: HotelCombineShoppingResponse ) {}
}


export class SearchHotelListFail implements Action {
  readonly type = SEARCH_HOTELLIST_FAIL;

  constructor(public payload: string) {}
}

export class FetchHotelDetailStart implements Action {
  readonly type = FETCH_HOTEL_DETAIL_START;

  constructor(public payload: { data: HotelInfo; sessionId: string; }) {}
}

export class FetchHotelDetailCombineStart implements Action {
  readonly type = FETCH_HOTEL_DETAIL_COMBINE_START;

  constructor(public payload: { data: HotelInfo; sessionId: string; provider: string }) {}
}

export class FetchHotelDetailCombineSuccess implements Action {
  readonly type = FETCH_HOTEL_COMBINE_DETAIL_SUCCESS;

  constructor(public payload: HotelCombineDetailResponse) {}
}
export class FetchHotelDetailSuccess implements Action {
  readonly type = FETCH_HOTELDETAIL_SUCCESS;

  constructor(public payload: HotelDetailModel) {}
}

export class FetchHotelDetailFail implements Action {
  readonly type = FETCH_HOTELDETAIL_FAIL;

  constructor(public payload: string) {}
}
export class CheckRoomAvailableStart implements Action {
  readonly type = CHECK_ROOM_AVAILABLE_START;

  constructor(
    public payload: {
      data: RateDetailList;
      sessionId: string;
      hotelCode: number;
    }
  ) {}
}
export class CheckRoomAvailableCombineStart implements Action {
  readonly type = CHECK_ROOM_AVAILABLE_COMBINE_START;

  constructor(
    public payload: {
      data: any;
      sessionId: string;
      hotelCode: number;
      startDate: string;
      endDate: string;
      packageInfo: ItemPrice;
      hotelRoom: ItemPrice[];
      hotelNctId: string;
      provider: string;
      numberOfRoom: number;
    }
  ) {}
}

export class CheckRoomAvailableSuccess implements Action {
  readonly type = CHECK_ROOM_AVAILABLE_SUCCESS;

  constructor(public payload: AvailablePropertyRes) {
  }
}
export class CheckRoomAvailableCombineSuccess implements Action {
  readonly type = CHECK_ROOM_AVAILABLE_COMBINE_SUCCESS;

  constructor(public payload: HotelCombineAvailabilityResponse) {}
}

export class CheckRoomAvailabeFail implements Action {
  readonly type = CHECK_ROOM_AVAILABLE_FAIL;

  constructor(public payload: string) {}
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;
  constructor(
    public payload: {
      data: {
        cardPayment: CardPaymentModel;
        vcnPayment: boolean;
        merchantPayment: MerchantPayment,
        currency: string;
        selectedRoom: RateDetailList;
        customerRoomInfos: UserInfoModel[];
        sessionId: string;
        availableProperty: AvailablePropertyRes;
        hotelSelected: HotelInfo;
        hotelBookingContact: BookingContact;
        accountBooking: string;
        bookingForUser: boolean;
        userIsBooking: string;
        countryCode: string;
        totalPrice: number;
      };
    }
  ) {}
}
export class GetVcnSimulatorStart implements Action {
  readonly type = GET_VCN_SIMULATOR_START;
  constructor(
    public payload: {
      data: {
        cardPayment: CardPaymentModel,
        vcnPayment: boolean,
        merchantPayment: MerchantPayment,
        currency: string,
        totalPrice: number,
        selectedRoom: HotelRoomSimulator,
        customerRoomInfos: UserInfoModel[],
        hotelSelected: HotelInfoSimulator,
        hotelBookingContact: BookingContact,
        accountBooking: string,
        bookingForUser: boolean,
        userIsBooking: string,
        countryCode: string,
        hotelShoppingReq: HotelShoppingReq
      };
    }
  ) {}
}
export class GetVcnSuccess implements Action {
  readonly type = GET_VCN_SUCCESS;

  constructor(public payload: FlocashVCNRes) {}
}

export class GetVcnFail implements Action {
  readonly type = GET_VCN_FAIL;

  constructor(public payload: string) {}
}

export class HotelPaymentStart implements Action {
  readonly type = HOTEL_PAYMENT_START;

  constructor(
    public payload: {
      data: HotelPaymentRequest
    }
  ) {}
}

export class HotelPaymentSuccess implements Action {
  readonly type = HOTEL_PAYMENT_SUCCESS;

  constructor(public payload: PaymentRes) {}
}

export class HotelPaymentFail implements Action {
  readonly type = HOTEL_PAYMENT_FAIL;

  constructor(public payload: string) {}
}

// export class SaveCartInfo implements Action {
//   readonly type = SAVE_CART_INFO;

//   constructor(public payload: { customers: UserInfoModel, cardPayment: CardPaymentModel }) { }
// }
export type HotelActions =
  | SearchHotelListStart
  | SearchHotelListCombineStart
  | SearchHotelListSuccess
  | SearchHotelListCommbineSuccess
  | SearchHotelListFail
  | FetchHotelDetailStart
  | FetchHotelDetailCombineStart
  | FetchHotelDetailSuccess
  | FetchHotelDetailCombineSuccess
  | FetchHotelDetailFail
  | CheckRoomAvailableStart
  | CheckRoomAvailableCombineStart
  | CheckRoomAvailableSuccess
  | CheckRoomAvailableCombineSuccess
  | CheckRoomAvailabeFail
  | GetVcnStart
  | GetVcnSimulatorStart
  | GetVcnSuccess
  | GetVcnFail
  | HotelPaymentStart
  | HotelPaymentSuccess
  | HotelPaymentFail;
// | SaveCartInfo;
