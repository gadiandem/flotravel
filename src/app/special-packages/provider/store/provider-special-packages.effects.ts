import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer'
import * as ProviderPackagesActions from './provider-special-packages.actions'
import {HotelPackage} from '../../../model/packages/provider/hotel-package';
import {providerPackagesConstant} from '../provider-packages.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {environment} from '../../../../environments/environment';
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import {AlertifyService} from '../../../service/alertify.service';
import {HotelRoomPackage} from '../../../model/packages/provider/hotel-room-package';
import {PackageInfo} from '../../../model/packages/provider/package-info';
import {RegionPackage} from '../../../model/packages/provider/region';
import {RegionCreateReq} from '../../../model/packages/provider/region-create.req';
import {SupplementPackage} from '../../../model/packages/provider/supplement-package';
import {TourPackage} from '../../../model/packages/provider/tour-package';
import {TransferInPackage} from '../../../model/packages/provider/transfer-package';
import {HotelFacility} from '../../../model/packages/provider/hotel-facility';
import {HotelFacilityReq} from '../../../model/packages/provider/hotel-facility-create.req';

const getPackageHotelListUrl = environment.baseUrl + "admin/specialPackages/hotel";
const getPackageHotelRoomListUrl = environment.baseUrl + "admin/specialPackages/hotelRoom";
const getPackageHotelListByNameUrl = environment.baseUrl + "admin/specialPackages/hotel/search";
const getPackageInfoListUrl = environment.baseUrl + "admin/specialPackages/packageInfo";
const getPackageRegionListUrl = environment.baseUrl + "admin/specialPackages/region";
const getPackageSupplementListUrl = environment.baseUrl + "admin/specialPackages/supplement";
const getPackageTourListUrl = environment.baseUrl + "admin/specialPackages/tour";
const getPackageTransferListUrl = environment.baseUrl + "admin/specialPackages/transfer";
const getPackageHotelFacilityListUrl = environment.baseUrl + "admin/specialPackages/hotelFacility";

const packageHotelUrl = environment.baseUrl + "admin/specialPackages/hotel";
const packageHotelRoomUrl = environment.baseUrl + "admin/specialPackages/hotelRoom";
const packageInfoUrl = environment.baseUrl + "admin/specialPackages/packageInfo";
const packageRegionUrl = environment.baseUrl + "admin/specialPackages/region";
const packageSupplementUrl = environment.baseUrl + "admin/specialPackages/supplement";
const packageTourUrl = environment.baseUrl + "admin/specialPackages/tour";
const packageTransferUrl = environment.baseUrl + "admin/specialPackages/transfer";
const packageHotelFacilityUrl = environment.baseUrl + "admin/specialPackages/hotelFacility";

const handleGetPackageHotelListResult = (packageHotelListRes: HotelPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_LIST_RES, JSON.stringify(packageHotelListRes));
  return new ProviderPackagesActions.GetPackageHotelListSuccess(packageHotelListRes);
}

const handleRemovePackageHotelResult = () => {
  return  new ProviderPackagesActions.GetPackageHotelListStart();
}

const handleCreatePackageHotelResult = (packageHotelCreateRes: HotelPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_CREATE_RES, JSON.stringify(packageHotelCreateRes));
  return new ProviderPackagesActions.GetPackageHotelListStart();
}

const handleGetPackageHotelDetailResult = (packageHotelDetailRes: HotelPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_DETAIL_RES, JSON.stringify(packageHotelDetailRes));
  return new ProviderPackagesActions.GetPackageHotelDetailSuccess(packageHotelDetailRes);
}

const handleUpdatePackageHotelResult = (packageHotelUpdateRes: HotelPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_UPDATE_RES, JSON.stringify(packageHotelUpdateRes));
  return new ProviderPackagesActions.GetPackageHotelListStart();
}

const handleGetPackageHotelRoomListResult = (packageHotelRoomListRes: HotelRoomPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_LIST_RES, JSON.stringify(packageHotelRoomListRes));
  return new ProviderPackagesActions.GetPackageHotelRoomListSuccess(packageHotelRoomListRes);
}

