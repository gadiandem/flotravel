import {Action} from '@ngrx/store';
import {HotelPackage} from '../../../model/packages/provider/hotel-package';
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
import { Pageable } from 'src/app/model/packages/provider/pagination/pageable';
import { PaginationPackageInfo } from 'src/app/model/packages/provider/pagination/pagination-package-info';
import { PaginationHotelRoom } from 'src/app/model/packages/provider/pagination/pagination-hotel-room';
import { PaginationSupplementPackage } from 'src/app/model/packages/provider/pagination/pagination-supplement-package';
import { PaginationTransferPackage } from 'src/app/model/packages/provider/pagination/pagination-transfer-package';
import { PaginationTourPackage } from 'src/app/model/packages/provider/pagination/pagination-tour-package';
import { PaginationHotelFacility } from 'src/app/model/packages/provider/pagination/pagination-hotel-facitities';

export const HANDLE_FAIL = '[Package_Provider] HANDLE_FAIL';
export const GET_PACKAGE_HOTEL_LIST_START = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_START';
export const GET_PACKAGE_HOTEL_LIST_SUCCESS = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_SUCCESS';
export const GET_PACKAGE_HOTEL_LIST_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_FAIL';
export const REMOVE_PACKAGE_HOTEL_START = '[Package_Provider] REMOVE_PACKAGE_HOTEL_START';
export const REMOVE_PACKAGE_HOTEL_SUCCESS = '[Package_Provider] REMOVE_PACKAGE_HOTEL_SUCCESS';
export const REMOVE_PACKAGE_HOTEL_FAIL = '[Package_Provider] REMOVE_PACKAGE_HOTEL_FAIL';
export const CREATE_PACKAGE_HOTEL_START = '[Package_Provider] CREATE_PACKAGE_HOTEL_START';
export const CREATE_PACKAGE_HOTEL_SUCCESS = '[Package_Provider] CREATE_PACKAGE_HOTEL_SUCCESS';
export const CREATE_PACKAGE_HOTEL_FAIL = '[Package_Provider] CREATE_PACKAGE_HOTEL_FAIL';
export const GET_PACKAGE_HOTEL_DETAIL_START = '[Package_Provider] GET_PACKAGE_HOTEL_DETAIL_START';
export const GET_PACKAGE_HOTEL_DETAIL_SUCCESS = '[Package_Provider] GET_PACKAGE_HOTEL_DETAIL_SUCCESS';
export const GET_PACKAGE_HOTEL_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_DETAIL_FAIL';
export const UPDATE_PACKAGE_HOTEL_START = '[Package_Provider] UPDATE_PACKAGE_HOTEL_START';
export const UPDATE_PACKAGE_HOTEL_SUCCESS = '[Package_Provider] UPDATE_PACKAGE_HOTEL_SUCCESS';
export const UPDATE_PACKAGE_HOTEL_FAIL = '[Package_Provider] UPDATE_PACKAGE_HOTEL_FAIL';
export const GET_PACKAGE_HOTEL_LIST_BY_NAME_START = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_BY_NAME_START';
export const GET_PACKAGE_HOTEL_LIST_BY_NAME_SUCCESS = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_BY_NAME_SUCCESS';
export const GET_PACKAGE_HOTEL_LIST_BY_NAME_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_LIST_BY_NAME_FAIL';
export const GET_PACKAGE_HOTEL_ROOM_LIST_START = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_LIST_START';
export const GET_PACKAGE_HOTEL_ROOM_LIST_SUCCESS = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_LIST_SUCCESS';
export const GET_PACKAGE_HOTEL_ROOM_LIST_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_LIST_FAIL';
export const REMOVE_PACKAGE_HOTEL_ROOM_START = '[Package_Provider] REMOVE_PACKAGE_HOTEL_ROOM_START';
export const REMOVE_PACKAGE_HOTEL_ROOM_SUCCESS = '[Package_Provider] REMOVE_PACKAGE_HOTEL_ROOM_SUCCESS';
export const REMOVE_PACKAGE_HOTEL_ROOM_FAIL = '[Package_Provider] REMOVE_PACKAGE_HOTEL_ROOM_FAIL';
export const CREATE_PACKAGE_HOTEL_ROOM_START = '[Package_Provider] CREATE_PACKAGE_HOTEL_ROOM_START';
export const CREATE_PACKAGE_HOTEL_ROOM_SUCCESS = '[Package_Provider] CREATE_PACKAGE_HOTEL_ROOM_SUCCESS';
export const CREATE_PACKAGE_HOTEL_ROOM_FAIL = '[Package_Provider] CREATE_PACKAGE_HOTEL_ROOM_FAIL';
export const GET_PACKAGE_HOTEL_ROOM_DETAIL_START = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_DETAIL_START';
export const GET_PACKAGE_HOTEL_ROOM_DETAIL_SUCCESS = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_DETAIL_SUCCESS';
export const GET_PACKAGE_HOTEL_ROOM_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_ROOM_DETAIL_FAIL';
export const UPDATE_PACKAGE_HOTEL_ROOM_START = '[Package_Provider] UPDATE_PACKAGE_HOTEL_ROOM_START';
export const UPDATE_PACKAGE_HOTEL_ROOM_SUCCESS = '[Package_Provider] UPDATE_PACKAGE_HOTEL_ROOM_SUCCESS';
export const UPDATE_PACKAGE_HOTEL_ROOM_FAIL = '[Package_Provider] UPDATE_PACKAGE_HOTEL_ROOM_FAIL';
export const GET_PACKAGE_INFO_LIST_START = '[Package_Provider] GET_PACKAGE_INFO_LIST_START';
export const GET_PACKAGE_INFO_LIST_SUCCESS = '[Package_Provider] GET_PACKAGE_INFO_LIST_SUCCESS';
export const GET_PACKAGE_INFO_LIST_FAIL = '[Package_Provider] GET_PACKAGE_INFO_LIST_FAIL';
export const GET_PACKAGE_INFO_DETAIL_START = '[Package_Provider] GET_PACKAGE_INFO_DETAIL_START';
export const GET_PACKAGE_INFO_DETAIL_SUCCESS = '[Package_Provider] GET_PACKAGE_INFO_DETAIL_SUCCESS';
export const GET_PACKAGE_INFO_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_INFO_DETAIL_FAIL';
export const CREATE_PACKAGE_INFO_START = '[Package_Provider] CREATE_PACKAGE_INFO_START';
export const CREATE_PACKAGE_INFO_SUCCESS = '[Package_Provider] CREATE_PACKAGE_INFO_SUCCESS';
export const CREATE_PACKAGE_INFO_FAIL = '[Package_Provider] CREATE_PACKAGE_INFO_FAIL';
export const REMOVE_PACKAGE_INFO_START = '[Package_Provider] REMOVE_PACKAGE_INFO_START';
export const REMOVE_PACKAGE_INFO_SUCCESS = '[Package_Provider] REMOVE_PACKAGE_INFO_SUCCESS';
export const REMOVE_PACKAGE_INFO_FAIL = '[Package_Provider] REMOVE_PACKAGE_INFO_FAIL';
export const GET_PACKAGE_REGION_LIST_START = '[Package_Provider] GET_PACKAGE_REGION_LIST_START';
export const GET_PACKAGE_REGION_LIST_SUCCESS = '[Package_Provider] GET_PACKAGE_REGION_LIST_SUCCESS';
export const GET_PACKAGE_REGION_LIST_FAIL = '[Package_Provider] GET_PACKAGE_REGION_LIST_FAIL';
export const GET_PACKAGE_REGION_DETAIL_START = '[Package_Provider] GET_PACKAGE_REGION_DETAIL_START';
export const GET_PACKAGE_REGION_DETAIL_SUCCESS = '[Package_Provider] GET_PACKAGE_REGION_DETAIL_SUCCESS';
export const GET_PACKAGE_REGION_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_REGION_DETAIL_FAIL';
export const REMOVE_PACKAGE_REGION_START = '[Package_Provider] REMOVE_PACKAGE_REGION_START';
export const REMOVE_PACKAGE_REGION_SUCCESS = '[Package_Provider] REMOVE_PACKAGE_REGION_SUCCESS';
export const REMOVE_PACKAGE_REGION_FAIL = '[Package_Provider] REMOVE_PACKAGE_REGION_FAIL';
export const CREATE_PACKAGE_REGION_START = '[Package_Provider] CREATE_PACKAGE_REGION_START';
export const CREATE_PACKAGE_REGION_SUCCESS = '[Package_Provider] CREATE_PACKAGE_REGION_SUCCESS';
export const CREATE_PACKAGE_REGION_FAIL = '[Package_Provider] CREATE_PACKAGE_REGION_FAIL';
export const UPDATE_PACKAGE_REGION_START = '[Package_Provider] UPDATE_PACKAGE_REGION_START';
export const UPDATE_PACKAGE_REGION_SUCCESS = '[Package_Provider] UPDATE_PACKAGE_REGION_SUCCESS';
export const UPDATE_PACKAGE_REGION_FAIL = '[Package_Provider] UPDATE_PACKAGE_REGION_FAIL';
export const GET_PACKAGE_SUPPLEMENT_LIST_START = '[Package_Provider] GET_PACKAGE_SUPPLEMENT_LIST_START';
export const GET_PACKAGE_SUPPLEMENT_LIST_SUCCESS = '[Package_Provide] GET_PACKAGE_SUPPLEMENT_LIST_SUCCESS';
export const GET_PACKAGE_SUPPLEMENT_LIST_FAIL = '[Package_Provider] GET_PACKAGE_SUPPLEMENT_LIST_FAIL';
export const GET_PACKAGE_SUPPLEMENT_DETAIL_START = '[Package_Provider] GET_PACKAGE_SUPPLEMENT_DETAIL_START';
export const GET_PACKAGE_SUPPLEMENT_DETAIL_SUCCESS = '[Package_Provide] GET_PACKAGE_SUPPLEMENT_DETAIL_SUCCESS';
export const GET_PACKAGE_SUPPLEMENT_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_SUPPLEMENT_DETAIL_FAIL';
export const CREATE_PACKAGE_SUPPLEMENT_START = '[Package_Provider] CREATE_PACKAGE_SUPPLEMENT_START';
export const CREATE_PACKAGE_SUPPLEMENT_SUCCESS = '[Package_Provide] CREATE_PACKAGE_SUPPLEMENT_SUCCESS';
export const CREATE_PACKAGE_SUPPLEMENT_FAIL = '[Package_Provider] CREATE_PACKAGE_SUPPLEMENT_FAIL';
export const REMOVE_PACKAGE_SUPPLEMENT_START = '[Package_Provider] REMOVE_PACKAGE_SUPPLEMENT_START';
export const REMOVE_PACKAGE_SUPPLEMENT_SUCCESS = '[Package_Provide] REMOVE_PACKAGE_SUPPLEMENT_SUCCESS';
export const REMOVE_PACKAGE_SUPPLEMENT_FAIL = '[Package_Provider] REMOVE_PACKAGE_SUPPLEMENT_FAIL';
export const UPDATE_PACKAGE_SUPPLEMENT_START = '[Package_Provider] UPDATE_PACKAGE_SUPPLEMENT_START';
export const UPDATE_PACKAGE_SUPPLEMENT_SUCCESS = '[Package_Provide] UPDATE_PACKAGE_SUPPLEMENT_SUCCESS';
export const UPDATE_PACKAGE_SUPPLEMENT_FAIL = '[Package_Provider] UPDATE_PACKAGE_SUPPLEMENT_FAIL';
export const GET_PACKAGE_TOUR_LIST_START = '[Package_Provider] GET_PACKAGE_TOUR_LIST_START';
export const GET_PACKAGE_TOUR_LIST_SUCCESS = '[Package_Provide] GET_PACKAGE_TOUR_LIST_SUCCESS';
export const GET_PACKAGE_TOUR_LIST_FAIL = '[Package_Provider] GET_PACKAGE_TOUR_LIST_FAIL';
export const GET_PACKAGE_TOUR_DETAIL_START = '[Package_Provider] GET_PACKAGE_TOUR_DETAIL_START';
export const GET_PACKAGE_TOUR_DETAIL_SUCCESS = '[Package_Provide] GET_PACKAGE_TOUR_DETAIL_SUCCESS';
export const GET_PACKAGE_TOUR_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_TOUR_DETAIL_FAIL';
export const CREATE_PACKAGE_TOUR_START = '[Package_Provider] CREATE_PACKAGE_TOUR_START';
export const CREATE_PACKAGE_TOUR_SUCCESS = '[Package_Provide] CREATE_PACKAGE_TOUR_SUCCESS';
export const CREATE_PACKAGE_TOUR_FAIL = '[Package_Provider] CREATE_PACKAGE_TOUR_FAIL';
export const REMOVE_PACKAGE_TOUR_START = '[Package_Provider] REMOVE_PACKAGE_TOUR_START';
export const REMOVE_PACKAGE_TOUR_SUCCESS = '[Package_Provide] REMOVE_PACKAGE_TOUR_SUCCESS';
export const REMOVE_PACKAGE_TOUR_FAIL = '[Package_Provider] REMOVE_PACKAGE_TOUR_FAIL';
export const UPDATE_PACKAGE_TOUR_START = '[Package_Provider] UPDATE_PACKAGE_TOUR_START';
export const UPDATE_PACKAGE_TOUR_SUCCESS = '[Package_Provide] UPDATE_PACKAGE_TOUR_SUCCESS';
export const UPDATE_PACKAGE_TOUR_FAIL = '[Package_Provider] UPDATE_PACKAGE_TOUR_FAIL';
export const GET_PACKAGE_TRANSFER_LIST_START = '[Package_Provider] GET_PACKAGE_TRANSFER_LIST_START';
export const GET_PACKAGE_TRANSFER_LIST_SUCCESS = '[Package_Provide] GET_PACKAGE_TRANSFER_LIST_SUCCESS';
export const GET_PACKAGE_TRANSFER_LIST_FAIL = '[Package_Provider] GET_PACKAGE_TRANSFER_LIST_FAIL';
export const GET_PACKAGE_TRANSFER_DETAIL_START = '[Package_Provider] GET_PACKAGE_TRANSFER_DETAIL_START';
export const GET_PACKAGE_TRANSFER_DETAIL_SUCCESS = '[Package_Provide] GET_PACKAGE_TRANSFER_DETAIL_SUCCESS';
export const GET_PACKAGE_TRANSFER_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_TRANSFER_DETAIL_FAIL';
export const CREATE_PACKAGE_TRANSFER_START = '[Package_Provider] CREATE_PACKAGE_TRANSFER_START';
export const CREATE_PACKAGE_TRANSFER_SUCCESS = '[Package_Provide] CREATE_PACKAGE_TRANSFER_SUCCESS';
export const CREATE_PACKAGE_TRANSFER_FAIL = '[Package_Provider] CREATE_PACKAGE_TRANSFER_FAIL';
export const REMOVE_PACKAGE_TRANSFER_START = '[Package_Provider] REMOVE_PACKAGE_TRANSFER_START';
export const REMOVE_PACKAGE_TRANSFER_SUCCESS = '[Package_Provide] REMOVE_PACKAGE_TRANSFER_SUCCESS';
export const REMOVE_PACKAGE_TRANSFER_FAIL = '[Package_Provider] REMOVE_PACKAGE_TRANSFER_FAIL';
export const UPDATE_PACKAGE_TRANSFER_START = '[Package_Provider] UPDATE_PACKAGE_TRANSFER_START';
export const UPDATE_PACKAGE_TRANSFER_SUCCESS = '[Package_Provide] UPDATE_PACKAGE_TRANSFER_SUCCESS';
export const UPDATE_PACKAGE_TRANSFER_FAIL = '[Package_Provider] UPDATE_PACKAGE_TRANSFER_FAIL';
export const GET_PACKAGE_HOTEL_FACILITY_LIST_START = '[Package_Provider] GET_PACKAGE_HOTEL_FACILITY_LIST_START';
export const GET_PACKAGE_HOTEL_FACILITY_LIST_SUCCESS = '[Package_Provide] GET_PACKAGE_HOTEL_FACILITY_LIST_SUCCESS';
export const GET_PACKAGE_HOTEL_FACILITY_LIST_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_FACILITY_LIST_FAIL';
export const GET_PACKAGE_HOTEL_FACILITY_DETAIL_START = '[Package_Provider] GET_PACKAGE_HOTEL_FACILITY_DETAIL_START';
export const GET_PACKAGE_HOTEL_FACILITY_DETAIL_SUCCESS = '[Package_Provide] GET_PACKAGE_HOTEL_FACILITY_DETAIL_SUCCESS';
export const GET_PACKAGE_HOTEL_FACILITY_DETAIL_FAIL = '[Package_Provider] GET_PACKAGE_HOTEL_FACILITY_DETAIL_FAIL';
export const CREATE_PACKAGE_HOTEL_FACILITY_START = '[Package_Provider] CREATE_PACKAGE_HOTEL_FACILITY_START';
export const CREATE_PACKAGE_HOTEL_FACILITY_SUCCESS = '[Package_Provide] CREATE_PACKAGE_HOTEL_FACILITY_SUCCESS';
export const CREATE_PACKAGE_HOTEL_FACILITY_FAIL = '[Package_Provider] CREATE_PACKAGE_HOTEL_FACILITY_FAIL';
export const REMOVE_PACKAGE_HOTEL_FACILITY_START = '[Package_Provider] REMOVE_PACKAGE_HOTEL_FACILITY_START';
export const REMOVE_PACKAGE_HOTEL_FACILITY_SUCCESS = '[Package_Provide] REMOVE_PACKAGE_HOTEL_FACILITY_SUCCESS';
export const REMOVE_PACKAGE_HOTEL_FACILITY_FAIL = '[Package_Provider] REMOVE_PACKAGE_HOTEL_FACILITY_FAIL';
export const UPDATE_PACKAGE_HOTEL_FACILITY_START = '[Package_Provider] UPDATE_PACKAGE_HOTEL_FACILITY_START';
export const UPDATE_PACKAGE_HOTEL_FACILITY_SUCCESS = '[Package_Provide] UPDATE_PACKAGE_HOTEL_FACILITY_SUCCESS';
export const UPDATE_PACKAGE_HOTEL_FACILITY_FAIL = '[Package_Provider] UPDATE_PACKAGE_HOTEL_FACILITY_FAIL';

