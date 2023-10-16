import * as ProviderPackagesActions from './provider-packages.actions';
import {HotelPackage} from '../../../model/packages/provider/hotel-package';
import {providerPackagesConstant} from '../provider-packages.constant';
import {HotelRoomPackage} from '../../../model/packages/provider/hotel-room-package';
import {PackageInfo} from '../../../model/packages/provider/package-info';
import {RegionPackage} from '../../../model/packages/provider/region';
import {RegionCreateReq} from '../../../model/packages/provider/region-create.req';
import {SupplementPackage} from '../../../model/packages/provider/supplement-package';
import {TourPackage} from '../../../model/packages/provider/tour-package';
import {TransferInPackage} from '../../../model/packages/provider/transfer-package';
import {HotelFacility} from '../../../model/packages/provider/hotel-facility';
import {HotelFacilityReq} from '../../../model/packages/provider/hotel-facility-create.req';
import { PaginationHotelPackage } from 'src/app/model/packages/provider/pagination/pagination-hotel-package';
import { PaginationPackageInfo } from 'src/app/model/packages/provider/pagination/pagination-package-info';
import { PaginationHotelRoom } from 'src/app/model/packages/provider/pagination/pagination-hotel-room';
import { PaginationHotelFacility } from 'src/app/model/packages/provider/pagination/pagination-hotel-facitities';
import { PaginationSupplementPackage } from 'src/app/model/packages/provider/pagination/pagination-supplement-package';
import { PaginationTourPackage } from 'src/app/model/packages/provider/pagination/pagination-tour-package';
import { PaginationTransferPackage } from 'src/app/model/packages/provider/pagination/pagination-transfer-package';

export interface State {
  packageHotelListRes: PaginationHotelPackage;
  packageHotelCreateReq: HotelPackage;
  packageHotelCreateRes: HotelPackage;
  packageHotelDetailRes: HotelPackage;
  packageHotelUpdateReq: HotelPackage;
  packageHotelUpdateRes: HotelPackage;
  packageHotelListByNameRes: PaginationHotelPackage;
  packageHotelRoomListRes:  PaginationHotelRoom;
  packageHotelRoomCreateReq: HotelRoomPackage;
  packageHotelRoomCreateRes: HotelRoomPackage;
  packageHotelRoomDetailRes: HotelRoomPackage;
  packageHotelRoomUpdateReq: HotelRoomPackage;
  packageHotelRoomUpdateRes: HotelRoomPackage;
  packageInfoListRes: PaginationPackageInfo;
  packageInfoDetailRes: PackageInfo;
  packageInfoCreateReq: PackageInfo;
  packageInfoCreateRes: PackageInfo;
  packageRegionListRes: RegionPackage[];
  packageRegionCreateReq: RegionCreateReq;
  packageRegionCreateRes: RegionPackage;
  packageRegionDetailRes: RegionPackage;
  packageRegionUpdateReq: RegionCreateReq;
  packageRegionUpdateRes: RegionPackage;
  packageSupplementListRes: PaginationSupplementPackage;
  packageSupplementDetailRes: SupplementPackage;
  packageSupplementCreateReq: SupplementPackage;
  packageSupplementCreateRes: SupplementPackage;
  packageSupplementUpdateReq: SupplementPackage;
  packageSupplementUpdateRes: SupplementPackage;
  packageTourListRes: PaginationTourPackage;
  packageTourDetailRes: TourPackage;
  packageTourCreateReq: TourPackage;
  packageTourCreateRes: TourPackage;
  packageTourUpdateReq: TourPackage;
  packageTourUpdateRes: TourPackage;
  packageTransferListRes: PaginationTransferPackage;
  packageTransferDetailRes: TransferInPackage;
  packageTransferCreateReq: TransferInPackage;
  packageTransferCreateRes: TransferInPackage;
  packageTransferUpdateReq: TransferInPackage;
  packageTransferUpdateRes: TransferInPackage;
  packageHotelFacilityListRes: PaginationHotelFacility;
  packageHotelFacilityDetailRes: HotelFacility;
  packageHotelFacilityCreateReq: HotelFacilityReq;
  packageHotelFacilityCreateRes: HotelFacility;
  packageHotelFacilityUpdateReq: HotelFacilityReq;
  packageHotelFacilityUpdateRes: HotelFacility;
  errorMessage: string;
  loading: boolean;
  failure: boolean;
}

