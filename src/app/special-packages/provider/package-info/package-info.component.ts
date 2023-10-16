import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { PackageInfo } from 'src/app/model/packages/provider/package-info';
import { AlertifyService } from 'src/app/service/alertify.service';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.css']
})
export class PackageInfoComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: PackageInfo[];
  public gridView: PackageInfo[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageInfoListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.loadPackageList();
      this.initialLoad = false;
    }
  }

  loadPackageList(){
    this.store.dispatch(new ProviderPackagesActions.GetPackageInfoListStart());
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridViewData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'cityName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'region',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'dayCount',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  viewDetail(tourDetail: PackageInfo) {
    this.router.navigate(['/specialPackagesProvider/packageDetail', tourDetail.id]);
    sessionStorage.setItem('packageDetail', JSON.stringify(tourDetail));
  }

  removePackage(packageId: string){
    this.alertify.confirm('Are you sure you want to delete this Package?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageInfoStart({packageInfoId: packageId}));
    });

  }

  createPackageInfo(){
    this.router.navigate(['/specialPackagesProvider/package/create']);
  }
}