export class HandleFail implements Action {
  readonly type = HANDLE_FAIL;
  constructor(public payload: string) {
  }
}
export class GetPackageHotelListStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_START;
  constructor(public payload: { data: Pageable }) {}
}

export class GetPackageHotelListSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_SUCCESS;
  constructor(public payload: PaginationHotelPackage) {}
}

export class GetPackageHotelListFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_FAIL;
  constructor(public payload: string) {}
}

export class RemovePackageHotelStart implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_START;
  constructor(public payload: {packageHotelId: string}) {
  }
}

export class RemovePackageHotelSuccess implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_SUCCESS;
  constructor() {
  }
}

export class RemovePackageHotelFail implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageHotelStart implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_START;
  constructor(public payload: {packageHotelCreateReq: HotelPackage}) {
  }
}

export class CreatePackageHotelSuccess implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_SUCCESS;
  constructor(public payload: HotelPackage) {
  }
}

export class CreatePackageHotelFail implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageHotelDetailStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_DETAIL_START;
  constructor(public payload: {packageHotelId: string}) {
  }
}

export class GetPackageHotelDetailSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_DETAIL_SUCCESS;
  constructor(public payload: HotelPackage) {
  }
}

export class GetPackageHotelDetailFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_DETAIL_FAIL;
  constructor(public payload: string) {

  }
}