const initialState: State = {
  packageHotelListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_LIST_RES)),
  packageHotelCreateReq: null,
  packageHotelCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_CREATE_RES)) || null,
  packageHotelDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_DETAIL_RES)) || null,
  packageHotelUpdateReq: null,
  packageHotelUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_UPDATE_RES)) || null,
  packageHotelListByNameRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_LIST_BY_NAME_RES)),
  packageHotelRoomListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_LIST_RES)),
  packageHotelRoomCreateReq: null,
  packageHotelRoomCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_CREATE_RES)) || null,
  packageHotelRoomDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_DETAIL_RES)) || null,
  packageHotelRoomUpdateReq: null,
  packageHotelRoomUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_UPDATE_RES)) || null,
  packageInfoListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_INFO_LIST_RES)),
  packageInfoDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_INFO_DETAIL_RES)) || null,
  packageInfoCreateReq: null,
  packageInfoCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_INFO_CREATE_RES)) || null,
  packageRegionListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_REGION_LIST_RES)) || [],
  packageRegionCreateReq: null,
  packageRegionCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_REGION_CREATE_RES)) || null,
  packageRegionDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_REGION_DETAIL_RES)) || null,
  packageRegionUpdateReq: null,
  packageRegionUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_REGION_UPDATE_RES)) || null,
  packageSupplementListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_LIST_RES)),
  packageSupplementDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_DETAIL_RES)) || null,
  packageSupplementCreateReq: null,
  packageSupplementCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_CREATE_RES)) || null,
  packageSupplementUpdateReq: null,
  packageSupplementUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_UPDATE_RES)) || null,
  packageTourListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TOUR_LIST_RES)),
  packageTourDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TOUR_DETAIL_RES)) || null,
  packageTourCreateReq: null,
  packageTourCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TOUR_CREATE_RES)) || null,
  packageTourUpdateReq: null,
  packageTourUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TOUR_UPDATE_RES)) || null,
  packageTransferListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TRANSFER_LIST_RES)),
  packageTransferDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TRANSFER_DETAIL_RES)) || null,
  packageTransferCreateReq: null,
  packageTransferCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TRANSFER_CREATE_RES)) || null,
  packageTransferUpdateReq: null,
  packageTransferUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_TRANSFER_UPDATE_RES)) || null,
  packageHotelFacilityListRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_LIST_RES)),
  packageHotelFacilityDetailRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_DETAIL_RES)) || null,
  packageHotelFacilityCreateReq: null,
  packageHotelFacilityCreateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_CREATE_RES)) || null,
  packageHotelFacilityUpdateReq: null,
  packageHotelFacilityUpdateRes: JSON.parse(sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_UPDATE_RES)) || null,
  errorMessage: null,
  loading: false,
  failure: false
};

