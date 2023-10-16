import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { TransferInPackage } from 'src/app/model/packages/provider/transfer-package';
import {CurrencyNewRes} from '../../../model/dashboard/currency/currency-new-res.model';
import {appConstant} from '../../../app.constant';

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-transfer-create',
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.css']
})
export class TransferCreateComponent implements OnInit {
  transferForm: FormGroup;
  formSubmitError: boolean;
  currencies: CurrencyNewRes[];

  constructor(
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.formSubmitError = false;
    this.initForm();
  }
  private initForm() {
    this.transferForm = new FormGroup({
      transferType: new FormControl("", [Validators.required]),
      arrival: new FormControl("", [Validators.required]),
      departure: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

  createTransfer() {
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
      this.store.dispatch(new ProviderPackagesActions.CreatePackageTransferStart({packageTransferCreateReq: packageTransfer}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