export class UpdatePackageHotelStart implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_START;
  constructor(public payload: {packageHotelId: string, packageHotelUpdateReq: HotelPackage}) {
  }
}

export class UpdatePackageHotelSuccess implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_SUCCESS;
  constructor(public payload: HotelPackage) {
  }
}

export class UpdatePackageHotelFail implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_FAIL;
  constructor (public payload: string) {

  }
}

export class GetPackageHotelListByNameStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_BY_NAME_START;
  constructor(public payload: {packageHotelName: string}) {
  }
}

export class GetPackageHotelListByNameSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_BY_NAME_SUCCESS;
  constructor(public payload: PaginationHotelPackage) {
  }
}

export class GetPackageHotelListByNameFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_LIST_BY_NAME_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageHotelRoomListStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_LIST_START;
  constructor(public payload: {packageHotelId: string, page: Pageable}) {
  }
}

export class GetPackageHotelRoomListSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_LIST_SUCCESS;
  constructor (public payload: PaginationHotelRoom) {

  }
}

export class GetPackageHotelRoomListFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_LIST_FAIL;
  constructor (public payload: string) {

  }
}

export class RemovePackageHotelRoomStart implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_ROOM_START;
  constructor(public payload: {packageHotelRoomId: string}) {
  }
}

