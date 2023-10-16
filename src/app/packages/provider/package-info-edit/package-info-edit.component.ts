import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TagInputModule } from "ngx-chips";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import {Location} from '@angular/common';

import { PackageInfo } from "src/app/model/packages/provider/package-info";
import { RegionPackage } from "src/app/model/packages/provider/region";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { CurrencyNewRes } from "src/app/model/dashboard/currency/currency-new-res.model";
import { appConstant } from "src/app/app.constant";
import { TaxPackage } from "src/app/model/packages/provider/tax-package";
import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";
import { TourPackage } from "src/app/model/packages/provider/tour-package";
import { TransferInPackage } from "src/app/model/packages/provider/transfer-package";
import { PaginationTransferPackage } from "src/app/model/packages/provider/pagination/pagination-transfer-package";
import { PaginationHotelPackage } from "src/app/model/packages/provider/pagination/pagination-hotel-package";
import { PaginationSupplementPackage } from "src/app/model/packages/provider/pagination/pagination-supplement-package";
import { PaginationTourPackage } from "src/app/model/packages/provider/pagination/pagination-tour-package";

TagInputModule.withDefaults({
  tagInput: {
    placeholder: "Add a activity",
    // add here other default values for tag-input
  },
});

interface ModelAutoComplete {
  id: string;
  name: string;
}

@Component({
  selector: "app-package-info-edit",
  templateUrl: "./package-info-edit.component.html",
  styleUrls: ["./package-info-edit.component.css"],
})
export class PackageInfoEditComponent implements OnInit {
  packageInfoId: string;
  packageInfoDetail: PackageInfo;
  isLoading = false;
  isCancelling = false;

  hotelList: HotelPackage[];
  hotelDetail: HotelPackage;
  itineraryCount = 0;

  packageInfoForm: FormGroup;
  formSubmitError: boolean;