const handleGetPackageHotelListByNameResult = (packageHotelListByNameRes: HotelPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_LIST_BY_NAME_RES, JSON.stringify(packageHotelListByNameRes));
  return new ProviderPackagesActions.GetPackageHotelListByNameSuccess(packageHotelListByNameRes);
}

const handleRemovePackageHotelRoomResult = () => {
  let packageHotelId = sessionStorage.getItem(providerPackagesConstant.PACKAGE_HOTEL_ID);
  return new ProviderPackagesActions.GetPackageHotelRoomListStart({packageHotelId: packageHotelId});
}

const handleCreatePackageHotelRoomResult = (packageHotelRoomCreateRes: HotelRoomPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_CREATE_RES, JSON.stringify(packageHotelRoomCreateRes));
  return new ProviderPackagesActions.CreatePackageHotelRoomSuccess(packageHotelRoomCreateRes);
}

const handleGetPackageHotelRoomDetailResult = (packageHotelRoomDetailRes: HotelRoomPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_DETAIL_RES, JSON.stringify(packageHotelRoomDetailRes));
  return new ProviderPackagesActions.GetPackageHotelRoomDetailSuccess(packageHotelRoomDetailRes);
}

const handleUpdatePackageHotelRoomResult = (packageHotelRoomUpdateRes: HotelRoomPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ROOM_UPDATE_RES, JSON.stringify(packageHotelRoomUpdateRes));
  return new ProviderPackagesActions.UpdatePackageHotelRoomSuccess(packageHotelRoomUpdateRes);
}

const handleGetPackageInfoListResult = (packageInfoListRes: PackageInfo[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_INFO_LIST_RES, JSON.stringify(packageInfoListRes));
  return new ProviderPackagesActions.GetPackageInfoListSuccess(packageInfoListRes);
}

const handleRemovePackageInfoResult = () => {
  return new ProviderPackagesActions.GetPackageInfoListStart();
}

const handleGetPackageRegionListResult = (packageRegionListRes: RegionPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_REGION_LIST_RES, JSON.stringify(packageRegionListRes));
  return new ProviderPackagesActions.GetPackageRegionListSuccess(packageRegionListRes);
}

const handleRemovePackageRegionResult = () => {
  return new ProviderPackagesActions.GetPackageRegionListStart();
}

const handleGetPackageRegionDetailResult = (packageRegionDetailRes: RegionPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_REGION_DETAIL_RES, JSON.stringify(packageRegionDetailRes));
  return new ProviderPackagesActions.GetPackageRegionDetailSuccess(packageRegionDetailRes);
}

const handleCreatePackageRegionResult = (packageRegionCreateRes: RegionPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_REGION_CREATE_RES, JSON.stringify(packageRegionCreateRes));
  return new ProviderPackagesActions.GetPackageRegionListStart();
}

const handleUpdatePackageRegionResult = (packageRegionUpdateRes: RegionPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_REGION_UPDATE_RES, JSON.stringify(packageRegionUpdateRes));
  return new ProviderPackagesActions.UpdatePackageRegionSuccess(packageRegionUpdateRes);
}

const handleGetPackageSupplementListResult = (packageSupplementListRes: SupplementPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_LIST_RES, JSON.stringify(packageSupplementListRes));
  return new ProviderPackagesActions.GetPackageSupplementListSuccess(packageSupplementListRes);
}

const handleRemovePackageSupplementResult = () => {
  return new ProviderPackagesActions.GetPackageSupplementListStart();
}

const handleCreatePackageSupplementResult = (packageSupplementCreateRes: SupplementPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_CREATE_RES, JSON.stringify(packageSupplementCreateRes));
  return new ProviderPackagesActions.GetPackageSupplementListStart();
}

const handleGetPackageSupplementDetailResult = (packageSupplementDetailRes: SupplementPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_DETAIL_RES, JSON.stringify(packageSupplementDetailRes));
  return new ProviderPackagesActions.GetPackageSupplementDetailSuccess(packageSupplementDetailRes);
}

const handleUpdatePackageSupplementResult = (packageSupplementUpdateRes: SupplementPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_SUPPLEMENT_UPDATE_RES, JSON.stringify(packageSupplementUpdateRes));
  return new ProviderPackagesActions.GetPackageSupplementListStart();
}

