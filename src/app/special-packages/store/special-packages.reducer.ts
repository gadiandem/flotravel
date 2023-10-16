import * as PackagesActions from "./special-packages.actions";
import { PaymentTour } from "src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour";
import { PaymentTourReq } from "src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request";
import { FlocashVCNRes } from "src/app/model/common/flocash-vcn-res";
import { PackageShoppingReq } from "src/app/model/packages/consumer/package-shopping-req";
import { PackageShoppingRes } from "src/app/model/packages/consumer/package-shopping-res";
import { HotelPackageDetailReq } from "src/app/model/packages/consumer/hotel-package-detail-req";
import { HotelPackageDetailRes } from "src/app/model/packages/consumer/hotel-package-detail-res";
import { SupplementPackageReq } from "src/app/model/packages/consumer/supplement-package-req";
import { SupplementPackageRes } from "src/app/model/packages/consumer/supplement-package-res";
import { TourPackageReq } from "src/app/model/packages/consumer/tour-package-req";
import { TourPackageRes } from "src/app/model/packages/consumer/tour-package-res";
import { TransferPackageReq } from "src/app/model/packages/consumer/transfer-pacakge-req";
import { TransferPackageRes } from "src/app/model/packages/consumer/transfer-pacakge-res";
import { SummaryPackageReq } from "src/app/model/packages/consumer/summary-package-req";
import { SummaryPackageRes } from "src/app/model/packages/consumer/summary-package-res";
import { OrderPackageCreateReq } from "src/app/model/packages/consumer/order-package-create-req";
import { OrderPackageCreateRes } from "src/app/model/packages/consumer/order-package-create-res";
import { PackageOptionalReq } from "src/app/model/packages/consumer/package-optional-req";
import { PackageOptionalRes } from "src/app/model/packages/consumer/package-optional-res";

export interface State {
  searchPackageListReq: PackageShoppingReq;
  searchPackageListRes: PackageShoppingRes[];
  selectedPackages: PackageShoppingRes;
  packageHotelDetailReq: HotelPackageDetailReq;
  packageHotelDetailRes: HotelPackageDetailRes[];
  selectedRoom: HotelPackageDetailRes;
  packageSupplementReq: SupplementPackageReq;
  packageSupplementRes: SupplementPackageRes[];
  packageTourReq: TourPackageReq;
  packageTourRes: TourPackageRes[];
  packageTransferReq: TransferPackageReq;
  packageTransferRes: TransferPackageRes[];
  packageOptionalReq: PackageOptionalReq;
  packageOptionalRes: PackageOptionalRes;
  packageSummaryReq: SummaryPackageReq;
  packageSummaryRes: SummaryPackageRes;

  agentVcn: FlocashVCNRes;
  packagesPaymentReq: OrderPackageCreateReq;
  packagesPaymentRes: OrderPackageCreateRes;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  searchPackageListReq: null,
  searchPackageListRes: [],
  selectedPackages: null,
  packageHotelDetailReq: null,
  packageHotelDetailRes: [],
  selectedRoom: null,
  packageSupplementReq: null,
  packageSupplementRes: [],
  packageTourReq: null,
  packageTourRes: [],
  packageTransferReq: null,
  packageTransferRes: [],
  packageSummaryReq: null,
  packageSummaryRes: null,
  packageOptionalReq: null,
  packageOptionalRes: null,
  agentVcn: null,
  packagesPaymentReq: null,
  packagesPaymentRes: null,
  errorMessage: null,
  loading: false,
  failure: false,
};

export function specialPackagesReducer(
  state: State = initialState,
  action: PackagesActions.SpecialPackagesActions
) {
  switch (action.type) {
    case PackagesActions.SEARCH_PACKAGESLIST_START:
      return {
        ...state,
        searchPackageListReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.SEARCH_PACKAGESLIST_SUCCESS:
      return {
        ...state,
        searchPackageListRes: [...action.payload],
        errorMessage: null,
        loading: false,
        failure: false,
      };
    case PackagesActions.SEARCH_PACKAGESLIST_FAIL:
      return {
        ...state,
        searchPackageListRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.PACKAGES_HOTEL_DETAIL_START:
      return {
        ...state,
        packageHotelDetailReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PACKAGES_HOTEL_DETAIL_SUCCESS:
      return {
        ...state,
        packageHotelDetailRes: [...action.payload],
        loading: false,
        failure: false,
      };
    case PackagesActions.PACKAGES_HOTEL_DETAIL_FAIL:
      return {
        ...state,
        packageHotelDetailRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.SELECTED_ROOM:
      return {
        ...state,
        selectedRoom: Object.assign({}, action.payload),
        // selectedRoom: [...action.payload],
      };
    case PackagesActions.PACKAGES_SUPPLEMENT_START:
      return {
        ...state,
        packageSupplementReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PACKAGES_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        packageSupplementRes: [...action.payload],
        loading: false,
        failure: false,
      };
    case PackagesActions.PACKAGES_SUPPLEMENT_FAIL:
      return {
        ...state,
        packageSupplementRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.PACKAGES_TOUR_START:
      return {
        ...state,
        packageTourReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PACKAGES_TOUR_SUCCESS:
      return {
        ...state,
        packageTourRes: [...action.payload],
        loading: false,
        failure: false,
      };
    case PackagesActions.PACKAGES_TOUR_FAIL:
      return {
        ...state,
        packageTourRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.PACKAGES_TRANSFER_START:
      return {
        ...state,
        packageTransferReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PACKAGES_TRANSFER_SUCCESS:
      return {
        ...state,
        packageTransferRes: [...action.payload],
        loading: false,
        failure: false,
      };
    case PackagesActions.PACKAGES_TRANSFER_FAIL:
      return {
        ...state,
        packageTransferRes: [],
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.PACKAGES_OPTIONAL_START:
        return {
          ...state,
          packageOptionalReq: Object.assign({}, action.payload.data),
          loading: true,
          failure: false,
        };
    case PackagesActions.PACKAGES_OPTIONAL_SUCCESS:
        return {
          ...state,
          packageOptionalRes:  Object.assign({}, action.payload),
          loading: false,
          failure: false,
        };
    case PackagesActions.PACKAGES_OPTIONAL_FAIL:
        return {
          ...state,
          packageOptionalRes: null,
          errorMessage: action.payload,
          loading: false,
          failure: true,
        };
    case PackagesActions.PACKAGES_SUMMARY_START:
      return {
        ...state,
        packageSummaryReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PACKAGES_SUMMARY_SUCCESS:
      return {
        ...state,
        packageSummaryRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case PackagesActions.PACKAGES_SUMMARY_FAIL:
      return {
        ...state,
        packageSummaryRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    case PackagesActions.GET_VCN_START:
      return {
        ...state,
        loading: true,
        failure: false,
      };
    case PackagesActions.GET_VCN_SUCCESS:
      return {
        ...state,
        agentVcn: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case PackagesActions.GET_VCN_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };

    case PackagesActions.PAYMENT_PACKAGES_START:
      return {
        ...state,
        packagesPaymentReq: Object.assign({}, action.payload.data),
        loading: true,
        failure: false,
      };
    case PackagesActions.PAYMENT_PACKAGES_SUCCESS:
      return {
        ...state,
        packagesPaymentRes: Object.assign({}, action.payload),
        loading: false,
        failure: false,
      };
    case PackagesActions.PAYMENT_PACKAGES_FAIL:
      return {
        ...state,
        packagesPaymentRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true,
      };
    default:
      return state;
  }
}