export class RemovePackageHotelRoomSuccess implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_ROOM_SUCCESS;
  constructor() {
  }
}

export class RemovePackageHotelRoomFail implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_ROOM_FAIL;
  constructor(public payload : string) {
  }
}

export class CreatePackageHotelRoomStart implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_ROOM_START;
  constructor(public payload: {packageHotelRoomCreateReq: HotelRoomPackage}) {
  }
}

export class CreatePackageHotelRoomSuccess implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_ROOM_SUCCESS;
  constructor(public payload: HotelRoomPackage) {
  }
}

export class CreatePackageHotelRoomFail implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_ROOM_FAIL;
  constructor(public payload: string) {

  }
}

export class GetPackageHotelRoomDetailStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_DETAIL_START;
  constructor (public payload: {packageHotelRoomId: string}) {

  }
}

export class GetPackageHotelRoomDetailSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_DETAIL_SUCCESS;
  constructor(public payload: HotelRoomPackage) {
  }
}

export class GetPackageHotelRoomDetailFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_ROOM_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageHotelRoomStart implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_ROOM_START;
  constructor(public payload: {packHotelRoomReq: HotelRoomPackage, packageHotelRoomId: string}) {
  }
}

export class UpdatePackageHotelRoomSuccess implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_ROOM_SUCCESS;
  constructor(public payload: HotelRoomPackage) {
  }
}

