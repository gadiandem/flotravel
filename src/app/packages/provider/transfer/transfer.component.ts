import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { TransferInPackage } from 'src/app/model/packages/provider/transfer-package';
import { AlertifyService } from 'src/app/service/alertify.service';

import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import { Pageable } from 'src/app/model/packages/provider/pagination/pageable';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
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
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if(data.packageTransferListRes){
        this.gridViewData = {
          data:  data.packageTransferListRes.items,
          total: data.packageTransferListRes.totalItems,
        };
        this.gridView = this.gridViewData;
      } else {
        this.gridViewData = null;
        this.gridView = this.gridViewData;
      }
    })
    if (this.initialLoad === true) {
      this.getPackageTransferList({page: this.page, pageSize: this.pageSize});
      this.initialLoad = false;
    }
  }
  getPackageTransferList(pageable: Pageable) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTransferListStart({data: pageable}));
  }
  public onFilter(inputValue: string): void {
    this.gridView.data = process(this.gridViewData.data, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "transferType",
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
    this.getPackageTransferList({page: this.page, pageSize: this.pageSize});
  }

  
  viewDetail(hotelDetail: TransferInPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTransferDetailStart({packageTransferId: hotelDetail.id}));
    this.router.navigate(["/packagesProvider/transfer/edit", hotelDetail.id]);
  }

  createTransfer(){
    this.router.navigate(['/packagesProvider/transfer/create']);
  }

  remvovePackageTransfer(transferId: string){
    this.alertify.confirm('Are you sure you want to delete this Transfer?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageTransferStart({packageTransferId: transferId}));
    });

  }
}
