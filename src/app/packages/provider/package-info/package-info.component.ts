import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { PackageInfo } from 'src/app/model/packages/provider/package-info';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from 'src/app/model/packages/provider/pagination/pageable';

@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.css']
})
export class PackageInfoComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: GridDataResult;
  public gridView: GridDataResult;
  public mySelection: string[] = [];
  public skip = 0;
  pageSize: number;
  page: number;
  user: UserDetail;
  isLoading = false;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(private router: Router,
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
      if(data.packageInfoListRes){
      this.gridViewData = {
        data:  data.packageInfoListRes.items,
        total: data.packageInfoListRes.totalItems,
      }
        this.gridView = Object.assign({}, this.gridViewData);
      } else {
        this.gridViewData = null;
        this.gridView = Object.assign({}, this.gridViewData);
      }
    })
    if (this.initialLoad) {
      this.loadPackageList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }

  loadPackageList(pageable: Pageable){
    this.store.dispatch(new ProviderPackagesActions.GetPackageInfoListStart({data: pageable}));
  }
  public onFilter(data: any[], inputValue: string): void {
    this.gridView.data = process(data, {
      // filter: {
      //   logic: 'or',
      //   filters: [
      //     {
      //       field: 'name',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'description',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'cityName',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'region',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'dayCount',
      //       operator: 'contains',
      //       value: inputValue
      //     }
      //   ],
      // }
    }).data;
    this.gridView.total = data.length;
    if(this.dataBinding){
      this.dataBinding.skip = 0;
    }
  }

  searchPackage(packageName: string){
    if(packageName){
      this.fetching = true;
      this.providerService.searchPackageInfoByName(packageName).subscribe(
        (res: any[]) => {
          this.fetching = false;
          this.onFilter(res, packageName);
        }, e => {
          console.log(e);
          this.fetching = false;
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
    this.loadPackageList({page: this.page, pageSize: this.pageSize});
  }
  viewDetail(tourDetail: PackageInfo) {
    this.router.navigate(['/packagesProvider/packageDetail', tourDetail.id]);
    sessionStorage.setItem('packageDetail', JSON.stringify(tourDetail));
  }

  removePackage(packageId: string){
    this.alertify.confirm('Are you sure you want to delete this Package?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageInfoStart({packageInfoId: packageId}));
    });

  }

  createPackageInfo(){
    this.router.navigate(['/packagesProvider/package/create']);
  }
}
