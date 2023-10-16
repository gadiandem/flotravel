import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";

import { TourPackage } from 'src/app/model/packages/provider/tour-package';
import { AlertifyService } from 'src/app/service/alertify.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: TourPackage[];
  public gridView: TourPackage[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('providerSpecialPackages').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageTourListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.getPackageTourList();
      this.initialLoad = false;
    }
  }

  getPackageTourList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTourListStart());
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
            field: "price",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "note",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  viewDetail(tourDetail: TourPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTourDetailStart({packageTourId: tourDetail.id}));
    this.router.navigate(["/specialPackagesProvider/tour/edit", tourDetail.id]);
  }


  removePackageTour(packageId: string){
    this.alertify.confirm('Are you sure you want to delete this Tour?', () => {
     this.store.dispatch(new ProviderPackagesActions.RemovePackageTourStart({packageTourId: packageId}));
    });

  }
  createTour(){
    this.router.navigate(['/specialPackagesProvider/tour/create']);
  }
}
