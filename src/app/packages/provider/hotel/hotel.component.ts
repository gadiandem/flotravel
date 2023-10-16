import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";

import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from "src/app/model/packages/provider/pagination/pageable";

@Component({
  selector: "app-hotel",
  templateUrl: "./hotel.component.html",
  styleUrls: ["./hotel.component.css"],
})
export class HotelComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: GridDataResult;
  public gridView: GridDataResult;
  public skip = 0;
  pageSize: number;
  page: number;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.page = 0;
    this.store.select('providerPackages').subscribe(data => {
        this.fetching = data.loading;
        this.fetchFailed = data.failure;
        this.errorMes = data.errorMessage;
        if(data.packageHotelListRes){
          this.gridViewData = {
            data:  data.packageHotelListRes.items,
            total: data.packageHotelListRes.totalItems,
          };
          this.gridView = Object.assign({}, this.gridViewData);
        } else {
          this.gridViewData = null;
          this.gridView = Object.assign({}, this.gridViewData);
        }
    })
    if (this.initialLoad) {
      this.getPackageHotelList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }

  getPackageHotelList(pageable: Pageable) {

    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelListStart({data: pageable}));
  }

  public onFilter(data: any[], hotelName: string): void {
    this.gridView.data = process(data, {
      // filter: {
      //   logic: "or",
      //   filters: [
      //     {
      //       field: "name",
      //       operator: "contains",
      //       value: hotelName,
      //     },
          // {
          //   field: "city",
          //   operator: "contains",
          //   value: inputValue,
          // },
          // {
          //   field: "region",
          //   operator: "contains",
          //   value: inputValue,
          // },
        // ],
      // },
    }).data;
    this.gridView.total = data.length;
    if(this.dataBinding){
      this.dataBinding.skip = 0;
    }
  }

  searchHotel(hotelName: string){
    if(hotelName){
      this.providerService.searchPackageHotelByName(hotelName).subscribe(
        (res: any[]) => {
          this.onFilter(res, hotelName);
        }
      )
    } else {
      this.gridView = Object.assign({}, this.gridViewData);
    }
  }
  
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.page = this.skip / this.pageSize;
    this.loadItems();
  }

  private loadItems(): void {
    this.getPackageHotelList({page: this.page, pageSize: this.pageSize});
  }

  viewDetail(hotelDetail: HotelPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelDetailStart({packageHotelId: hotelDetail.id}));
    this.router.navigate(["/packagesProvider/hotel", hotelDetail.id]);
  }

  removePackageHotel(packageId: string) {
    this.alertify.confirm('Are you sure you want to delete this Hotel?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageHotelStart({packageHotelId: packageId}));
    });
  }
  createHotel(){
    this.router.navigate(['/packagesProvider/hotel/create']);
  }

}
