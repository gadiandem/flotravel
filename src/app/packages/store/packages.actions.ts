import { Action } from '@ngrx/store';

import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { ExtraDetailAvailabilityView } from 'src/app/model/thing-to-do/tour-detail/extra-detail-view';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { HotelPackageDetailReq } from 'src/app/model/packages/consumer/hotel-package-detail-req';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { SupplementPackageReq } from 'src/app/model/packages/consumer/supplement-package-req';
import { SupplementPackageRes } from 'src/app/model/packages/consumer/supplement-package-res';
import { TourPackageReq } from 'src/app/model/packages/consumer/tour-package-req';
import { TourPackageRes } from 'src/app/model/packages/consumer/tour-package-res';
import { TransferPackageReq } from 'src/app/model/packages/consumer/transfer-pacakge-req';
import { TransferPackageRes } from 'src/app/model/packages/consumer/transfer-pacakge-res';
import { SummaryPackageReq } from 'src/app/model/packages/consumer/summary-package-req';
import { SummaryPackageRes } from 'src/app/model/packages/consumer/summary-package-res';
import { OrderPackageCreateReq } from 'src/app/model/packages/consumer/order-package-create-req';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { PackageOptionalRes } from 'src/app/model/packages/consumer/package-optional-res';
import { PackageOptionalReq } from 'src/app/model/packages/consumer/package-optional-req';

export const SEARCH_PACKAGESLIST_START = '[Pakcages] SEARCH_PACKAGESLIST_START';
export const SEARCH_PACKAGESLIST_SUCCESS = '[Pakcages] SEARCH_PACKAGESLIST_SUCCESS';
export const SEARCH_PACKAGESLIST_FAIL = '[Pakcages] SEARCH_PACKAGESLIST_FAIL';

export const PACKAGE_LIST_FOR_IMAGE_START = '[Pakcages] PACKAGE_LIST_FOR_IMAGE_START';
export const PACKAGE_LIST_FOR_IMAGE_SUCCESS = '[Pakcages] PACKAGE_LIST_FOR_IMAGE_SUCCESS';
export const PACKAGE_LIST_FOR_IMAGE_FAIL = '[Pakcages] PACKAGE_LIST_FOR_IMAGE_FAIL';

export const PACKAGE_HOTEL_FOR_IMAGE_START = '[Pakcages] PACKAGE_HOTEL_FOR_IMAGE_START';
export const PACKAGE_HOTEL_FOR_IMAGE_SUCCESS = '[Pakcages] PACKAGE_HOTEL_FOR_IMAGE_SUCCESS';
export const PACKAGE_HOTEL_FOR_IMAGE_FAIL = '[Pakcages] PACKAGE_HOTEL_FOR_IMAGE_FAIL';

export const PACKAGES_HOTEL_DETAIL_START = '[Pakcages] PACKAGES_HOTEL_DETAIL_START';
export const PACKAGES_HOTEL_DETAIL_SUCCESS = '[Pakcages] PACKAGES_HOTEL_DETAIL_SUCCESS';
export const PACKAGES_HOTEL_DETAIL_FAIL = '[Pakcages] PACKAGES_HOTEL_DETAIL_FAIL';

export const SELECTED_ROOM = '[Pakcages] SELECTED_ROOM';

export const PACKAGES_SUPPLEMENT_START = '[Pakcages] PACKAGES_SUPPLEMENT_START';
export const PACKAGES_SUPPLEMENT_SUCCESS = '[Pakcages] PACKAGES_SUPPLEMENT_SUCCESS';
export const PACKAGES_SUPPLEMENT_FAIL = '[Pakcages] PACKAGES_SUPPLEMENT_FAIL';

export const PACKAGES_TOUR_START = '[Pakcages] PACKAGES_TOUR_START';
export const PACKAGES_TOUR_SUCCESS = '[Pakcages] PACKAGES_TOUR_SUCCESS';
export const PACKAGES_TOUR_FAIL = '[Pakcages] PACKAGES_TOUR_FAIL';

export const PACKAGES_TRANSFER_START = '[Pakcages] PACKAGES_TRANSFER_START';
export const PACKAGES_TRANSFER_SUCCESS = '[Pakcages] PACKAGES_TRANSFER_SUCCESS';
export const PACKAGES_TRANSFER_FAIL = '[Pakcages] PACKAGES_TRANSFER_FAIL';