export class UpdatePackageHotelRoomFail implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_ROOM_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageInfoListStart implements Action {
  readonly type = GET_PACKAGE_INFO_LIST_START;
  constructor(public payload: { data: Pageable }) {
  }
}

export class GetPackageInfoListSuccess implements Action {
  readonly type = GET_PACKAGE_INFO_LIST_SUCCESS;
  constructor(public payload: PaginationPackageInfo) {
  }
}

export class GetPackageInfoListFail implements Action {
  readonly type = GET_PACKAGE_INFO_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageInfoDetailStart implements Action {
  readonly type = GET_PACKAGE_INFO_DETAIL_START;
  constructor(public payload: {packageInfoId: string}) {
  }
}

export class GetPackageInfoDetailSuccess implements Action {
  readonly type = GET_PACKAGE_INFO_DETAIL_SUCCESS;
  constructor(public payload: PackageInfo) {
  }
}

export class GetPackageInfoDetailFail implements Action {
  readonly type = GET_PACKAGE_INFO_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageInfoStart implements Action {
  readonly type = REMOVE_PACKAGE_INFO_START;
  constructor(public payload: {packageInfoId: string}) {
  }
}

export class RemovePackageInfoSuccess implements Action {
  readonly type = REMOVE_PACKAGE_INFO_SUCCESS;
  constructor() {
  }
}

export class RemovePackageInfoFail implements Action {
  readonly type = REMOVE_PACKAGE_INFO_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageInfoStart implements Action {
  readonly type = CREATE_PACKAGE_INFO_START;
  constructor(public payload: {packageInfoReq: PackageInfo}) {
  }
}

export class CreatePackageInfoSuccess implements Action {
  readonly type = CREATE_PACKAGE_INFO_SUCCESS;
  constructor(public payload: PackageInfo) {
  }
}

export class CreatePackageInfoFail implements Action {
  readonly type = CREATE_PACKAGE_INFO_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageRegionListStart implements Action {
  readonly type = GET_PACKAGE_REGION_LIST_START;
  constructor() {
  }
}

export class GetPackageRegionListSuccess implements Action {
  readonly type = GET_PACKAGE_REGION_LIST_SUCCESS;
  constructor(public payload: RegionPackage[]) {
  }
}

export class GetPackageRegionListFail implements Action {
  readonly type = GET_PACKAGE_REGION_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageRegionDetailStart implements Action {
  readonly type = GET_PACKAGE_REGION_DETAIL_START;
  constructor(public payload: {packageRegionId: string}) {
  }
}

export class GetPackageRegionDetailSuccess implements Action {
  readonly type = GET_PACKAGE_REGION_DETAIL_SUCCESS;
  constructor(public payload: RegionPackage) {
  }
}

export class GetPackageRegionDetailFail implements Action {
  readonly type = GET_PACKAGE_REGION_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageRegionStart implements Action {
  readonly type = REMOVE_PACKAGE_REGION_START;
  constructor(public payload: {packageRegionId: string}) {
  }
}

export class RemovePackageRegionSuccess implements Action {
  readonly type = REMOVE_PACKAGE_REGION_SUCCESS;
  constructor() {
  }
}

export class RemovePackageRegionFail implements Action {
  readonly type = REMOVE_PACKAGE_REGION_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageRegionStart implements Action {
  readonly type = CREATE_PACKAGE_REGION_START;
  constructor(public payload: {packageRegionCreateReq: RegionCreateReq}) {
  }
}

export class CreatePackageRegionSuccess implements Action {
  readonly type = CREATE_PACKAGE_REGION_SUCCESS;
  constructor(public payload: RegionPackage) {
  }
}

export class CreatePackageRegionFail implements Action {
  readonly type = CREATE_PACKAGE_REGION_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageRegionStart implements Action {
  readonly type = UPDATE_PACKAGE_REGION_START;
  constructor(public payload: {packageRegionUpdateReq: RegionCreateReq, packageRegionId: string}) {
  }
}

export class UpdatePackageRegionSuccess implements Action {
  readonly type = UPDATE_PACKAGE_REGION_SUCCESS;
  constructor(public payload: RegionPackage) {
  }
}

export class UpdatePackageRegionFail implements Action {
  readonly type = UPDATE_PACKAGE_REGION_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageSupplementListStart implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_LIST_START;
  constructor(public payload: { data: Pageable}) {
  }
}

export class GetPackageSupplementListSuccess implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_LIST_SUCCESS;
  constructor(public payload: PaginationSupplementPackage) {
  }
}

export class GetPackageSupplementListFail implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageSupplementStart implements Action {
  readonly type = REMOVE_PACKAGE_SUPPLEMENT_START;
  constructor(public payload: {packageSupplementId: string}) {
  }
}

export class RemovePackageSupplementSuccess implements Action {
  readonly type = REMOVE_PACKAGE_SUPPLEMENT_SUCCESS;
  constructor() {
  }
}

export class RemovePackageSupplementFail implements Action {
  readonly type = REMOVE_PACKAGE_SUPPLEMENT_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageSupplementDetailStart implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_DETAIL_START;
  constructor(public payload: {packageSupplementId: string}) {
  }
}

export class GetPackageSupplementDetailSuccess implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_DETAIL_SUCCESS;
  constructor(public payload: SupplementPackage) {
  }
}

export class GetPackageSupplementDetailFail implements Action {
  readonly type = GET_PACKAGE_SUPPLEMENT_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageSupplementStart implements Action {
  readonly type = CREATE_PACKAGE_SUPPLEMENT_START;
  constructor(public payload: {packageSupplementCreateReq: SupplementPackage}) {
  }
}

export class CreatePackageSupplementSuccess implements Action {
  readonly type = CREATE_PACKAGE_SUPPLEMENT_SUCCESS;
  constructor(public payload: SupplementPackage) {
  }
}

export class CreatePackageSupplementFail implements Action {
  readonly type = CREATE_PACKAGE_SUPPLEMENT_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageSupplementStart implements Action {
  readonly type = UPDATE_PACKAGE_SUPPLEMENT_START;
  constructor(public payload: {packageSupplementId: string, packageSupplementUpdateReq: SupplementPackage}) {
  }
}

export class UpdatePackageSupplementSuccess implements Action {
  readonly type = UPDATE_PACKAGE_SUPPLEMENT_SUCCESS;
  constructor(public payload: SupplementPackage) {
  }
}

export class UpdatePackageSupplementFail implements Action {
  readonly type = UPDATE_PACKAGE_SUPPLEMENT_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageTourListStart implements Action {
  readonly type = GET_PACKAGE_TOUR_LIST_START;
  constructor(public payload: { data: Pageable }) {
  }
}

export class GetPackageTourListSuccess implements Action {
  readonly type = GET_PACKAGE_TOUR_LIST_SUCCESS;
  constructor(public payload: PaginationTourPackage) {
  }
}

export class GetPackageTourListFail implements Action {
  readonly type = GET_PACKAGE_TOUR_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageTourStart implements Action {
  readonly type = REMOVE_PACKAGE_TOUR_START;
  constructor(public payload: {packageTourId: string}) {
  }
}

export class RemovePackageTourSuccess implements Action {
  readonly type = REMOVE_PACKAGE_TOUR_SUCCESS;
  constructor() {
  }
}

export class RemovePackageTourFail implements Action {
  readonly type = REMOVE_PACKAGE_TOUR_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageTourDetailStart implements Action {
  readonly type = GET_PACKAGE_TOUR_DETAIL_START;
  constructor(public payload: {packageTourId: string}) {
  }
}

export class GetPackageTourDetailSuccess implements Action {
  readonly type = GET_PACKAGE_TOUR_DETAIL_SUCCESS;
  constructor(public payload: TourPackage) {
  }
}

export class GetPackageTourDetailFail implements Action {
  readonly type = GET_PACKAGE_TOUR_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageTourStart implements Action {
  readonly type = CREATE_PACKAGE_TOUR_START;
  constructor(public payload: {packageTourCreateReq: TourPackage}) {
  }
}

export class CreatePackageTourSuccess implements Action {
  readonly type = CREATE_PACKAGE_TOUR_SUCCESS;
  constructor(public payload: TourPackage) {
  }
}

export class CreatePackageTourFail implements Action {
  readonly type = CREATE_PACKAGE_TOUR_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageTourStart implements Action {
  readonly type = UPDATE_PACKAGE_TOUR_START;
  constructor(public payload: {packageTourId: string, packageTourUpdateReq: TourPackage}) {
  }
}

export class UpdatePackageTourSuccess implements Action {
  readonly type = UPDATE_PACKAGE_TOUR_SUCCESS;
  constructor(public payload: TourPackage) {
  }
}

export class UpdatePackageTourFail implements Action {
  readonly type = UPDATE_PACKAGE_TOUR_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageTransferListStart implements Action {
  readonly type = GET_PACKAGE_TRANSFER_LIST_START;
  constructor(public payload: { data: Pageable}) {
  }
}

export class GetPackageTransferListSuccess implements Action {
  readonly type = GET_PACKAGE_TRANSFER_LIST_SUCCESS;
  constructor(public payload: PaginationTransferPackage) {
  }
}

export class GetPackageTransferListFail implements Action {
  readonly type = GET_PACKAGE_TRANSFER_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageTransferStart implements Action {
  readonly type = REMOVE_PACKAGE_TRANSFER_START;
  constructor(public payload: {packageTransferId: string}) {
  }
}

export class RemovePackageTransferSuccess implements Action {
  readonly type = REMOVE_PACKAGE_TRANSFER_SUCCESS;
  constructor() {
  }
}

export class RemovePackageTransferFail implements Action {
  readonly type = REMOVE_PACKAGE_TRANSFER_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageTransferDetailStart implements Action {
  readonly type = GET_PACKAGE_TRANSFER_DETAIL_START;
  constructor(public payload: {packageTransferId: string}) {
  }
}

export class GetPackageTransferDetailSuccess implements Action {
  readonly type = GET_PACKAGE_TRANSFER_DETAIL_SUCCESS;
  constructor(public payload: TransferInPackage) {
  }
}

export class GetPackageTransferDetailFail implements Action {
  readonly type = GET_PACKAGE_TRANSFER_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageTransferStart implements Action {
  readonly type = CREATE_PACKAGE_TRANSFER_START;
  constructor(public payload: {packageTransferCreateReq: TransferInPackage}) {
  }
}

export class CreatePackageTransferSuccess implements Action {
  readonly type = CREATE_PACKAGE_TRANSFER_SUCCESS;
  constructor(public payload: TransferInPackage) {
  }
}

export class CreatePackageTransferFail implements Action {
  readonly type = CREATE_PACKAGE_TRANSFER_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageTransferStart implements Action {
  readonly type = UPDATE_PACKAGE_TRANSFER_START;
  constructor(public payload: {packageTransferId: string, packageTransferUpdateReq: TransferInPackage}) {
  }
}

export class UpdatePackageTransferSuccess implements Action {
  readonly type = UPDATE_PACKAGE_TRANSFER_SUCCESS;
  constructor(public payload: TransferInPackage) {
  }
}

export class UpdatePackageTransferFail implements Action {
  readonly type = UPDATE_PACKAGE_TRANSFER_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageHotelFacilityListStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_LIST_START;
  constructor(public payload: { data: Pageable }) {
  }
}

export class GetPackageHotelFacilityListSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_LIST_SUCCESS;
  constructor(public payload: PaginationHotelFacility) {
  }
}

export class GetPackageHotelFacilityListFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_LIST_FAIL;
  constructor(public payload: string) {
  }
}

export class RemovePackageHotelFacilityStart implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_FACILITY_START;
  constructor(public payload: {packageHotelFacilityId: string}) {
  }
}

export class RemovePackageHotelFacilitySuccess implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_FACILITY_SUCCESS;
  constructor() {
  }
}

export class RemovePackageHotelFacilityFail implements Action {
  readonly type = REMOVE_PACKAGE_HOTEL_FACILITY_FAIL;
  constructor(public payload: string) {
  }
}

export class GetPackageHotelFacilityDetailStart implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_DETAIL_START;
  constructor(public payload: {packageHotelFacilityId: string}) {
  }
}

export class GetPackageHotelFacilityDetailSuccess implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_DETAIL_SUCCESS;
  constructor(public payload: HotelFacility) {
  }
}

export class GetPackageHotelFacilityDetailFail implements Action {
  readonly type = GET_PACKAGE_HOTEL_FACILITY_DETAIL_FAIL;
  constructor(public payload: string) {
  }
}

export class CreatePackageHotelFacilityStart implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_FACILITY_START;
  constructor(public payload: {packageHotelFacilityCreateReq: HotelFacilityReq}) {
  }
}

export class CreatePackageHotelFacilitySuccess implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_FACILITY_SUCCESS;
  constructor(public payload: HotelFacility) {
  }
}

export class CreatePackageHotelFacilityFail implements Action {
  readonly type = CREATE_PACKAGE_HOTEL_FACILITY_FAIL;
  constructor(public payload: string) {
  }
}

export class UpdatePackageHotelFacilityStart implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_FACILITY_START;
  constructor(public payload: {packageHotelFacilityId: string, packageHotelFacilityUpdateReq: HotelFacilityReq}) {
  }
}

export class UpdatePackageHotelFacilitySuccess implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_FACILITY_SUCCESS;
  constructor(public payload: HotelFacility) {
  }
}

export class UpdatePackageHotelFacilityFail implements Action {
  readonly type = UPDATE_PACKAGE_HOTEL_FACILITY_FAIL;
  constructor(public payload: string) {
  }
}
export type ProviderPackagesActions =
  | HandleFail
  | GetPackageHotelListStart
  | GetPackageHotelListSuccess
  | GetPackageHotelListFail
  | RemovePackageHotelStart
  | RemovePackageHotelSuccess
  | RemovePackageHotelFail
  | CreatePackageHotelStart
  | CreatePackageHotelSuccess
  | CreatePackageHotelFail
  | GetPackageHotelDetailStart
  | GetPackageHotelDetailSuccess
  | GetPackageHotelDetailFail
  | UpdatePackageHotelStart
  | UpdatePackageHotelSuccess
  | UpdatePackageHotelFail
  | GetPackageHotelListByNameStart
  | GetPackageHotelListByNameSuccess
  | GetPackageHotelListByNameFail
  | GetPackageHotelRoomListStart
  | GetPackageHotelRoomListSuccess
  | GetPackageHotelRoomListFail
  | RemovePackageHotelRoomStart
  | RemovePackageHotelRoomSuccess
  | RemovePackageHotelRoomFail
  | CreatePackageHotelRoomStart
  | CreatePackageHotelRoomSuccess
  | CreatePackageHotelRoomFail
  | GetPackageHotelRoomDetailStart
  | GetPackageHotelRoomDetailSuccess
  | GetPackageHotelRoomDetailFail
  | UpdatePackageHotelRoomStart
  | UpdatePackageHotelRoomSuccess
  | UpdatePackageHotelRoomFail
  | GetPackageInfoListStart
  | GetPackageInfoListSuccess
  | GetPackageInfoListFail
  | GetPackageInfoDetailStart
  | GetPackageInfoDetailSuccess
  | GetPackageInfoDetailFail
  | RemovePackageInfoStart
  | RemovePackageInfoSuccess
  | RemovePackageInfoFail
  | CreatePackageInfoStart
  | CreatePackageInfoSuccess
  | CreatePackageInfoFail
  | GetPackageRegionListStart
  | GetPackageRegionListSuccess
  | GetPackageRegionListFail
  | GetPackageRegionDetailStart
  | GetPackageRegionDetailSuccess
  | GetPackageRegionDetailFail
  | RemovePackageRegionStart
  | RemovePackageRegionSuccess
  | RemovePackageRegionFail
  | CreatePackageRegionStart
  | CreatePackageRegionSuccess
  | CreatePackageRegionFail
  | UpdatePackageRegionStart
  | UpdatePackageRegionSuccess
  | UpdatePackageRegionFail
  | GetPackageSupplementListStart
  | GetPackageSupplementListSuccess
  | GetPackageSupplementListFail
  | GetPackageSupplementDetailStart
  | GetPackageSupplementDetailSuccess
  | GetPackageSupplementDetailFail
  | RemovePackageSupplementStart
  | RemovePackageSupplementSuccess
  | RemovePackageSupplementFail
  | CreatePackageSupplementStart
  | CreatePackageSupplementSuccess
  | CreatePackageSupplementFail
  | UpdatePackageSupplementStart
  | UpdatePackageSupplementSuccess
  | UpdatePackageSupplementFail
  | GetPackageTourListStart
  | GetPackageTourListSuccess
  | GetPackageTourListFail
  | GetPackageTourDetailStart
  | GetPackageTourDetailSuccess
  | GetPackageTourDetailFail
  | RemovePackageTourStart
  | RemovePackageTourSuccess
  | RemovePackageTourFail
  | CreatePackageTourStart
  | CreatePackageTourSuccess
  | CreatePackageTourFail
  | UpdatePackageTourStart
  | UpdatePackageTourSuccess
  | UpdatePackageTourFail
  | GetPackageTransferListStart
  | GetPackageTransferListSuccess
  | GetPackageTransferListFail
  | GetPackageTransferDetailStart
  | GetPackageTransferDetailSuccess
  | GetPackageTransferDetailFail
  | RemovePackageTransferStart
  | RemovePackageTransferSuccess
  | RemovePackageTransferFail
  | CreatePackageTransferStart
  | CreatePackageTransferSuccess
  | CreatePackageTransferFail
  | UpdatePackageTransferStart
  | UpdatePackageTransferSuccess
  | UpdatePackageTransferFail
  | GetPackageHotelFacilityListStart
  | GetPackageHotelFacilityListSuccess
  | GetPackageHotelFacilityListFail
  | GetPackageHotelFacilityDetailStart
  | GetPackageHotelFacilityDetailSuccess
  | GetPackageHotelFacilityDetailFail
  | RemovePackageHotelFacilityStart
  | RemovePackageHotelFacilitySuccess
  | RemovePackageHotelFacilityFail
  | CreatePackageHotelFacilityStart
  | CreatePackageHotelFacilitySuccess
  | CreatePackageHotelFacilityFail
  | UpdatePackageHotelFacilityStart
  | UpdatePackageHotelFacilitySuccess
  | UpdatePackageHotelFacilityFail
