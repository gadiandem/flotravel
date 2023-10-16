import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";

import { RegionPackage } from 'src/app/model/packages/provider/region';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: RegionPackage[];
  public gridView: RegionPackage[];
  isLoading = false;

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
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageRegionListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.getPackageRegionList();
      this.initialLoad = false;
    }
  }

  getPackageRegionList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageRegionListStart());
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

  editRegion(regionDetail: RegionPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageRegionDetailStart({packageRegionId: regionDetail.id}));
    this.router.navigate(["/packagesProvider/region/edit", regionDetail.id]);
  }

  removeRegion(regionId: string){
    this.alertify.confirm('Are you sure you want to delete this Region?', () => {
     this.store.dispatch(new ProviderPackagesActions.RemovePackageRegionStart({packageRegionId: regionId}));
    });

  }

  createRegion(){
    this.router.navigate(['/packagesProvider/region/create']);
  }
}