export const PACKAGES_OPTIONAL_START = '[Pakcages] PACKAGES_OPTIONAL_START';
export const PACKAGES_OPTIONAL_SUCCESS = '[Pakcages] PACKAGES_OPTIONAL_SUCCESS';
export const PACKAGES_OPTIONAL_FAIL = '[Pakcages] PACKAGES_OPTIONAL_FAIL';

export const PACKAGES_SUMMARY_START = '[Pakcages] PACKAGES_SUMMARY_START';
export const PACKAGES_SUMMARY_SUCCESS = '[Pakcages] PACKAGES_SUMMARY_SUCCESS';
export const PACKAGES_SUMMARY_FAIL = '[Pakcages] PACKAGES_SUMMARY_FAIL';

export const GET_VCN_START = '[Pakcages] GET_VCN_START';
export const GET_VCN_SUCCESS = '[Pakcages] GET_VCN_SUCCESS';
export const GET_VCN_FAIL = '[Pakcages] GET_VCN_FAIL';

export const PAYMENT_PACKAGES_START = '[Pakcages] PAYMENT_PACKAGES_START';
export const PAYMENT_PACKAGES_SUCCESS = '[Pakcages] PAYMENT_PACKAGES_SUCCESS';
export const PAYMENT_PACKAGES_FAIL = '[Pakcages] PAYMENT_PACKAGES_FAIL';

export class SearchPackagesListStart implements Action {
  readonly type = SEARCH_PACKAGESLIST_START;

  constructor(public payload: { data: PackageShoppingReq }) { }
}

export class SearchhPackagesListSuccess implements Action {
  readonly type = SEARCH_PACKAGESLIST_SUCCESS;

  constructor(public payload: PackageShoppingRes[]) { }
}

export class SearchPackagesListFail implements Action {
  readonly type = SEARCH_PACKAGESLIST_FAIL;

  constructor(public payload: string) { }
}

export class PackageListForImageStart implements Action {
  readonly type = PACKAGE_LIST_FOR_IMAGE_START;
  constructor(public payload: {filter: string, dataFilter: string}) {}
}

export class PackageListForImageSuccess implements Action {
  readonly type = PACKAGE_LIST_FOR_IMAGE_SUCCESS;
  constructor(public payload: PackageShoppingRes[]) { }
}

export class PackageListForImageFail implements Action {
  readonly type = PACKAGE_LIST_FOR_IMAGE_FAIL;
  constructor(public payload: string) { }
}

export class PackageHotelForImageStart implements Action {
  readonly type = PACKAGE_HOTEL_FOR_IMAGE_START;
  constructor(public payload: {filter: string, dataFilter: string}) {}
}

export class PackageHotelForImageSuccess implements Action {
  readonly type = PACKAGE_HOTEL_FOR_IMAGE_SUCCESS;
  constructor(public payload: PackageShoppingRes[]) { }
}

export class PackageHotelForImageFail implements Action {
  readonly type = PACKAGE_HOTEL_FOR_IMAGE_FAIL;
  constructor(public payload: string) { }
}


export class PackagesHotelDetailStart implements Action {
  readonly type = PACKAGES_HOTEL_DETAIL_START;

  constructor(public payload: { data: HotelPackageDetailReq}) { }
}

export class PackagesHotelDetailSuccess implements Action {
  readonly type = PACKAGES_HOTEL_DETAIL_SUCCESS;

  constructor(public payload: HotelPackageDetailRes[]) { }
}

export class PackagesHotelListFail implements Action {
  readonly type = PACKAGES_HOTEL_DETAIL_FAIL;

  constructor(public payload: string) { }
}

export class SelectRoom implements Action {
  readonly type = SELECTED_ROOM;

  constructor(public payload: HotelPackageDetailRes) { }
}

export class PackagesSupplementStart implements Action {
  readonly type = PACKAGES_SUPPLEMENT_START;

  constructor(public payload: { data: SupplementPackageReq }) { }
}

export class PackagesSupplementSuccess implements Action {
  readonly type = PACKAGES_SUPPLEMENT_SUCCESS;

  constructor(public payload: SupplementPackageRes[]) { }
}

