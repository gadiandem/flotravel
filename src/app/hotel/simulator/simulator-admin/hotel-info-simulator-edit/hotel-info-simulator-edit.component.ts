import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { Observable, Observer, of } from "rxjs";
import { Location } from "@angular/common";
import { map, switchMap, tap } from "rxjs/operators";
import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { appConstant } from '../../../../app.constant';
import { UserDetail } from '../../../../model/auth/user/user-detail';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';
import { CurrencyNewRes } from '../../../../model/dashboard/currency/currency-new-res.model';
import { RegionPackage } from '../../../../model/packages/provider/region';
import { HotelFacility } from '../../../../model/packages/provider/hotel-facility';
import { PaginationHotelFacility } from '../../../../model/packages/provider/pagination/pagination-hotel-facitities';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-hotel-info-simulator-edit',
  templateUrl: './hotel-info-simulator-edit.component.html',
  styleUrls: ['./hotel-info-simulator-edit.component.css']
})
export class HotelInfoSimulatorEditComponent implements OnInit {
  currencies: CurrencyNewRes[];
  hotelSimulatorId: string;
  hotelSimulatorDetail: HotelInfoSimulator;
  user: UserDetail;
  isLoading = false;
  citys$: Observable<DestinationRes[]>;
  regions$: Observable<RegionPackage[]>;

  limit: number;
  searchCity = "";
  searchRegion = "";
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
  selectedValue: string;
  selectedOption: any;
  previewOption?: any;

  constructor(
    private providerService: PakageProviderService,
    protected router: Router,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store : Store<fromApp.AppState>,
    private hotelSimulatorService: HotelSimulatorService
  ) { }

  ngOnInit() {
    this.initForm();
    this.facilityList = []
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.formSubmitError = false;
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    this.activeRoute.params.subscribe((params: Params) => {
      this.hotelSimulatorId = params['hotelInfoId'];
    });
    if (this.user != null) {
      this.isLoading = true;
      this.hotelSimulatorService.getHotelInfoSimulatorById(this.hotelSimulatorId).subscribe(data => {
        this.hotelSimulatorDetail = data;
        if (this.hotelSimulatorDetail) {
          this.updateFormWithData();
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      })
    }
    this.searchCitys();
    this.getHotelFacilityList();
    this.searchRegions();
  }

  getHotelFacilityList() {
    this.providerService.getHotelFacilityList().subscribe((res: PaginationHotelFacility) => {
      this.facilityList = res.items || [];
    }, e => {
      console.log(e);
    });
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.hotelSimulatorForm.patchValue({
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

  public facilityListAutoComplete = (text: string): Observable<HotelFacility[]> => {
    return of([...this.facilityList]);
  }

  private updateFormWithData() {
    this.hotelSimulatorForm.patchValue({
      name: this.hotelSimulatorDetail.name,
      overview: this.hotelSimulatorDetail.overview,
      region: this.hotelSimulatorDetail.regionName,
      hotelImage: this.hotelSimulatorDetail.hotelImage,
      city: this.hotelSimulatorDetail.cityName,
      address: this.hotelSimulatorDetail.address,
      remark: this.hotelSimulatorDetail.remark,
      fullFacilityDescriptions: this.hotelSimulatorDetail.fullFacilityDescriptions,
      starRate: this.hotelSimulatorDetail.starRate,
      latitude: this.hotelSimulatorDetail.latitude,
      longitude: this.hotelSimulatorDetail.longitude,
      minPrice: this.hotelSimulatorDetail.minPrice,
      currency: this.hotelSimulatorDetail.currency,
      additionalInfo: this.hotelSimulatorDetail.additionalInfo,
      discount: this.hotelSimulatorDetail.discount,
    });
    for (let i = 1; i < this.hotelSimulatorDetail.roomImages.length; i++) {
      this.addRomImage();
    }
    for (let j = 0; j < this.hotelSimulatorDetail.roomImages.length; j++) {
      this.updateRomImage(j);
    }
  }

  updateRomImage(i: number) {
    let romImages = <FormArray>this.hotelSimulatorForm.get("romImages");
    romImages.controls[i].get('image').patchValue(this.hotelSimulatorDetail.roomImages[i]);
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

  initForm() {
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

  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
  }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }

  updateHotel() {
    if (this.hotelSimulatorForm.valid) {
      const hotelInfoSimulator: HotelInfoSimulator = new HotelInfoSimulator();
      const d: any = this.hotelSimulatorForm.value;
      hotelInfoSimulator.name = d.name;
      hotelInfoSimulator.overview = d.overview;
      hotelInfoSimulator.cityId = this.cityCode || this.hotelSimulatorDetail.cityId;
      hotelInfoSimulator.cityName = this.cityName || this.hotelSimulatorDetail.cityName;
      hotelInfoSimulator.regionId = this.regionCode || this.hotelSimulatorDetail.regionId;
      hotelInfoSimulator.regionName = this.regionName || this.hotelSimulatorDetail.regionName;
      hotelInfoSimulator.address = d.address;
      hotelInfoSimulator.hotelImage = d.hotelImage;
      hotelInfoSimulator.latitude = d.latitude;
      hotelInfoSimulator.longitude = d.longitude;
      hotelInfoSimulator.starRate = d.starRate;
      hotelInfoSimulator.minPrice = d.minPrice;
      hotelInfoSimulator.currency = d.currency;
      hotelInfoSimulator.remark = d.remark;
      hotelInfoSimulator.fullFacilityDescriptions = [...d.fullFacilityDescriptions];
      hotelInfoSimulator.discount = d.discount
      hotelInfoSimulator.additionalInfo = d.additionalInfo;
      const roomImages = [];
      d.romImages.forEach((element) => {
        let image = [];
        image = element.image;
        roomImages.push(image);
      });
      hotelInfoSimulator.roomImages = roomImages;
      this.hotelSimulatorService.updateHotelInfoSimulator(hotelInfoSimulator, this.hotelSimulatorId).subscribe(
        (res: HotelInfoSimulator) => {
       //   console.log(JSON.stringify(res));
          this.alertify.success(`Update ${res.name} successful!`);
        },
        (e) => {
          this.alertify.error(`Update ${hotelInfoSimulator.name} error!. ${e}`);
        }
      );
      this.router.navigate(['/hotelSimulatorAdmin/hotelInfoList']);
     // this._location.back();
    } else {
      this.formSubmitError = true;
    }
  }

}
