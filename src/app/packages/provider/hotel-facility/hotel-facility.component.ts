import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";
import { HotelFacility } from 'src/app/model/packages/provider/hotel-facility';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from 'src/app/model/packages/provider/pagination/pageable';

@Component({
  selector: 'app-hotel-facility',
  templateUrl: './hotel-facility.component.html',
  styleUrls: ['./hotel-facility.component.css']
})
export class HotelFacilityComponent implements OnInit {
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
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.pageSize = 10;
    this.page = 0;
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if(data.packageHotelFacilityListRes){
        this.gridViewData = {
          data:  data.packageHotelFacilityListRes.items,
          total: data.packageHotelFacilityListRes.totalItems,
        };
        this.gridView = this.gridViewData;
      } else {
        this.gridViewData = null;
        this.gridView = this.gridViewData;
      }
    })
    if (this.initialLoad === true){
      this.getHotelFacilityList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }

  getHotelFacilityList(pageable: Pageable) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelFacilityListStart({data: pageable}));
  }
  public onFilter(inputValue: string): void {
    this.gridView.data = process(this.gridViewData.data, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "name",
            operator: "contains",
            value: inputValue,
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.page = this.skip / this.pageSize;
    this.loadItems();
  }

  private loadItems(): void {
    this.getHotelFacilityList({page: this.page, pageSize: this.pageSize});
  }

  editFacility(facility: HotelFacility) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelFacilityDetailStart({packageHotelFacilityId: facility.id}));
    this.router.navigate(["/packagesProvider/hotelFacility/edit", facility.id]);
  }

  remvoveFacility(facilityId: string){
    this.alertify.confirm('Are you sure you want to delete this HotelFacility?', () => {
        this.store.dispatch(new ProviderPackagesActions.RemovePackageHotelFacilityStart({packageHotelFacilityId: facilityId}));
    });

  }

  createFacility(){
    this.router.navigate(['/packagesProvider/hotelFacility/create']);
  }
}