const handleGetPackageTourListResult = (packageTourListRes: TourPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_LIST_RES, JSON.stringify(packageTourListRes));
  return new ProviderPackagesActions.GetPackageTourListSuccess(packageTourListRes);
}

const handleRemovePackageTourResult = () => {
  return new ProviderPackagesActions.GetPackageTourListStart();
}

const handleCreatePackageTourResult = (packageTourCreateRes: TourPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_CREATE_RES, JSON.stringify(packageTourCreateRes));
  return new ProviderPackagesActions.GetPackageTourListStart();
}

const handleGetPackageTourDetailResult = (packageTourDetailRes: TourPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_DETAIL_RES, JSON.stringify(packageTourDetailRes));
  return new ProviderPackagesActions.GetPackageTourDetailSuccess(packageTourDetailRes);
}

const handleUpdatePackageTourResult = (packageTourUpdateRes: TourPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_UPDATE_RES, JSON.stringify(packageTourUpdateRes));
  return new ProviderPackagesActions.GetPackageTourListStart();
}

const handleGetPackageTransferListResult = (packageTransferListRes: TransferInPackage[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TRANSFER_LIST_RES, JSON.stringify(packageTransferListRes));
  return new ProviderPackagesActions.GetPackageTransferListSuccess(packageTransferListRes);
}

const handleRemovePackageTransferResult = () => {
  return new ProviderPackagesActions.GetPackageTransferListStart();
}

const handleCreatePackageTransferResult = (packageTransferCreateRes: TransferInPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TRANSFER_CREATE_RES, JSON.stringify(packageTransferCreateRes));
  return new ProviderPackagesActions.GetPackageTransferListStart();
}

const handleGetPackageTransferDetailResult = (packageTransferDetailRes: TransferInPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TRANSFER_DETAIL_RES, JSON.stringify(packageTransferDetailRes));
  return new ProviderPackagesActions.GetPackageTransferDetailSuccess(packageTransferDetailRes);
}

const handleUpdatePackageTransferResult = (packageTransferUpdateRes: TransferInPackage) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_UPDATE_RES, JSON.stringify(packageTransferUpdateRes));
  return new ProviderPackagesActions.GetPackageTransferListStart();
}

const handleGetPackageHotelFacilityListResult = (packageHotelFacilityListRes: HotelFacility[]) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_LIST_RES, JSON.stringify(packageHotelFacilityListRes));
  return new ProviderPackagesActions.GetPackageHotelFacilityListSuccess(packageHotelFacilityListRes);
}

const handleRemovePackageHotelFacilityResult = () => {
  return new ProviderPackagesActions.GetPackageHotelFacilityListStart();
}

const handleCreatePackageHotelFacilityResult = (packageHotelFacilityCreateRes: HotelFacility) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_CREATE_RES, JSON.stringify(packageHotelFacilityCreateRes));
  return new ProviderPackagesActions.GetPackageHotelFacilityListStart();
}

const handleGetPackageHotelFacilityDetailResult = (packageHotelFacilityDetailRes: HotelFacility) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_FACILITY_DETAIL_RES, JSON.stringify(packageHotelFacilityDetailRes));
  return new ProviderPackagesActions.GetPackageHotelFacilityDetailSuccess(packageHotelFacilityDetailRes);
}

const handleUpdatePackageHotelFacilityResult = (packageHotelFacilityUpdateRes: HotelFacility) => {
  sessionStorage.setItem(providerPackagesConstant.PACKAGE_TOUR_UPDATE_RES, JSON.stringify(packageHotelFacilityUpdateRes));
  return new ProviderPackagesActions.GetPackageHotelFacilityListStart();
}
const handleError = (errorRes: any) => {
  let errorMessage = "An unknown error occurred! try again.";
  if (errorRes.status === 500) {
    errorMessage = "Server have some error! try again."
  }
  return of(new ProviderPackagesActions.HandleFail(errorMessage));
};

