import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Observer, of } from "rxjs";
import { Location } from "@angular/common";
import { map, switchMap, tap } from "rxjs/operators";

import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { RegionPackage } from "src/app/model/packages/provider/region";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { SpecialPackagesProviderService } from "src/app/service/packages/special-packages-provider.service";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { HotelRoomPackage } from "src/app/model/packages/provider/hotel-room-package";
import { TaxPackage } from "src/app/model/packages/provider/tax-package";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { HotelFacility } from "src/app/model/packages/provider/hotel-facility";
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css']
})
export class HotelEditComponent implements OnInit {
  packageHotelId: string;
  packageHotelDetail: HotelPackage;

  regions$: Observable<RegionPackage[]>;
  citys$: Observable<DestinationRes[]>;
  // taxs$: Observable<TaxPackage[]>;
  roomList: HotelRoomPackage[];

  limit: number;
  searchRegion = "";
  searchCity = "";
  searchTax = "";
  regionName: string;
  regionCode: string;
  cityName: string;
  cityCode: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  hotelForm: FormGroup;
  formSubmitError: boolean;

  facilityList: HotelFacility[];
  selectedValue: string;
  selectedOption: any;
  previewOption?: any;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  initialUpdateFormData = true;
  constructor(
    private providerService: SpecialPackagesProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store : Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.initForm();
    this.store.select('providerSpecialPackages').subscribe((data) => {
        this.fetching = data.loading;
        this.fetchFailed = data.failure;
        this.errorMes = data.errorMessage;
        this.packageHotelDetail = data.packageHotelDetailRes;
        if(this.packageHotelDetail && this.initialUpdateFormData){
          this.updateFormWithData();
          this.initialUpdateFormData = false;
        }
    })
    this.formSubmitError = false;
    // this.packageHotelDetail = new HotelPackage();
    this.roomList = [];
    this.facilityList = []
    this.searchRegions();
    this.searchCitys();
    this.getHotelFacilityList();
  }

  getHotelFacilityList() {
    this.providerService.getHotelFacilityList().subscribe((res: HotelFacility[]) => {
      this.facilityList = res;
    }, e => {
      console.log(e);
    });
  }

  public facilityListAutoComplete = (text: string): Observable<HotelFacility[]> => {
    return of([...this.facilityList]);
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.hotelForm.patchValue({
      fullFacilityDescription: ''
    })
  }

  onPreview(event: TypeaheadMatch): void {
    if (event) {
      this.previewOption = event.item;
    } else {
      this.previewOption = null;
    }
  }

  private updateFormWithData() {
    this.hotelForm.patchValue({
      name: this.packageHotelDetail.name,
      region: this.packageHotelDetail.regionName,
      overview: this.packageHotelDetail.overview,
      hotelImage: this.packageHotelDetail.hotelImage,
      city: this.packageHotelDetail.cityName,
      minPrice: this.packageHotelDetail.minPrice,
      currency: this.packageHotelDetail.currency,
      breakfast: this.packageHotelDetail.breakfast,
      remark: this.packageHotelDetail.remark,
      starRate: this.packageHotelDetail.starRate,
      latitude: this.packageHotelDetail.latitude,
      longitude: this.packageHotelDetail.longitude,
      additionalInfo: this.packageHotelDetail.additionalInfo,
      fullFacilityDescriptions: this.packageHotelDetail.fullFacilityDescriptions
    });
    for (let i = 1; i < this.packageHotelDetail.roomImages.length; i++) {
      this.addRomImage();
    }
    console.log(this.packageHotelDetail.roomImages.length)
    for (let j = 0; j < this.packageHotelDetail.roomImages.length; j++) {
      this.updateRomImage(j);
    }

  }

  updateHotelFacility(){
    this.hotelForm.patchValue({
      fullFacilityDescription: this.packageHotelDetail.fullFacilityDescriptions,
    })
  }

  updateRomImage(i: number) {
    let romImages = <FormArray>this.hotelForm.get("romImages");
    romImages.controls[i].get('image').patchValue(this.packageHotelDetail.roomImages[i]);
  }


  initForm() {
    this.hotelForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      overview: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      hotelImage: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]) ,
      breakfast: new FormControl(false, [Validators.required]),
      remark: new FormControl("", [Validators.required]),
      fullFacilityDescriptions: new FormControl("", [Validators.required]),
      starRate: new FormControl("", [Validators.required]),
      latitude: new FormControl("", [Validators.required]),
      longitude: new FormControl("", [Validators.required]),
      additionalInfo: new FormControl("", [Validators.required]),
      romImages: new FormArray([]),
      romList: new FormArray([]),
    });
    this.addRomImage();
  }

  addRomImage() {
    (this.hotelForm.get("romImages") as FormArray).push(
      new FormGroup({
        image: new FormControl(""),
      })
    );
  }

  removeRomImage(index: number) {
    (this.hotelForm.get("romImages") as FormArray).removeAt(index);
  }

  get roomImagesControls() {
    return (this.hotelForm.get("romImages") as FormArray).controls;
  }

  addRoom() {
    (this.hotelForm.get("romList") as FormArray).push(
      new FormGroup({
        room: new FormControl(""),
        count: new FormControl("")
      })
    );
  }

  removeRom(index: number) {
    (this.hotelForm.get("romList") as FormArray).removeAt(index);
  }

  get roomListControls() {
    return (this.hotelForm.get("romList") as FormArray).controls;
  }

  searchRegions() {
    this.regions$ = new Observable((observer: Observer<string>) => {
      // if (this.searchRegion.length > 3) {
      this.limit = 7;
      observer.next(this.searchRegion);
      // }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.providerService.getPackageRegionList().pipe(
            map((data: RegionPackage[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(
              () => {
                this.searching = false;
              },
              (err) => {
                this.limit = 0;
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  searchCitys() {
    this.citys$ = new Observable((observer: Observer<string>) => {
      // if (this.searchRegion.length > 3) {
      this.limit = 7;
      observer.next(this.searchCity);
      // }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.dashboardService.getDestination(this.searchCity).pipe(
            map((data: DestinationRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(
              () => {
                this.searching = false;
              },
              (err) => {
                // in case of http error
                this.limit = 0;
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }

  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
  }

  updateHotel() {
    if (this.hotelForm.valid) {
      const packageHotel: HotelPackage = new HotelPackage();
      const d: any = this.hotelForm.value;
      packageHotel.name = d.name;
      packageHotel.overview = d.overview;
      packageHotel.cityId = this.cityCode || this.packageHotelDetail.cityId;
      packageHotel.cityName = this.cityName || this.packageHotelDetail.cityName;
      packageHotel.regionId = this.regionCode || this.packageHotelDetail.regionId;
      packageHotel.hotelImage = d.hotelImage;
      packageHotel.regionName = this.regionName || this.packageHotelDetail.regionName;
      packageHotel.breakfast = (d.breakfast);
      packageHotel.remark = d.remark;
      packageHotel.fullFacilityDescriptions = [...d.fullFacilityDescriptions];
      packageHotel.starRate = d.starRate;
      packageHotel.latitude = d.latitude;
      packageHotel.longitude = d.longitude;
      packageHotel.additionalInfo = d.additionalInfo;
      const roomImages = [];
      d.romImages.forEach((element) => {
        let image = [];
        image = element.image;
        roomImages.push(image);
      });
      packageHotel.roomImages = roomImages;
      this.store.dispatch(new ProviderPackagesActions.UpdatePackageHotelStart({packageHotelId: this.packageHotelDetail.id, packageHotelUpdateReq: packageHotel}));
      this._location.back();
    } else {
      this.formSubmitError = true;
    }
  }
}
