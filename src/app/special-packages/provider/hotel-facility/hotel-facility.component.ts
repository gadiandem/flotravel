import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";
import { HotelFacility } from 'src/app/model/packages/provider/hotel-facility';
import { AlertifyService } from 'src/app/service/alertify.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-hotel-facility',
  templateUrl: './hotel-facility.component.html',
  styleUrls: ['./hotel-facility.component.css']
})
export class HotelFacilityComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: HotelFacility[];
  public gridView: HotelFacility[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageHotelFacilityListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true){
      this.getPackageRegionList();
      this.initialLoad = false;
    }
  }

  getPackageRegionList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelFacilityListStart());
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
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  editFacility(facility: HotelFacility) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelFacilityDetailStart({packageHotelFacilityId: facility.id}));
    this.router.navigate(["/specialPackagesProvider/hotelFacility/edit", facility.id]);
  }

  removeFacility(facilityId: string){
    this.alertify.confirm('Are you sure you want to delete this HotelFacility?', () => {
        this.store.dispatch(new ProviderPackagesActions.RemovePackageHotelFacilityStart({packageHotelFacilityId: facilityId}));
    });

  }

  createFacility(){
    this.router.navigate(['/specialPackagesProvider/hotelFacility/create']);
  }
}
