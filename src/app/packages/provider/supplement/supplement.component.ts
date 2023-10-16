import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";

import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";
import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from "src/app/model/packages/provider/pagination/pageable";

@Component({
  selector: "app-supplement",
  templateUrl: "./supplement.component.html",
  styleUrls: ["./supplement.component.css"],
})
export class SupplementComponent implements OnInit {
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
    private store : Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.page = 0;
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if(data.packageSupplementListRes){
        this.gridViewData = {
          data:  data.packageSupplementListRes.items,
          total: data.packageSupplementListRes.totalItems,
        };
        this.gridView = Object.assign({}, this.gridViewData);
      } else {
        this.gridViewData = null;
        this.gridView = Object.assign({}, this.gridViewData);
      }
    })
    if (this.initialLoad === true) {
      this.getPackageSupplementList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }
  getPackageSupplementList(pageable: Pageable) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageSupplementListStart({data: pageable}));
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
      //       field: "shortDescription",
      //       operator: "contains",
      //       value: inputValue,
      //     },
      //     {
      //       field: "price",
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
  
  searchSupplement(supplementName: string){
    if(supplementName){
      this.providerService.searchSupplementByName(supplementName).subscribe(
        (res: any[]) => {
          this.onFilter(res, supplementName);
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
    this.getPackageSupplementList({page: this.page, pageSize: this.pageSize});
  }
  viewDetail(supplementDetail: SupplementPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageSupplementDetailStart({packageSupplementId: supplementDetail.id}));
    this.router.navigate(["/packagesProvider/supplement/edit", supplementDetail.id]);
  }

  remvovePackageSupplement(supplememtId: string) {
    this.alertify.confirm("Are you sure you want to delete this Supplement?", () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageSupplementStart({packageSupplementId: supplememtId}));
    });
  }

  createSupplement() {
    this.router.navigate(["/packagesProvider/supplement/create"]);
  }
}
