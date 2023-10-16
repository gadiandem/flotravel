import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { Location } from "@angular/common";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { CurrencyNewRes } from "src/app/model/dashboard/currency/currency-new-res.model";
import { appConstant } from "src/app/app.constant";
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { RegionPackage } from '../../../../model/packages/provider/region';
import { HotelFacility } from '../../../../model/packages/provider/hotel-facility';
import { PaginationHotelFacility} from '../../../../model/packages/provider/pagination/pagination-hotel-facitities';
import { PakageProviderService } from '../../../../service/packages/packages-provider.service';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';

@Component({
  selector: 'app-hotel-info-simulator-create',
  templateUrl: './hotel-info-simulator-create.component.html',
  styleUrls: ['./hotel-info-simulator-create.component.css']
})

export class HotelInfoSimulatorCreateComponent implements OnInit {
  regions$: Observable<RegionPackage[]>;
  citys$: Observable<DestinationRes[]>;
  limit: number;
  searchCity = "";
  searchRegion = "";
  currencies: CurrencyNewRes[];
  regionName: string;
  regionCode: string;
  cityName: string;
  cityCode: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;
  hotelSimulatorForm: FormGroup;
  formSubmitError: boolean;

  facilityList: HotelFacility[];

  constructor(
    private hotelSimulatorService: HotelSimulatorService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private providerService: PakageProviderService
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.limit = 7;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.searchRegions();
    this.searchCitys();
    this.getHotelFacilityList();
  }

  private initForm() {
    this.hotelSimulatorForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      overview: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      hotelImage: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      remark: new FormControl("", [Validators.required]),
      fullFacilityDescriptions: new FormControl("", [Validators.required]),
      starRate: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
      latitude: new FormControl("", [Validators.required]),
      longitude: new FormControl("", [Validators.required]),
      minPrice:  new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0)]),
      currency: new FormControl("", [Validators.required]),
      additionalInfo: new FormControl("", [Validators.required]),
      romImages: new FormArray([]),
      discount:  new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(100)])
    });
    this.addRomImage();
  }

  addRomImage() {
    (this.hotelSimulatorForm.get("romImages") as FormArray).push(
      new FormGroup({
        image: new FormControl(""),
      })
    );
  }

  removeRomImage(index: number) {
    (this.hotelSimulatorForm.get("romImages") as FormArray).removeAt(index);
  }

  get roomImagesControls() {
    return (this.hotelSimulatorForm.get("romImages") as FormArray).controls;
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

  getHotelFacilityList() {
    this.providerService.getHotelFacilityList().subscribe((res: PaginationHotelFacility) => {
      this.facilityList = res.items || [];
    }, e => {
      console.log(e);
    });
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

  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
  }

  public facilityListAutoComplete = (text: string): Observable<HotelFacility[]> => {
    return of([...this.facilityList]);
  }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }


  createHotelSimulator() {
    if (this.hotelSimulatorForm.valid) {
      const hotelSimulator: HotelInfoSimulator = new HotelInfoSimulator();
      const d: any = this.hotelSimulatorForm.value;
      hotelSimulator.name = d.name;
      hotelSimulator.overview = d.overview;
      hotelSimulator.cityId = this.cityCode;
      hotelSimulator.cityName = this.cityName;
      hotelSimulator.regionId = this.regionCode;
      hotelSimulator.regionName = this.regionName;
      hotelSimulator.address = d.address;
      hotelSimulator.hotelImage = d.hotelImage;
      hotelSimulator.latitude = d.latitude;
      hotelSimulator.longitude = d.longitude;
      hotelSimulator.starRate = d.starRate;
      hotelSimulator.minPrice = d.minPrice;
      hotelSimulator.currency = d.currency;
      hotelSimulator.remark = d.remark;
      hotelSimulator.fullFacilityDescriptions = d.fullFacilityDescriptions;
      hotelSimulator.discount = d.discount
      hotelSimulator.additionalInfo = d.additionalInfo;
      const roomImages = [];
      d.romImages.forEach((element) => {
        let image = [];
        image = element.image;
        roomImages.push(image);
      });
      hotelSimulator.roomImages = roomImages;
      this.hotelSimulatorService.createHotelInfoSimulator(hotelSimulator).subscribe(
        (res: HotelInfoSimulator) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create ${res.name} create successful!`);
          this._location.back();
        },
        (e) => {
          this.alertify.error(`Create ${hotelSimulator.name} error!. ${e}`);
        }
      );
    } else {
      this.formSubmitError = true;
    }
  }
}
