import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TagInputModule } from "ngx-chips";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { Location } from "@angular/common";

import { PackageInfo } from "src/app/model/packages/provider/package-info";
import { RegionPackage } from "src/app/model/packages/provider/region";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { CurrencyNewRes } from "src/app/model/dashboard/currency/currency-new-res.model";
import { appConstant } from "src/app/app.constant";
import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";
import { TourPackage } from "src/app/model/packages/provider/tour-package";
import { TransferInPackage } from "src/app/model/packages/provider/transfer-package";
import { PaginationSupplementPackage } from "src/app/model/packages/provider/pagination/pagination-supplement-package";
import { PaginationTourPackage } from "src/app/model/packages/provider/pagination/pagination-tour-package";
import { PaginationTransferPackage } from "src/app/model/packages/provider/pagination/pagination-transfer-package";
// import { TaxPackage } from "src/app/model/packages/provider/tax-package";

interface ModelAutoComplete {
  id: string;
  name: string;
}

@Component({
  selector: "app-package-info-create",
  templateUrl: "./package-info-create.component.html",
  styleUrls: ["./package-info-create.component.css"],
})
export class PackageInfoCreateComponent implements OnInit {
  regions$: Observable<RegionPackage[]>;
  citys$: Observable<DestinationRes[]>;
  hotels$: Observable<HotelPackage[]>;
  // taxs$: Observable<TaxPackage[]>;
  limit: number;
  searchRegion = "";
  searchCity = "";
  searchHotel = "";
  // searchTax = "";
  currencies: CurrencyNewRes[];
  regionName: string;
  regionCode: string;
  cityName: string;
  cityCode: string;
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;
  // taxName: string;
  // taxCode: string;

  packageInfoForm: FormGroup;
  formSubmitError: boolean;
  itineraryCount = 0;
  dayCount = 1;

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
    this.limit = 7;
    this.supplements = [];
    this.tours = []
    this.transfers = []
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.updateDateCount();
    this.searchRegions();
    this.searchCitys();
    this.searchHotels();
    // this.searchTaxs();
    this.getSupplementList();
    this.getTourList();
    this.getTransferList();
  }

  getSupplementList() {
    this.providerService.getPackageSupplementList().subscribe((res: PaginationSupplementPackage) => {
      this.supplements = res.items;
    }, e => {
      console.log(e);
    });
  }

  getTourList() {
    this.providerService.getPackageTourList().subscribe((res: PaginationTourPackage) => {
      this.tours = res.items;
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
    }, e => {
      console.log(e);
    });
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
      // tax: new FormControl(""),
      city: new FormControl("", [Validators.required]),
      itineraries: new FormArray([]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
      hotel: new FormControl("", [Validators.required]),
      supplements: new FormControl(""),
      tours: new FormControl(""),
      transfers: new FormControl("")
    });
    this.addItinerary();
  }

  addItinerary() {
    (this.packageInfoForm.get("itineraries") as FormArray).push(
      new FormGroup({
        activity: new FormControl(""),
      })
    );
    this.itineraryCount++;
  }

  removeItinerary(index: number) {
    this.itineraryCount--;
    (this.packageInfoForm.get("itineraries") as FormArray).removeAt(index);
  }

  get itinerariesControls() {
    return (this.packageInfoForm.get("itineraries") as FormArray).controls;
  }

  updateDateCount() {
    this.packageInfoForm.get("dayCount").valueChanges.subscribe((x) => {
      console.log(x);
      this.dayCount = x;
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

  // searchTaxs() {
  //   this.taxs$ = new Observable((observer: Observer<string>) => {
  //     // if (this.searchRegion.length > 3) {
  //     this.limit = 7;
  //     observer.next(this.searchTax);
  //     // }
  //   }).pipe(
  //     switchMap((query: string) => {
  //       if (query) {
  //         // using github public api to get users by name
  //         return this.providerService.getPackageTaxList().pipe(
  //           map((data: TaxPackage[]) => {
  //             this.searchFailed = false;
  //             return data || [];
  //           }),
  //           tap(
  //             () => {
  //               this.searching = false;
  //             },
  //             (err) => {
  //               // in case of http error
  //               this.limit = 0;
  //               this.searchFailed = true;
  //               this.errorMessage =
  //                 (err && err.message) || "Something goes wrong";
  //             }
  //           )
  //         );
  //       }
  //       return of([]);
  //     })
  //   );
  // }

  selectRegion(des: any) {
    this.regionName = des.name;
    this.regionCode = des.id;
  }
  selectCity(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
  }

  selectHotel(des: any) {
    this.hotelName = des.name;
    this.hotelId = des.id;
  }

  createPackage() {
    if (this.packageInfoForm.valid) {
      const packageInfo: PackageInfo = new PackageInfo();
      const d: any = this.packageInfoForm.value;
      packageInfo.name = d.name;
      packageInfo.basicDescription = d.description;
      packageInfo.cityId = this.cityCode;
      packageInfo.cityName = this.cityName;
      packageInfo.regionId = this.regionCode;
      packageInfo.regionName = this.regionName;
      packageInfo.dayCount = +d.dayCount;
      // packageInfo.taxId = this.taxCode;
      packageInfo.hotelId = this.hotelId;
      packageInfo.price = d.price;
      packageInfo.currency = d.currency;
      const itineraries = [];
      d.itineraries.forEach((element) => {
        let itinerary = [];
        itinerary = element.activity;
        itineraries.push(itinerary.map((item) => item.value || item));
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

      this.providerService.createPackageDetail(packageInfo).subscribe(
        (res: PackageInfo) => {
          console.log(JSON.stringify(res));
          this.alertify.success(`Create ${res.name} create succeeful!`);
          this._location.back();
        },
        (e) => {
          this.alertify.error(`Create ${packageInfo.name} error!. ${e}`);
        }
      );
    } else {
      this.formSubmitError = true;
    }
    // console.log(JSON.stringify(packageInfo));
  }
}
