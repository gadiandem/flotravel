import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";

import { TourPackage } from 'src/app/model/packages/provider/tour-package';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from 'src/app/model/packages/provider/pagination/pageable';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    this.pageSize = 10;
    this.page = 0;
    this.store.select('providerPackages').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if(data.packageTourListRes){
        this.gridViewData = {
          data:  data.packageTourListRes.items,
          total: data.packageTourListRes.totalItems,
        };
        this.gridView = Object.assign({}, this.gridViewData);
      } else {
        this.gridViewData = null;
        this.gridView = Object.assign({}, this.gridViewData);
      }
    })
    if (this.initialLoad === true) {
      this.getPackageTourList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }

  getPackageTourList(pageable: Pageable) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTourListStart({data: pageable}));
  }

  public onFilter(data: any[], supplementName: string): void {
    this.gridView.data = process(data, {
      // filter: {
      //   logic: "or",
      //   filters: [
      //     {
      //       field: "name",
      //       operator: "contains",
      //       value: inputValue,
      //     },
      //     {
      //       field: "price",
      //       operator: "contains",
      //       value: inputValue,
      //     },
      //     {
      //       field: "note",
      //       operator: "contains",
      //       value: inputValue,
      //     },
      //   ],
      // },
    }).data;
    this.gridView.total = data.length;
    if(this.dataBinding){
      this.dataBinding.skip = 0;
    }
  }

  searchTour(tourName: string){
    if(tourName){
      this.providerService.searchTourByName(tourName).subscribe(
        (res: any[]) => {
          this.onFilter(res, tourName);
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
    this.getPackageTourList({page: this.page, pageSize: this.pageSize});
  }

  viewDetail(tourDetail: TourPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTourDetailStart({packageTourId: tourDetail.id}));
    this.router.navigate(["/packagesProvider/tour/edit", tourDetail.id]);
  }


  removePackageTour(packageId: string){
    this.alertify.confirm('Are you sure you want to delete this Tour?', () => {
     this.store.dispatch(new ProviderPackagesActions.RemovePackageTourStart({packageTourId: packageId}));
    });

  }
  createTour(){
    this.router.navigate(['/packagesProvider/tour/create']);
  }
}
