import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { PackageInfo } from "src/app/model/packages/provider/package-info";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { TourPackage } from "src/app/model/packages/provider/tour-package";
import { TaxPackage } from "src/app/model/packages/provider/tax-package";
import { TransferInPackage } from "src/app/model/packages/provider/transfer-package";
import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";
import { RegionPackage } from "src/app/model/packages/provider/region";
import { HotelRoomPackage } from "src/app/model/packages/provider/hotel-room-package";
import { PackageAvailability } from "src/app/model/packages/provider/package-availability";
import { PackageAvailabilitySearch } from "src/app/model/packages/provider/package-availability-search";
import { PackageAvailabilityReq } from "src/app/model/packages/provider/package-availability-create-req";
import { RegionCreateReq } from "src/app/model/packages/provider/region-create.req";
import { HotelFacility } from "src/app/model/packages/provider/hotel-facility";
import { HotelFacilityReq } from "src/app/model/packages/provider/hotel-facility-create.req";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpecialPackagesProviderService {
  private getPackageInfoListUrl =
    environment.baseUrl + "admin/specialPackages/packageInfo";
    private getPackageInfoListByNameUrl =
    environment.baseUrl + "admin/specialPackages/packageInfo/search";
  private getPackageInfoDetailUrl =
    environment.baseUrl + "admin/specialPackages/packageInfo";

  private getPackageHotelListlUrl =
    environment.baseUrl + "admin/specialPackages/hotel";
    private getPackageHotelListByNamelUrl =
    environment.baseUrl + "admin/specialPackages/hotel/search";
  private getPackageTourListlUrl = environment.baseUrl + "admin/specialPackages/tour";
  private getPackageRegionListlUrl =
    environment.baseUrl + "admin/specialPackages/region";
  private getPackageSupplementListlUrl =
    environment.baseUrl + "admin/specialPackages/supplement";
  private getPackageTransferListlUrl =
    environment.baseUrl + "admin/specialPackages/transfer";
  private getPackageTaxListlUrl = environment.baseUrl + "admin/specialPackages/tax";
  private getHotelFacilityListlUrl =
  environment.baseUrl + "admin/specialPackages/hotelFacility";

  private getPackageHotelRoomListlUrl =
    environment.baseUrl + "admin/specialPackages/hotelRoom";
  private getPackageAvailabilityListlUrl =
    environment.baseUrl + "admin/specialPackages/packageAvailability";

  private packageInfolUrl = environment.baseUrl + "admin/specialPackages/packageInfo";
  private packageHotellUrl = environment.baseUrl + "admin/specialPackages/hotel";
  private packageHotelRoomlUrl = environment.baseUrl + "admin/specialPackages/hotelRoom";
  private packageTourlUrl = environment.baseUrl + "admin/specialPackages/tour";
  private packageSupplementlUrl = environment.baseUrl + "admin/specialPackages/supplement";
  private packageTransferlUrl = environment.baseUrl + "admin/specialPackages/transfer";
  private packageTaxlUrl = environment.baseUrl + "admin/specialPackages/tax";
  private regionlUrl = environment.baseUrl + "admin/specialPackages/region";
  private hotelFacilityUrl = environment.baseUrl + "admin/specialPackages/hotelFacility";


  constructor(private http: HttpClient) {}

  getPackageList() {
    return this.http.get<PackageInfo[]>(this.getPackageInfoListUrl);
  }

 
  getPackageInfoListByName(packageName: string) {
    if (packageName === '') {
      return of([]);
    }
    let params = new HttpParams();
    if (packageName) {
      params = params.append("packageName", packageName);
    }
    return this.http.get<HotelPackage[]>(this.getPackageInfoListByNameUrl, { params });
  }


  getPackageDetail(packageInfoId: string) {
    return this.http.get<PackageInfo>(
      `${this.getPackageInfoDetailUrl}/${packageInfoId}`
    );
  }

  getPackageHotelList() {
    return this.http.get<HotelPackage[]>(this.getPackageHotelListlUrl);
  }

  getPackageHotelListByName(hotelName: string) {
    if (hotelName === '') {
      return of([]);
    }
    let params = new HttpParams();
    if (hotelName) {
      params = params.append("hotelName", hotelName);
    }
    return this.http.get<HotelPackage[]>(this.getPackageHotelListByNamelUrl, { params });
  }

  getPackageHotelDetail(packageHotelId: string) {
    return this.http.get<HotelPackage>(
      `${this.getPackageHotelListlUrl}/${packageHotelId}`
    );
  }

  getPackageTourList() {
    return this.http.get<TourPackage[]>(this.getPackageTourListlUrl);
  }

  getRegionList() {
    return this.http.get<RegionPackage[]>(this.regionlUrl);
  }

  getRegionDetail(regionId: string) {
    return this.http.get<RegionPackage>(this.regionlUrl + '/' + regionId);
  }

  getFacilityDetail(regionId: string) {
    return this.http.get<HotelFacility>(this.hotelFacilityUrl + '/' + regionId);
  }
  getPackageTourDetail(packageTourId: string) {
    return this.http.get<TourPackage>(
      `${this.getPackageTourListlUrl}/${packageTourId}`
    );
  }

  getPackageRegionList() {
    return this.http.get<RegionPackage[]>(this.getPackageRegionListlUrl);
  }

  getHotelFacilityList() {
    return this.http.get<HotelFacility[]>(this.getHotelFacilityListlUrl);
  }

  getPackageSupplementList() {
    return this.http.get<SupplementPackage[]>(
      this.getPackageSupplementListlUrl
    );
  }

  getPackageSupplementDetail(packageSupplementId: string) {
    return this.http.get<SupplementPackage>(
      `${this.getPackageSupplementListlUrl}/${packageSupplementId}`
    );
  }
  getPackageTransferList() {
    return this.http.get<TransferInPackage[]>(this.getPackageTransferListlUrl);
  }

  getPackageTransferDetail(packageTransferId: string) {
    return this.http.get<TransferInPackage>(
      `${this.packageTransferlUrl}/${packageTransferId}`
    );
  }

  getPackageTaxList() {
    return this.http.get<TaxPackage[]>(this.getPackageTaxListlUrl);
  }

  getPackageTaxDetail(packageTransferId: string) {
    return this.http.get<TaxPackage>(
      `${this.getPackageTaxListlUrl}/${packageTransferId}`
    );
  }
  getPackageHotelRoomList(hotelId: string) {
    const headers = new HttpHeaders().set("hotel-id", hotelId);
    return this.http.get<HotelRoomPackage[]>(this.getPackageHotelRoomListlUrl, {
      headers,
    });
  }

  getPackageHotelRoomDetail(hoteoRoomId: string) {
    return this.http.get<HotelRoomPackage>(
      `${this.getPackageHotelRoomListlUrl}/${hoteoRoomId}`
    );
  }
  getPackageAvailabilityList(
    packageAvailabilitySearch: PackageAvailabilitySearch
  ) {
    const headers = new HttpHeaders().set(
      "package-id",
      packageAvailabilitySearch.packageId
    );
    let params = new HttpParams();
    if (packageAvailabilitySearch.startDate) {
      params = params.append("startDate", packageAvailabilitySearch.startDate);
    }
    if (packageAvailabilitySearch.endDate) {
      params = params.append("endDate", packageAvailabilitySearch.endDate);
    }
    return this.http.get<PackageAvailability[]>(
      this.getPackageAvailabilityListlUrl,
      { headers: headers, params: params }
    );
  }

  // package info

  updatePackageDetail(data: PackageInfo, pacakgeId: string) {
    return this.http.put<PackageInfo>(
      `${this.packageInfolUrl}/${pacakgeId}`,
      data
    );
  }

  createPackageDetail(data: PackageInfo) {
    return this.http.post<PackageInfo>(`${this.packageInfolUrl}`, data);
  }

  removePackageinfo(pacakgeId: string) {
    return this.http.delete<any>(`${this.packageInfolUrl}/${pacakgeId}`);
  }

  //packge availability

  createPackageAvailability(data: PackageAvailabilityReq, packageId: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("package-id", packageId);
    return this.http.post<any>(`${this.getPackageAvailabilityListlUrl}`, data , {headers});
  }

  removePackageAvailability(pacakgeAvailabilityId: string, packageId: string, deleteByType: boolean) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("package-id", packageId);
    if(deleteByType){
      headers = headers.append("delete-by-type" , "true");
    }
    return this.http.delete<any>(`${this.getPackageAvailabilityListlUrl}/${pacakgeAvailabilityId}`, {headers});
  }

  // hotel package
  updatePackageHotel(data: HotelPackage, hotelId: string) {
    return this.http.put<HotelPackage>(
      `${this.packageHotellUrl}/${hotelId}`,
      data
    );
  }

  createPackageHotel(data: HotelPackage) {
    return this.http.post<HotelPackage>(`${this.packageHotellUrl}`, data);
  }

  removePackageHotel(hotelId: string) {
    return this.http.delete<any>(`${this.packageHotellUrl}/${hotelId}`);
  }

  // hotel room
  updateHotelRoom(data: HotelRoomPackage, roomId: string) {
    return this.http.put<HotelRoomPackage>(
      `${this.packageHotelRoomlUrl}/${roomId}`,
      data
    );
  }

  createHotelRoom(data: HotelRoomPackage) {
    return this.http.post<HotelRoomPackage>(`${this.packageHotelRoomlUrl}`, data);
  }

  removeHotelRoom(roomId: string) {
    return this.http.delete<any>(`${this.packageHotelRoomlUrl}/${roomId}`);
  }



  // tour package
  updatePackageTour(data: TourPackage, tourId: string) {
    return this.http.put<TourPackage>(
      `${this.packageTourlUrl}/${tourId}`,
      data
    );
  }

  createPackageTour(data: TourPackage) {
    return this.http.post<TourPackage>(`${this.packageTourlUrl}`, data);
  }

  removePackageTour(tourId: string) {
    return this.http.delete<any>(`${this.packageTourlUrl}/${tourId}`);
  }

  // supplement package
  updatePackageSupplement(data: SupplementPackage, supplementId: string) {
    return this.http.put<SupplementPackage>(
      `${this.packageSupplementlUrl}/${supplementId}`,
      data
    );
  }

  createPackageSupplement(data: SupplementPackage) {
    return this.http.post<SupplementPackage>(
      `${this.packageSupplementlUrl}`,
      data
    );
  }

  removePackageSupplement(supplementId: string) {
    return this.http.delete<any>(
      `${this.packageSupplementlUrl}/${supplementId}`
    );
  }

  // supplement transfer
  updatePackageTransfer(data: TransferInPackage, supplementId: string) {
    return this.http.put<TransferInPackage>(
      `${this.packageTransferlUrl}/${supplementId}`,
      data
    );
  }

  createPackageTransfer(data: TransferInPackage) {
    return this.http.post<TransferInPackage>(
      `${this.packageTransferlUrl}`,
      data
    );
  }

  removePackageTransfer(transferId: string) {
    return this.http.delete<any>(`${this.packageTransferlUrl}/${transferId}`);
  }

  // supplement tax
  updatePackageTax(data: TaxPackage, taxId: string) {
    return this.http.put<TaxPackage>(`${this.packageTaxlUrl}/${taxId}`, data);
  }

  createPackageTax(data: TaxPackage) {
    return this.http.post<TaxPackage>(`${this.packageTaxlUrl}`, data);
  }

  removePackageTax(taxId: string) {
    return this.http.delete<any>(`${this.packageTaxlUrl}/${taxId}`);
  }

  //region
  updateRegion(regionUpdate: RegionCreateReq, regionId: string) {
  
    return this.http.put<HotelPackage>(
      `${this.regionlUrl}/${regionId}`,
      regionUpdate
    );
  }

  createRegion(data: RegionCreateReq) {
    return this.http.post<RegionPackage>(`${this.regionlUrl}`, data);
  }

  removeRegion(regionId: string) {
    return this.http.delete<any>(`${this.regionlUrl}/${regionId}`);
  }

  //facility
  updateHotelFacility(regionUpdate: HotelFacilityReq, facilityId: string) {
  
    return this.http.put<HotelFacility>(
      `${this.hotelFacilityUrl}/${facilityId}`,
      regionUpdate
    );
  }

  createHotelFacility(data: HotelFacilityReq) {
    return this.http.post<HotelFacility>(`${this.hotelFacilityUrl}`, data);
  }

  removeHotelFacility(facilityId: string) {
    return this.http.delete<any>(`${this.hotelFacilityUrl}/${facilityId}`);
  }
}
