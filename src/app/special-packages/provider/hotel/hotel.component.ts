import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";

import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { AlertifyService } from "src/app/service/alertify.service";

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';


@Component({
  selector: "app-hotel",
  templateUrl: "./hotel.component.html",
  styleUrls: ["./hotel.component.css"],
})
export class HotelComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: HotelPackage[] = [];
  public gridView: HotelPackage[] = [];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.select('providerSpecialPackages').subscribe(data => {
        this.fetching = data.loading;
        this.fetchFailed = data.failure;
        this.errorMes = data.errorMessage;
        this.gridViewData = data.packageHotelListRes;
        this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.getPackageHotelList();
      this.initialLoad = false;
    }
  }

  getPackageHotelList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelListStart());
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridViewData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "city",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "region",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  viewDetail(hotelDetail: HotelPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelDetailStart({packageHotelId: hotelDetail.id}));
    this.router.navigate(["/specialPackagesProvider/hotel", hotelDetail.id]);
  }

  removePackageHotel(packageId: string) {
    this.alertify.confirm('Are you sure you want to delete this Hotel?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageHotelStart({packageHotelId: packageId}));
    });
  }
  createHotel(){
    this.router.navigate(['/specialPackagesProvider/hotel/create']);
  }

}
