import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { TransferInPackage } from 'src/app/model/packages/provider/transfer-package';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import {appConstant} from '../../../app.constant';
import {CurrencyNewRes} from '../../../model/dashboard/currency/currency-new-res.model';

@Component({
  selector: 'app-transfer-edit',
  templateUrl: './transfer-edit.component.html',
  styleUrls: ['./transfer-edit.component.css']
})
export class TransferEditComponent implements OnInit {

  transferForm: FormGroup;
  formSubmitError: boolean;
  transferPackageDetail: TransferInPackage;
  currencies: CurrencyNewRes[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.store.select('providerPackages').subscribe((data) => {
      this.fetchFailed = data.failure;
      this.fetching = data.loading;
      this.errorMes = data.errorMessage;
      this.transferPackageDetail = data.packageTransferDetailRes;
      if (this.transferPackageDetail) {
        this.updateFormWithData();
      }
    })
  }
  initForm() {
    this.transferForm = new FormGroup({
      transferType: new FormControl("", [Validators.required]),
      arrival: new FormControl(false, [Validators.required]),
      departure: new FormControl(false, [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

 updateFormWithData() {
    this.transferForm.patchValue({
      transferType: this.transferPackageDetail.transferType,
      arrival: this.transferPackageDetail.arrival,
      departure: this.transferPackageDetail.departure,
      currency: this.transferPackageDetail.currency,
      amount: this.transferPackageDetail.amount,
      note: this.transferPackageDetail.note
    });
  }

  updateTransfer() {
    if (this.transferForm.valid) {
      const packageTransfer: TransferInPackage = new TransferInPackage();
      const d: any = this.transferForm.value;
      packageTransfer.transferType = d.transferType;
      // packageHotel.breakfast = (d.breakfast == "true");
      packageTransfer.arrival = (d.arrival);
      packageTransfer.departure = (d.departure);
      packageTransfer.currency = d.currency;
      packageTransfer.amount = d.amount;
      packageTransfer.note = d.note;
      this.store.dispatch(new ProviderPackagesActions.UpdatePackageTransferStart({packageTransferId: this.transferPackageDetail.id, packageTransferUpdateReq: packageTransfer}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
