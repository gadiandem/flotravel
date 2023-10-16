import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { map, switchMap, tap } from "rxjs/operators";
import { Observable, Observer, of } from "rxjs";

import { PackageAvailability } from "src/app/model/packages/provider/package-availability";
import { PackageInfo } from "src/app/model/packages/provider/package-info";

import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { DatePipe } from "@angular/common";
import { PackageAvailabilitySearch } from "src/app/model/packages/provider/package-availability-search";
import { PackageAvailabilityView } from "src/app/model/packages/provider/package-availability-view";
import { AlertifyService } from "src/app/service/alertify.service";
import { PackageAvailabilityReq } from "src/app/model/packages/provider/package-availability-create-req";
@Component({
  selector: "app-package-availability",
  templateUrl: "./package-availability.component.html",
  styleUrls: ["./package-availability.component.css"],
})
export class PackageAvailabilityComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridView: PackageAvailabilityView[];

  searchForm: FormGroup;

  packageInfos$: Observable<PackageInfo[]>;
  searchpackageInfos = "";
  limit: number;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  packageInfoName: string;
  packageInfoId: string;
  isLoading = false;
  minDate = new Date();

  packageInfos: PackageInfo[];
  constructor(
    protected datepipe: DatePipe,
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.limit = 7;
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: this.minDate,
        showWeekNumbers: false,
      }
    );
    this.initForm();
    this.searchPackageInfos();
    this.packageInfos = JSON.parse(sessionStorage.getItem('pacakgeInfos')) || [];
  }
  private initForm() {
    this.searchForm = new FormGroup({
      pacakgeInfo: new FormControl("", [Validators.required]),
      startDate: new FormControl("", [Validators.required]),
      endDate: new FormControl("", [Validators.required]),
    });
  }

  onValueChange(value: Date): void {
    (this.searchForm.get("startDate") as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }

  searchPackageInfos() {
    this.packageInfos$ = new Observable((observer: Observer<string>) => {
      // if (this.searchRegion.length > 3) {
      this.limit = 7;
      observer.next(this.searchpackageInfos);
      // }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.providerService.getPackageInfoListByName(this.searchpackageInfos).pipe(
            map((data: PackageInfo[]) => {
              this.searchFailed = false;
              this.packageInfos = data || [];
              sessionStorage.setItem('pacakgeInfos', JSON.stringify(this.packageInfos));
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

  selectPackageInfo(des: any) {
    this.packageInfoName = des.name;
    this.packageInfoId = des.id;
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "customer",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "tour",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "time",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  viewDetail(packageAvailability: PackageAvailability) {
    this.router.navigate([
      "/packages/provider/availability",
      packageAvailability.id,
    ]);
    sessionStorage.setItem(
      "hotelPackageDetail",
      JSON.stringify(packageAvailability)
    );
  }

  getPackageAvailability() {
    const d: any = this.searchForm.value;
    const searchRequest: PackageAvailabilitySearch =
      new PackageAvailabilitySearch();
    searchRequest.startDate = this.datepipe.transform(
      d.startDate,
      "yyyy-MM-dd"
    );
    searchRequest.endDate = this.datepipe.transform(d.endDate, "yyyy-MM-dd");
    searchRequest.packageId = this.packageInfoId;
    console.log(searchRequest);
    this.providerService
      .getPackageAvailabilityList(searchRequest)
      .subscribe(
        (res: PackageAvailability[]) => {
          this.updateAvailabilityTable(res);
          this.isLoading = false;
        },
        (e) => {
          console.log(e);
          this.isLoading = false;
        }
      );
  }



  createPackageAvailability(){
    const d: any = this.searchForm.value;
    const createPackageAvailability: PackageAvailabilityReq =
      new PackageAvailabilityReq();
    createPackageAvailability.startDate = this.datepipe.transform(d.startDate,"yyyy-MM-dd"
    );
    createPackageAvailability.endDate = this.datepipe.transform(d.endDate, "yyyy-MM-dd");
    createPackageAvailability.count = 100;
    this.providerService
      .createPackageAvailability(createPackageAvailability, this.packageInfoId)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.alertify.success(`Create Availability successful!`);
          this.getPackageAvailability();
        },
        (e) => {
          console.log(e);
          this.isLoading = false;
          this.alertify.error(`Create Availability error!`);
        }
      );
  }


  updateAvailabilityTable(data: PackageAvailability[]){
    const viewData: PackageAvailabilityView[] = [];
    data.forEach(element => {
      const pacakgeInfo = this.packageInfos.find(item => item.id === element.packageId);
      const availabilityItem = new PackageAvailabilityView();
      Object.assign(availabilityItem, pacakgeInfo);
      availabilityItem.date = element.date;
      availabilityItem.id = element.id;
      viewData.push(availabilityItem);
    });
    this.gridView = viewData;
  }


  removePackageAvailability(availabilityId: string){
    this.alertify.confirm('Are you sure you want to delete this Availability?', () => {
      this.providerService.removePackageAvailability(availabilityId, this.packageInfoId, false).subscribe(
        (res: any) => {
          this.alertify.success(`Delete Availability successful!`);
          this.getPackageAvailability();
        }, e => {
          this.alertify.error(`Delete Availability error!. ${e}`);
        }
      )
    });
  }

  deletePackageByType(){
    this.alertify.confirm(`Are you sure you want to delete availability of type ${this.packageInfoName}?`, () => {
      this.providerService.removePackageAvailability(this.packageInfoId, this.packageInfoId, true).subscribe(
        (res: any) => {
          this.alertify.success(`Delete Availability successful!`);
          this.getPackageAvailability();
        }, e => {
          this.alertify.error(`Delete Availability error!. ${e}`);
        }
      )
    });
  }
}
