import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";

import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";
import { AlertifyService } from "src/app/service/alertify.service";
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: "app-supplement",
  templateUrl: "./supplement.component.html",
  styleUrls: ["./supplement.component.css"],
})
export class SupplementComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: SupplementPackage[];
  public gridView: SupplementPackage[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private alertify: AlertifyService,
    private store : Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.gridViewData = data.packageSupplementListRes;
      this.gridView = [...this.gridViewData];
    })
    if (this.initialLoad === true) {
      this.getPackageSupplementList();
      this.initialLoad = false;
    }
  }
  getPackageSupplementList() {
    this.store.dispatch(new ProviderPackagesActions.GetPackageSupplementListStart());
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
            field: "shortDescription",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "price",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  viewDetail(supplementDetail: SupplementPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageSupplementDetailStart({packageSupplementId: supplementDetail.id}));
    this.router.navigate(["/specialPackagesProvider/supplement/edit", supplementDetail.id]);
  }

  removePackageSupplement(supplementId: string) {
    this.alertify.confirm("Are you sure you want to delete this Supplement?", () => {
      this.store.dispatch(new ProviderPackagesActions.RemovePackageSupplementStart({packageSupplementId: supplementId}));
    });
  }

  createSupplement() {
    this.router.navigate(["/specialPackagesProvider/supplement/create"]);
  }
}