export class PackagesSupplementFail implements Action {
  readonly type = PACKAGES_SUPPLEMENT_FAIL;

  constructor(public payload: string) { }
}


export class PackagesTourStart implements Action {
  readonly type = PACKAGES_TOUR_START;

  constructor(public payload: { data: TourPackageReq }) { }
}

export class PackagesTourSuccess implements Action {
  readonly type = PACKAGES_TOUR_SUCCESS;

  constructor(public payload: TourPackageRes[]) { }
}

export class PackagesTourFail implements Action {
  readonly type = PACKAGES_TOUR_FAIL;

  constructor(public payload: string) { }
}


export class PackagesTransferStart implements Action {
  readonly type = PACKAGES_TRANSFER_START;

  constructor(public payload: { data: TransferPackageReq }) { }
}

export class PackagesTransferSuccess implements Action {
  readonly type = PACKAGES_TRANSFER_SUCCESS;

  constructor(public payload: TransferPackageRes[]) { }
}

export class PackagesTransferFail implements Action {
  readonly type = PACKAGES_TRANSFER_FAIL;

  constructor(public payload: string) { }
}

export class PackagesOptionalStart implements Action {
  readonly type = PACKAGES_OPTIONAL_START;

  constructor(public payload: { data: PackageOptionalReq }) { }
}

export class PackagesOptionalSuccess implements Action {
  readonly type = PACKAGES_OPTIONAL_SUCCESS;

  constructor(public payload: PackageOptionalRes) { }
}

export class PackagesOptionalFail implements Action {
  readonly type = PACKAGES_OPTIONAL_FAIL;

  constructor(public payload: string) { }
}


export class PackagesSummaryStart implements Action {
  readonly type = PACKAGES_SUMMARY_START;

  constructor(public payload: { data: SummaryPackageReq }) { }
}

export class PackagesSummarySuccess implements Action {
  readonly type = PACKAGES_SUMMARY_SUCCESS;

  constructor(public payload: SummaryPackageRes) { }
}

export class PackagesSummaryFail implements Action {
  readonly type = PACKAGES_SUMMARY_FAIL;

  constructor(public payload: string) { }
}

export class GetVcnStart implements Action {
  readonly type = GET_VCN_START;

  constructor(public payload: { data: {
    cardPayment: CardPaymentModel;
    vcnPayment: boolean;
    merchantPayment: MerchantPayment,
    currency: string;
    amount: number;
    customerRoomInfos: UserInfoModel[];
    tourBookingContact: BookingContact;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    selectedPackage: PackageShoppingRes;
    summary: SummaryPackageRes;
    countryName: string;
    countryCode: string;
    totalTripPrice: number;
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
export class PaymentPackagesStart implements Action {
  readonly type = PAYMENT_PACKAGES_START;

  constructor(public payload: { data: OrderPackageCreateReq }) { }
}

export class PaymentPackagesSuccess implements Action {
  readonly type = PAYMENT_PACKAGES_SUCCESS;

  constructor(public payload: OrderPackageCreateRes) { }
}

export class PaymentPackagesFail implements Action {
  readonly type = PAYMENT_PACKAGES_FAIL;

  constructor(public payload: string) { }
}

export type PackagesActions =
  | SearchPackagesListStart
  | SearchhPackagesListSuccess
  | SearchPackagesListFail
  | PackagesHotelDetailStart
  | PackagesHotelDetailSuccess
  | PackagesHotelListFail
  | SelectRoom
  | PackagesSupplementStart
  | PackagesSupplementSuccess
  | PackagesSupplementFail
  | PackagesTourStart
  | PackagesTourSuccess
  | PackagesTourFail
  | PackagesTransferStart
  | PackagesTransferSuccess
  | PackagesTransferFail
  | PackagesOptionalStart
  | PackagesOptionalSuccess
  | PackagesOptionalFail
  | PackagesSummaryStart
  | PackagesSummarySuccess
  | PackagesSummaryFail
  | GetVcnStart
  | GetVcnSuccess
  | GetVcnFail
  | PaymentPackagesStart
  | PaymentPackagesSuccess
  | PaymentPackagesFail
  | PackageListForImageStart
  | PackageListForImageSuccess
  | PackageListForImageFail
  | PackageHotelForImageStart
  | PackageHotelForImageSuccess
  | PackageHotelForImageFail