  regions$: Observable<RegionPackage[]>;
  citys$: Observable<DestinationRes[]>;
  hotels$: Observable<HotelPackage[]>;
  limit: number;
  currencies: CurrencyNewRes[];
  searchRegion = "";
  searchCity = "";
  searchHotel = "";
  regionName: string;
  regionCode: string;
  cityName: string;
  cityCode: string;
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  supplements: ModelAutoComplete[];
  tours: ModelAutoComplete[];
  transfers: ModelAutoComplete[];

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.supplements = [];
    this.tours = []
    this.transfers = []
    this.packageInfoDetail = new PackageInfo();
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.activeRoute.params.subscribe((params: Params) => {
      this.packageInfoId = params["packageId"];
      // this.isLoading = true;
      this.loadPackageDetail();
    });
    this.initForm();
    this.searchRegions();
    this.searchCitys();
    this.searchHotels();
    this.getSupplementList();
    this.getTourList();
    this.getTransferList();
  }

  loadPackageDetail() {
    this.providerService.getPackageDetail(this.packageInfoId).subscribe(
      (res: PackageInfo) => {
        this.packageInfoDetail = res;
        this.isLoading = false;
        this.getPackageHotelList();
        this.updateFormWithData();
      },
      (e) => {
        this.isLoading = false;
      }
    );
  }

  getSupplementList() {
    this.providerService.getPackageSupplementList().subscribe((res: PaginationSupplementPackage) => {
      this.supplements = res.items;
      this.updateSupplements();
    }, e => {
      console.log(e);
    });
  }

  getTourList() {
    this.providerService.getPackageTourList().subscribe((res: PaginationTourPackage) => {
      this.tours = res.items;
      this.updateTours();
    }, e => {
      console.log(e);
    });
  }

  getTransferList() {
    this.providerService.getPackageTransferList().subscribe((res: PaginationTransferPackage) => {
      // this.supplements = res;
      res.items.forEach(t => {
        this.transfers.push({id: t.id, name: t.transferType})
      })
      this.updateTransfers();
    }, e => {
      console.log(e);
    });
  }

  getPackageHotelList() {
    this.providerService.getPackageHotelList().subscribe((res: PaginationHotelPackage) => {
      this.hotelList = res.items;
      this.updateHotelView(this.packageInfoDetail.hotelId);
    });
  }


  supplementListAutoComplete = (text: string): Observable<ModelAutoComplete[]> => {
    return of([...this.supplements]);
  }

  tourListAutoComplete = (text: string): Observable<ModelAutoComplete[]> => {
    return of([...this.tours]);
  }
  transferListAutoComplete = (text: string): Observable<ModelAutoComplete[]> => {
    return of([...this.transfers]);
  }

  private initForm() {
    this.packageInfoForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      dayCount: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]+$"),
      ]),
      city: new FormControl("", [Validators.required]),
      itineraries: new FormArray([]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
      hotel: new FormControl("", [Validators.required]),
      supplements: new FormControl(""),
      tours: new FormControl(""),
      transfers: new FormControl("")
    });
  }
  private updateFormWithData() {
    this.packageInfoForm.patchValue({
      name: this.packageInfoDetail.name,
      region: this.packageInfoDetail.regionName,
      description: this.packageInfoDetail.basicDescription,
      dayCount: this.packageInfoDetail.dayCount,
      // nightCount: this.packageInfoDetail.nightCount,
      city: this.packageInfoDetail.cityName,
      price: this.packageInfoDetail.price,
      currency: this.packageInfoDetail.currency,
    });

    if(this.supplements.length > 0){
      const suppTemp = [];
      this.packageInfoDetail.supplements.forEach(s => {
        suppTemp.push(this.supplements.find(i => i.id === s))
      })
      this.packageInfoForm.patchValue({
        supplements: suppTemp
      })
    }
    for (let i = 0; i < this.packageInfoDetail.itineraries.length; i++) {
      this.addItinerary();
    }
    if(this.supplements.length > 0){
      this.updateSupplements();
    }
    if(this.tours.length > 0){
      this.updateTours();
    }
    if(this.transfers.length > 0){
      this.updateTransfers();
    }
  }

  updateSupplements(){
    if(this.supplements.length > 0 && !this.packageInfoForm.value.supplements){
      const suppTemp = [];
      this.packageInfoDetail.supplements.forEach(s => {
        const supp = this.supplements.find(i => i.id === s);
        if(supp){
          suppTemp.push(supp)
        }
      })
      this.packageInfoForm.patchValue({
        supplements: suppTemp
      })
    }
  }

  updateTours(){
    if(this.tours.length > 0 && !this.packageInfoForm.value.tours){
      const tourTemp = [];
      this.packageInfoDetail.tours.forEach(s => {
        const tour = this.tours.find(i => i.id === s);
        if(tour){
          tourTemp.push(tour)
        }
      })
      this.packageInfoForm.patchValue({
        tours: tourTemp
      })
    }
  }

  updateTransfers(){
    if(this.transfers.length > 0 && !this.packageInfoForm.value.transfers){
      const transferTemp = [];
      this.packageInfoDetail.transfers.forEach(s => {
        const trans = this.transfers.find(i => i.id === s)
        if(trans){
          transferTemp.push(trans)
        }
      })
      this.packageInfoForm.patchValue({
        transfers: transferTemp
      })
    }
  }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }
  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
    console.log('cityCdoe: ' + this.cityCode)
  }

  selectHotel(des: any) {
    this.hotelName = des.name;
    this.hotelId = des.id;
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
          // using github public api to get users by name
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

  searchHotels() {
    this.hotels$ = new Observable((observer: Observer<string>) => {
      // if (this.searchRegion.length > 3) {
      this.limit = 7;
      observer.next(this.searchHotel);
      // }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.providerService.getPackageHotelListByName(this.searchHotel).pipe(
            map((data: HotelPackage[]) => {
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
  updateHotelView(hotelId: string) {
    this.hotelDetail = this.hotelList.find((hotel) => hotel.id === hotelId);
    this.searchHotel = this.hotelDetail.name;
  }

  addItinerary() {
    (this.packageInfoForm.get("itineraries") as FormArray).push(
      new FormGroup({
        activity: new FormControl(""),
      })
    );
    this.itineraryCount++;
    console.log(this.itineraryCount);
  }

  removeItinerary(index: number) {
    this.itineraryCount--;
    (this.packageInfoForm.get("itineraries") as FormArray).removeAt(index);
  }

  get itinerariesControls() {
    return (this.packageInfoForm.get("itineraries") as FormArray).controls;
  }
  updatePackage() {
    if(this.packageInfoForm.valid){
      const packageInfo: PackageInfo = new PackageInfo();
      const d: any = this.packageInfoForm.value;
      packageInfo.name = d.name;
      packageInfo.basicDescription = d.description;
      packageInfo.cityId = this.cityCode || this.packageInfoDetail.cityId;
      packageInfo.cityName = this.cityName || this.packageInfoDetail.cityName;
      packageInfo.regionId = this.regionCode || this.packageInfoDetail.regionId;
      packageInfo.regionName =
        this.regionName || this.packageInfoDetail.regionName;
      packageInfo.dayCount = +d.dayCount;
      packageInfo.hotelId = this.hotelId || this.packageInfoDetail.hotelId;
      packageInfo.price = d.price;
      packageInfo.currency = d.currency;
      const itineraries = [];
      d.itineraries.forEach((element) => {
        let itenirary = [];
        itenirary = element.activity;
        if(itenirary){
          itineraries.push(itenirary.map((item) => item.value || item));
        }
      });
      packageInfo.itineraries = itineraries;

      const supplements = []
      d.supplements.forEach(e => {
        let supplement = [];
        supplement = e.id;
        if (supplement) {
          supplements.push(supplement);
        }
      })
      packageInfo.supplements = supplements;

      const tours = []
      d.tours.forEach(e => {
        let tour = [];
        tour = e.id;
        if (tour) {
          tours.push(tour);
        }
      })
      packageInfo.tours = tours;

      const transfers = []
      d.transfers.forEach(e => {
        let transfer = [];
        transfer = e.id;
        if (transfer) {
          transfers.push(transfer);
        }
      })
      packageInfo.transfers = transfers;

      this.providerService
        .updatePackageDetail(packageInfo, this.packageInfoDetail.id)
        .subscribe(
          (res: PackageInfo) => {
            console.log(JSON.stringify(res));
            this.alertify.success(`Update ${res.name} create succeeful!`);
            this._location.back();
          },
          (e) => {
            this.alertify.error(`Update ${packageInfo.name} error!. ${e}`);
          }
        );
    } else {
      this.formSubmitError = true;
    }
    // console.log(JSON.stringify(packageInfo));
  }
}