@Injectable()
export class ProviderSpecialPackagesEffects {
  @Effect()
  getPackageHotelList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageHotelListStart) => {
      return this.http
        .get<HotelPackage[]>(getPackageHotelListUrl)
        .pipe(
          map((res: HotelPackage[]) => {
            return handleGetPackageHotelListResult(res);
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  removePackageHotel = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageHotelStart) => {
      const packageHotelId = actionData.payload.packageHotelId;
      return this.http.delete<any>(`${packageHotelUrl}/${packageHotelId}`).pipe(
          map((res: any) => {
            this.alertify.success("Delete Hotel Successful!")
            return handleRemovePackageHotelResult();
          }),
          catchError((errorRes) => {
            this.alertify.error("Delete Hotel Error!");
            return handleError(errorRes);
          })
        );
      })
  );

  @Effect()
  createPackageHotel = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_HOTEL_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageHotelStart) => {
      const data : HotelPackage = actionData.payload.packageHotelCreateReq;
      sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_CREATE_REQ, JSON.stringify(data));
      return this.http.post<HotelPackage>(`${packageHotelUrl}`, data).pipe(
        map((res: HotelPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create ${res.name} create successful!`);
          return handleCreatePackageHotelResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Create ${data.name} error!.`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageHotelDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageHotelDetailStart) => {
      const packageHotelId = actionData.payload.packageHotelId;
      return this.http.get<HotelPackage>(`${packageHotelUrl}/${packageHotelId}`).pipe(
        map((res: HotelPackage) => {
          return handleGetPackageHotelDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageHotel = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageHotelStart) => {
      const packageHotelId = actionData.payload.packageHotelId;
      const data = actionData.payload.packageHotelUpdateReq;
      return this.http.put<HotelPackage>(`${packageHotelUrl}/${packageHotelId}`, data).pipe(
        map((res: HotelPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update ${res.name} successful!`);
          return handleUpdatePackageHotelResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update ${data.name} error!.`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageHotelRoomList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_LIST_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageHotelRoomListStart) => {
      const packageHotelId = actionData.payload.packageHotelId;
      const headers = new HttpHeaders().set("hotel-id", packageHotelId);
      return this.http.get<HotelRoomPackage[]>(getPackageHotelRoomListUrl, {headers}).pipe(
        map((res : HotelRoomPackage[]) => {
          return handleGetPackageHotelRoomListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageHotelListByName = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_LIST_BY_NAME_START),
    switchMap((dataAction : ProviderPackagesActions.GetPackageHotelListByNameStart) => {
      const packageHotelName = dataAction.payload.packageHotelName;
      let params = new HttpParams();
      params = params.append("hotelName", packageHotelName);
      return this.http.get<HotelPackage[]>(getPackageHotelListByNameUrl, {params}).pipe(
        map((res: HotelPackage[]) => {
          return handleGetPackageHotelListByNameResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageHotelRoom = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_ROOM_START),
    switchMap((dataAction: ProviderPackagesActions.RemovePackageHotelRoomStart) => {
      const packageHotelRoomId = dataAction.payload.packageHotelRoomId;
      return this.http.delete<any>(`${packageHotelRoomUrl}/${packageHotelRoomId}`).pipe(
        map((res: any) => {
          this.alertify.success(`Delete Room Successful!`);
          return handleRemovePackageHotelRoomResult();
        }),
        catchError((errorRes) => {
          this.alertify.error('Delete Room Error!');
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  createPackageHotelRoom = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_HOTEL_ROOM_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageHotelRoomStart) => {
      const data: HotelRoomPackage = actionData.payload.packageHotelRoomCreateReq;
      return this.http.post<HotelRoomPackage>(`${packageHotelRoomUrl}`, data).pipe(
        map((res: HotelRoomPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create ${res.roomType} create successful!`);
          return handleCreatePackageHotelRoomResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Create ${data.roomType} error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageHotelRoomDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_ROOM_DETAIL_START),
    switchMap((dataAction: ProviderPackagesActions.GetPackageHotelRoomDetailStart) => {
      const packageHotelRoomId: string = dataAction.payload.packageHotelRoomId;
      return this.http.get<HotelRoomPackage>(`${getPackageHotelRoomListUrl}/${packageHotelRoomId}`).pipe(
        map((res: HotelRoomPackage) => {
          return handleGetPackageHotelRoomDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  updatePackageHotelRoom = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_ROOM_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageHotelRoomStart) => {
      const data = actionData.payload.packHotelRoomReq;
      const packageHotelRoomId = actionData.payload.packageHotelRoomId;
      return this.http.put<HotelRoomPackage>(`${packageHotelRoomUrl}/${packageHotelRoomId}`, data).pipe(
        map((res : HotelRoomPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update ${res.roomType}  successful!`);
          return handleUpdatePackageHotelRoomResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update ${data.roomType} error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageInfoList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_INFO_LIST_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageInfoListStart) => {
      return this.http.get<PackageInfo[]>(getPackageInfoListUrl).pipe(
        map((res: PackageInfo[]) => {
          return handleGetPackageInfoListResult(res);
        }),
        catchError((errorRes: any) => {
          return handleError(errorRes);
        })
      );
    })
  )

  @Effect()
  removePackageInfo = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_INFO_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageInfoStart) => {
      const packageInfoId: string = actionData.payload.packageInfoId;
      return this.http.delete<any>(`${packageInfoUrl}/${packageInfoId}`).pipe(
        map((res) => {
          this.alertify.success(`Delete Package successful!`);
          return handleRemovePackageInfoResult();
        }),
        catchError((errorRes) => {
          this.alertify.error(`Delete package error!.`);
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  getPackageRegionList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_REGION_LIST_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageRegionListStart) => {
      return this.http.get<RegionPackage[]>(getPackageRegionListUrl).pipe(
        map((res: RegionPackage[]) => {
          return handleGetPackageRegionListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageRegion = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_REGION_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageRegionStart) => {
      const packageRegionId : string = actionData.payload.packageRegionId;
      return this.http.delete<any>(`${packageRegionUrl}/${packageRegionId}`).pipe(
        map((res: any) => {
          this.alertify.success("Delete Region Success!");
          return handleRemovePackageRegionResult();
        }),
        catchError((errorRes) => {
          this.alertify.error("Delete Region Error!");
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  createPackageRegion = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_REGION_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageRegionStart) => {
      const data: RegionCreateReq = actionData.payload.packageRegionCreateReq;
      return this.http.post<RegionPackage>(`${packageRegionUrl}`, data).pipe(
        map((res: RegionPackage) => {
          console.log(res);
          this.alertify.success(`Create Package Region ${res.name} Success!`);
          return handleCreatePackageRegionResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Create Package Region ${data.name} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageRegionDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_REGION_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageRegionDetailStart) => {
      const packageRegionId : string = actionData.payload.packageRegionId;
      return this.http.get<RegionPackage>(`${packageRegionUrl}/${packageRegionId}`).pipe(
        map((res: RegionPackage) => {
          return handleGetPackageRegionDetailResult(res);
        }),
        catchError((errorRes: any) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageRegion = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_REGION_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageRegionStart) => {
      const packageRegionId:string = actionData.payload.packageRegionId;
      const data: RegionCreateReq = actionData.payload.packageRegionUpdateReq;
      return this.http.put<RegionPackage>(`${packageRegionUrl}/${packageRegionId}`, data).pipe(
        map((res : RegionPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update Package Region ${res.name} Success!`);
          return handleUpdatePackageRegionResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update package Region ${data.name} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageSupplementList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_LIST_START),
    switchMap((actionData : ProviderPackagesActions.GetPackageSupplementListStart) => {
      return this.http.get<SupplementPackage[]>(getPackageSupplementListUrl).pipe(
        map((res: SupplementPackage[]) => {
          return handleGetPackageSupplementListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageSupplement = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_SUPPLEMENT_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageSupplementStart) => {
      const packageSupplementId : string = actionData.payload.packageSupplementId;
      return this.http.delete<any>(`${packageSupplementUrl}/${packageSupplementId}`).pipe(
        map((res) => {
          this.alertify.success("Delete Package Supplement Success!");
          return handleRemovePackageSupplementResult();
        }),
        catchError((errorRes) => {
          this.alertify.error("Delete Package Supplement Error!");
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  createPackageSupplement = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_SUPPLEMENT_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageSupplementStart) => {
      const data: SupplementPackage = actionData.payload.packageSupplementCreateReq;
      return this.http.post<SupplementPackage>(`${packageSupplementUrl}`, data).pipe(
        map((res: SupplementPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create Package Supplement ${res.name} Success!`);
          return handleCreatePackageSupplementResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Delete Package Supplement ${data.name} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageSupplementDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_SUPPLEMENT_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageSupplementDetailStart) => {
      const packageSupplementId : string = actionData.payload.packageSupplementId;
      return this.http.get<SupplementPackage>(`${packageSupplementUrl}/${packageSupplementId}`).pipe(
        map((res : SupplementPackage) => {
          return handleGetPackageSupplementDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageSupplement = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_SUPPLEMENT_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageSupplementStart) => {
      const packageSupplementId : string = actionData.payload.packageSupplementId;
      const data: SupplementPackage = actionData.payload.packageSupplementUpdateReq;
      return this.http.put<SupplementPackage>(`${packageSupplementUrl}/${packageSupplementId}`, data).pipe(
        map((res: SupplementPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update Package Supplement ${res.name} Success!`);
          return handleUpdatePackageSupplementResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update Package Supplement ${data.name} Error!`);
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  getPackageTourList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_TOUR_LIST_START),
    switchMap((actionData : ProviderPackagesActions.GetPackageTourListStart) => {
      return this.http.get<TourPackage[]>(getPackageTourListUrl).pipe(
        map((res: TourPackage[]) => {
          return handleGetPackageTourListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageTour = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_TOUR_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageTourStart) => {
      const packageTourId:string = actionData.payload.packageTourId;
      return this.http.delete<any>(`${packageTourUrl}/${packageTourId}`).pipe(
        map((res) => {
          this.alertify.success("Delete Package Tour Success!");
          return handleRemovePackageTourResult();
        }),
        catchError((errorRes) => {
          this.alertify.error("Delete Package Tour Error!");
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  createPackageTour = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_TOUR_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageTourStart) => {
      const data: TourPackage = actionData.payload.packageTourCreateReq;
      return this.http.post<TourPackage>(`${packageTourUrl}`, data).pipe(
        map((res: TourPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create Package Tour ${res.name} Success!`);
          return handleCreatePackageTourResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Delete Package Tour ${data.name} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageTourDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_TOUR_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageTourDetailStart) => {
      const packageTourId : string = actionData.payload.packageTourId;
      return this.http.get<TourPackage>(`${packageTourUrl}/${packageTourId}`).pipe(
        map((res : TourPackage) => {
          return handleGetPackageTourDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageTour = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_TOUR_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageTourStart) => {
      const packageTourId : string = actionData.payload.packageTourId;
      const data: TourPackage = actionData.payload.packageTourUpdateReq;
      return this.http.put<TourPackage>(`${packageTourUrl}/${packageTourId}`, data).pipe(
        map((res: TourPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update Package Tour ${res.name} Success!`);
          return handleUpdatePackageTourResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update Package Tour ${data.name} Error!`);
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  getPackageTransferList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_TRANSFER_LIST_START),
    switchMap((actionData : ProviderPackagesActions.GetPackageTransferListStart) => {
      return this.http.get<TransferInPackage[]>(getPackageTransferListUrl).pipe(
        map((res: TransferInPackage[]) => {
          return handleGetPackageTransferListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageTransfer = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_TRANSFER_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageTransferStart) => {
      const packageTransferId:string = actionData.payload.packageTransferId;
      return this.http.delete<any>(`${packageTransferUrl}/${packageTransferId}`).pipe(
        map((res) => {
          this.alertify.success("Delete Package Transfer Success!");
          return handleRemovePackageTransferResult();
        }),
        catchError((errorRes) => {
          this.alertify.error("Delete Package Transfer Error!");
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  createPackageTransfer = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_TRANSFER_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageTransferStart) => {
      const data: TransferInPackage = actionData.payload.packageTransferCreateReq;
      return this.http.post<TransferInPackage>(`${packageTransferUrl}`, data).pipe(
        map((res: TransferInPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create Package Transfer ${res.transferType} Success!`);
          return handleCreatePackageTransferResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Delete Package Transfer ${data.transferType} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageTransferDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_TRANSFER_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageTransferDetailStart) => {
      const packageTransferId : string = actionData.payload.packageTransferId;
      return this.http.get<TransferInPackage>(`${packageTransferUrl}/${packageTransferId}`).pipe(
        map((res : TransferInPackage) => {
          return handleGetPackageTransferDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageTransfer = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_TRANSFER_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageTransferStart) => {
      const packageTransferId : string = actionData.payload.packageTransferId;
      const data: TransferInPackage = actionData.payload.packageTransferUpdateReq;
      return this.http.put<TransferInPackage>(`${packageTransferUrl}/${packageTransferId}`, data).pipe(
        map((res: TransferInPackage) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update Package Transfer ${res.transferType} Success!`);
          return handleUpdatePackageTransferResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update Package Transfer ${data.transferType} Error!`);
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  getPackageHotelFacilityList = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_LIST_START),
    switchMap((actionData : ProviderPackagesActions.GetPackageHotelFacilityListStart) => {
      return this.http.get<HotelFacility[]>(getPackageHotelFacilityListUrl).pipe(
        map((res: HotelFacility[]) => {
          return handleGetPackageHotelFacilityListResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  removePackageHotelFacility = this.actions$.pipe(
    ofType(ProviderPackagesActions.REMOVE_PACKAGE_HOTEL_FACILITY_START),
    switchMap((actionData: ProviderPackagesActions.RemovePackageHotelFacilityStart) => {
      const packageHotelFacilityId:string = actionData.payload.packageHotelFacilityId;
      return this.http.delete<any>(`${packageHotelFacilityUrl}/${packageHotelFacilityId}`).pipe(
        map((res) => {
          this.alertify.success("Delete Package Hotel Facility Success!");
          return handleRemovePackageHotelFacilityResult();
        }),
        catchError((errorRes) => {
          this.alertify.error("Delete Package Hotel Facility Error!");
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect()
  createPackageHotelFacility = this.actions$.pipe(
    ofType(ProviderPackagesActions.CREATE_PACKAGE_HOTEL_FACILITY_START),
    switchMap((actionData: ProviderPackagesActions.CreatePackageHotelFacilityStart) => {
      const data: HotelFacilityReq = actionData.payload.packageHotelFacilityCreateReq;
      return this.http.post<HotelFacility>(`${packageHotelFacilityUrl}`, data).pipe(
        map((res: HotelFacility) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create Package Hotel Facility ${res.name} Success!`);
          return handleCreatePackageHotelFacilityResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Delete Package Hotel Facility ${data.name} Error!`);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  getPackageHotelFacilityDetail = this.actions$.pipe(
    ofType(ProviderPackagesActions.GET_PACKAGE_HOTEL_FACILITY_DETAIL_START),
    switchMap((actionData: ProviderPackagesActions.GetPackageHotelFacilityDetailStart) => {
      const packageHotelFacilityId : string = actionData.payload.packageHotelFacilityId;
      return this.http.get<HotelFacility>(`${packageHotelFacilityUrl}/${packageHotelFacilityId}`).pipe(
        map((res : HotelFacility) => {
          return handleGetPackageHotelFacilityDetailResult(res);
        }),
        catchError((errorRes) => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect()
  updatePackageHotelFacility = this.actions$.pipe(
    ofType(ProviderPackagesActions.UPDATE_PACKAGE_HOTEL_FACILITY_START),
    switchMap((actionData: ProviderPackagesActions.UpdatePackageHotelFacilityStart) => {
      const packageHotelFacilityId : string = actionData.payload.packageHotelFacilityId;
      const data: HotelFacilityReq = actionData.payload.packageHotelFacilityUpdateReq;
      return this.http.put<HotelFacility>(`${packageHotelFacilityUrl}/${packageHotelFacilityId}`, data).pipe(
        map((res: HotelFacility) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Update Package Hotel Facility ${res.name} Success!`);
          return handleUpdatePackageHotelFacilityResult(res);
        }),
        catchError((errorRes) => {
          this.alertify.error(`Update Package Hotel Facility ${data.name} Error!`);
          return handleError(errorRes);
        })
      )
    })
  );
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
    private alertify: AlertifyService
  ) {}
}
