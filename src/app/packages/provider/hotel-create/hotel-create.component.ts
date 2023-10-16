import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable, Observer, of } from "rxjs";
import { Location } from "@angular/common";
import { map, switchMap, tap } from "rxjs/operators";

import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { RegionPackage } from "src/app/model/packages/provider/region";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { TaxPackage } from "src/app/model/packages/provider/tax-package";
import { HotelFacility } from "src/app/model/packages/provider/hotel-facility";
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { PaginationHotelFacility } from "src/app/model/packages/provider/pagination/pagination-hotel-facitities";

@Component({
  selector: "app-hotel-create",
  templateUrl: "./hotel-create.component.html",
  styleUrls: ["./hotel-create.component.css"],
})
export class HotelCreateComponent implements OnInit {
  regions$: Observable<RegionPackage[]>;
  citys$: Observable<DestinationRes[]>;
  // taxs$: Observable<TaxPackage[]>;
  limit: number;
  searchRegion = "";
  searchCity = "";
  // searchTax = "";
  regionName: string;
  regionCode: string;
  cityName: string;
  cityCode: string;
  taxName: string;
  taxCode: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  hotelForm: FormGroup;
  formSubmitError: boolean;

  facilityList: HotelFacility[];
  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
    this.searchRegions();
    this.searchCitys();
    this.getHotelFacilityList();
  }

  getHotelFacilityList() {
    this.providerService.getHotelFacilityList().subscribe((res: PaginationHotelFacility) => {
      this.facilityList = res.items || [];
    }, e => {
      console.log(e);
    });
  }
  private initForm() {
    this.hotelForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      overview: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      hotelImage: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      breakfast: new FormControl(false, [Validators.required]),
      remark: new FormControl("", [Validators.required]),
      fullFacilityDescriptions: new FormControl("", [Validators.required]),
      starRate: new FormControl("", [Validators.required]),
      latitude: new FormControl("", [Validators.required]),
      longitude: new FormControl("", [Validators.required]),
      additionalInfo: new FormControl("", [Validators.required]),
      romImages: new FormArray([]),
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

  searchRegions() {
    this.regions$ = new Observable((observer: Observer<string>) => {
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
  public facilityListAutoComplete = (text: string): Observable<HotelFacility[]> => {
    return of([...this.facilityList]);
  }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }

  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
  }

  createHotel() {
    if (this.hotelForm.valid) {
      const packageHotel: HotelPackage = new HotelPackage();
      const d: any = this.hotelForm.value;
      packageHotel.name = d.name;
      packageHotel.overview = d.overview;
      packageHotel.cityId = this.cityCode;
      packageHotel.cityName = this.cityName;
      packageHotel.regionId = this.regionCode;
      packageHotel.regionName = this.regionName;
      packageHotel.hotelImage = d.hotelImage;
      packageHotel.taxId = this.taxCode;
      packageHotel.minPrice = d.minPrice;
      packageHotel.currency = d.currency;
      packageHotel.breakfast = d.breakfast;
      packageHotel.remark = d.remark;
      packageHotel.fullFacilityDescriptions = d.fullFacilityDescriptions;
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
      this.store.dispatch(new ProviderPackagesActions.CreatePackageHotelStart({packageHotelCreateReq: packageHotel}));
      this._location.back();
    } else {
      this.formSubmitError = true;
    }
  }
}
