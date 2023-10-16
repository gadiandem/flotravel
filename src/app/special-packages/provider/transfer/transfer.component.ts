import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { TransferInPackage } from 'src/app/model/packages/provider/transfer-package';
import { AlertifyService } from 'src/app/service/alertify.service';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  gridViewData: TransferInPackage[];
  gridView: TransferInPackage[];

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
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageTransferListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.getPackageTransferList();
      this.initialLoad = false;
    }
  }
  getPackageTransferList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTransferListStart());
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridViewData, {
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

  viewDetail(hotelDetail: TransferInPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageTransferDetailStart({packageTransferId: hotelDetail.id}));
    this.router.navigate(["/specialPackagesProvider/transfer/edit", hotelDetail.id]);
  }

  createTransfer(){
    this.router.navigate(['/specialPackagesProvider/transfer/create']);
  }

  removePackageTransfer(transferId: string){
    this.alertify.confirm('Are you sure you want to delete this Transfer?', () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageTransferStart({packageTransferId: transferId}));
    });

  }
}