export function providerPackagesReducer(
  state: State = initialState,
  action: ProviderPackagesActions.ProviderPackagesActions
) {
  switch (action.type) {
    case ProviderPackagesActions.HANDLE_FAIL:
      return {
        ...state,
        packageHotelRoomListRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_START:
      return {
        ...state,
        loading: true,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_SUCCESS:
      return {
        ...state,
        packageHotelListRes: Object.assign({},action.payload),
        errorMessage: null,
        loading: false,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_FAIL:
      return {
        ...state,
        packageHotelListRes: null,
        errorMessage: action.payload,
        loading: false,
        failure: true
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_START:
      return {
        ...state,
        loading: true,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_SUCCESS:
      return {
        ...state,
        errorMessage: null,
        loading: false,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_START:
      return {
        ...state,
        packageHotelCreateReq: Object.assign({}, action.payload.packageHotelCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_SUCCESS:
      return {
        ...state,
        packageHotelCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_FAIL:
      return {
        ...state,
        packageHotelCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_DETAIL_START:
      return {
        ...state,
        packageHotelDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_DETAIL_SUCCESS:
      return {
        ...state,
        packageHotelDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_DETAIL_FAIL:
      return {
        ...state,
        packageHotelDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_START:
      return {
        ...state,
        packageHotelUpdateReq: Object.assign({}, action.payload.packageHotelUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_SUCCESS:
      return {
        ...state,
        packageHotelUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_BY_NAME_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_BY_NAME_SUCCESS:
      return {
        ...state,
        packageHotelListByNameRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_BY_NAME_FAIL:
      return {
        ...state,
        packageHotelListByNameRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case  ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_LIST_SUCCESS:
      return {
        ...state,
        packageHotelRoomListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_LIST_FAIL:
      return {
        ...state,
        packageHotelRoomListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_ROOM_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_ROOM_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_ROOM_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_ROOM_START:
      return {
        ...state,
        packageHotelRoomCreateReq: Object.assign({}, action.payload.packageHotelRoomCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_ROOM_SUCCESS:
      return {
        ...state,
        packageHotelRoomCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_ROOM_FAIL:
      return {
        ...state,
        packageHotelRoomCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_DETAIL_START:
      return {
        ...state,
        packageHotelRoomDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_DETAIL_SUCCESS:
      return {
        ...state,
        packageHotelRoomDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_DETAIL_FAIL:
      return {
        ...state,
        packageHotelRoomDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_ROOM_START:
      return {
        ...state,
        packageHotelRoomUpdateReq: Object.assign({}, action.payload.packHotelRoomReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_ROOM_SUCCESS:
      return {
        ...state,
        packageHotelRoomUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_ROOM_FAIL:
      return {
        ...state,
        packageHotelRoomUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_INFO_LIST_START:
      return {
       ...state,
       loading: true,
       errorMessage: null,
       failure: false
      }
    case ProviderPackagesActions.GET_PACKAGE_INFO_LIST_SUCCESS:
      return {
        ...state,
        packageInfoListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_INFO_LIST_FAIL:
      return {
        ...state,
        packageInfoListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_INFO_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_INFO_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_LIST_SUCCESS:
      return {
        ...state,
        packageRegionListRes: [...action.payload],
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_LIST_FAIL:
      return {
        ...state,
        packageRegionListRes: [],
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_DETAIL_START:
      return {
        ...state,
        packageRegionDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_DETAIL_SUCCESS:
      return {
        ...state,
        packageRegionDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_REGION_DETAIL_FAIL:
      return {
        ...state,
        packageRegionDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_REGION_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_REGION_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_REGION_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_REGION_START:
      return {
        ...state,
        packageRegionCreateReq: Object.assign({}, action.payload.packageRegionCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_REGION_SUCCESS:
      return {
        ...state,
        packageRegionCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_REGION_FAIL:
      return {
        ...state,
        packageRegionCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_REGION_START:
      return {
        ...state,
        packageRegionUpdateReq: Object.assign({}, action.payload.packageRegionUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_REGION_SUCCESS:
      return {
        ...state,
        packageRegionUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_REGION_FAIL:
      return {
        ...state,
        packageRegionUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_LIST_SUCCESS:
      return {
        ...state,
        packageSupplementListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_LIST_FAIL:
      return {
        ...state,
        packageSupplementListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_SUPPLEMENT_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_SUPPLEMENT_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_SUPPLEMENT_START:
      return {
        ...state,
        packageSupplementCreateReq: Object.assign({}, action.payload.packageSupplementCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        packageSupplementCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_SUPPLEMENT_FAIL:
      return {
        ...state,
        packageSupplementCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_DETAIL_START:
      return {
        ...state,
        packageSupplementDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_DETAIL_SUCCESS:
      return {
        ...state,
        packageSupplementDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_DETAIL_FAIL:
      return {
        ...state,
        packageSupplementDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_SUPPLEMENT_START:
      return {
        ...state,
        packageSupplementUpdateReq: Object.assign({}, action.payload.packageSupplementUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_SUPPLEMENT_SUCCESS:
      return {
        ...state,
        packageSupplementUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_SUPPLEMENT_FAIL:
      return {
        ...state,
        packageSupplementUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      }
    case ProviderPackagesActions.GET_PACKAGE_TOUR_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TOUR_LIST_SUCCESS:
      return {
        ...state,
        packageTourListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TOUR_LIST_FAIL:
      return {
        ...state,
        packageTourListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TOUR_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TOUR_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TOUR_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TOUR_START:
      return {
        ...state,
        packageTourCreateReq: Object.assign({}, action.payload.packageTourCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TOUR_SUCCESS:
      return {
        ...state,
        packageTourCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TOUR_FAIL:
      return {
        ...state,
        packageTourCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_TOUR_DETAIL_START:
      return {
        ...state,
        packageTourDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TOUR_DETAIL_SUCCESS:
      return {
        ...state,
        packageTourDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TOUR_DETAIL_FAIL:
      return {
        ...state,
        packageTourDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_TOUR_START:
      return {
        ...state,
        packageTourUpdateReq: Object.assign({}, action.payload.packageTourUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_TOUR_SUCCESS:
      return {
        ...state,
        packageTourUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_TOUR_FAIL:
      return {
        ...state,
        packageTourUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      }
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_LIST_SUCCESS:
      return {
        ...state,
        packageTransferListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_LIST_FAIL:
      return {
        ...state,
        packageTransferListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TRANSFER_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TRANSFER_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_TRANSFER_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TRANSFER_START:
      return {
        ...state,
        packageTransferCreateReq: Object.assign({}, action.payload.packageTransferCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TRANSFER_SUCCESS:
      return {
        ...state,
        packageTransferCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_TRANSFER_FAIL:
      return {
        ...state,
        packageTransferCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_DETAIL_START:
      return {
        ...state,
        packageTransferDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_DETAIL_SUCCESS:
      return {
        ...state,
        packageTransferDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_TRANSFER_DETAIL_FAIL:
      return {
        ...state,
        packageTransferDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_TRANSFER_START:
      return {
        ...state,
        packageTransferUpdateReq: Object.assign({}, action.payload.packageTransferUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_TRANSFER_SUCCESS:
      return {
        ...state,
        packageTransferUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_TRANSFER_FAIL:
      return {
        ...state,
        packageTransferUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      }
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_LIST_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        packageHotelFacilityListRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_LIST_FAIL:
      return {
        ...state,
        packageHotelFacilityListRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_FACILITY_START:
      return {
        ...state,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_FACILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_FACILITY_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_FACILITY_START:
      return {
        ...state,
        packageHotelFacilityCreateReq: Object.assign({}, action.payload.packageHotelFacilityCreateReq),
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_FACILITY_SUCCESS:
      return {
        ...state,
        packageHotelFacilityCreateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.CREATE_PACKAGE_HOTEL_FACILITY_FAIL:
      return {
        ...state,
        packageHotelFacilityCreateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_DETAIL_START:
      return {
        ...state,
        packageHotelFacilityDetailRes: null,
        loading: true,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_DETAIL_SUCCESS:
      return {
        ...state,
        packageHotelFacilityDetailRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      };
    case ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_DETAIL_FAIL:
      return {
        ...state,
        packageHotelFacilityDetailRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      };
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_FACILITY_START:
      return {
        ...state,
        packageHotelFacilityUpdateReq: Object.assign({}, action.payload.packageHotelFacilityUpdateReq),
        loading: true,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_FACILITY_SUCCESS:
      return {
        ...state,
        packageHotelFacilityUpdateRes: Object.assign({}, action.payload),
        loading: false,
        errorMessage: null,
        failure: false
      }
    case ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_FACILITY_FAIL:
      return {
        ...state,
        packageHotelFacilityUpdateRes: null,
        loading: false,
        errorMessage: action.payload,
        failure: true
      }
    default:
      return state;
  }
}
