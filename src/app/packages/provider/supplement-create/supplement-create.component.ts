import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { SupplementPackage } from 'src/app/model/packages/provider/supplement-package';
import {CurrencyNewRes} from '../../../model/dashboard/currency/currency-new-res.model';
import {appConstant} from '../../../app.constant';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'

@Component({
  selector: 'app-supplement-create',
  templateUrl: './supplement-create.component.html',
  styleUrls: ['./supplement-create.component.css']
})
export class SupplementCreateComponent implements OnInit {

  supplementForm: FormGroup;
  formSubmitError: boolean;
  currencies: CurrencyNewRes[];

  constructor(
    private providerService: PakageProviderService,
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
    this.supplementForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      shortDescription: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

  createSupplement() {
    if (this.supplementForm.valid) {
      const packageSupplement: SupplementPackage = new SupplementPackage();
      const d: any = this.supplementForm.value;
      packageSupplement.name = d.name;
      packageSupplement.description = d.description;
      packageSupplement.shortDescription = d.shortDescription;
      packageSupplement.currency = d.currency;
      packageSupplement.price = +d.price;
      packageSupplement.note = d.note;

      this.store.dispatch(new ProviderPackagesActions.CreatePackageSupplementStart({packageSupplementCreateReq: packageSupplement}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
