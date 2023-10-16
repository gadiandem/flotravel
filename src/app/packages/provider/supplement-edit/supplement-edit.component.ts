import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";

import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { SupplementPackage } from "src/app/model/packages/provider/supplement-package";

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'

@Component({
  selector: 'app-supplement-edit',
  templateUrl: './supplement-edit.component.html',
  styleUrls: ['./supplement-edit.component.css']
})
export class SupplementEditComponent implements OnInit {
  supplementForm: FormGroup;
  formSubmitError: boolean;
  supplementPackageDetail: SupplementPackage;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private providerService: PakageProviderService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.initForm();
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.supplementPackageDetail = data.packageSupplementDetailRes;
      if (this.supplementPackageDetail) {
        this.updateFormWithData();
      }
    });
    this.formSubmitError = false;
  }

  initForm() {
    this.supplementForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      shortDescription: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }


  updateFormWithData() {
    this.supplementForm.patchValue({
      name: this.supplementPackageDetail.name,
      description: this.supplementPackageDetail.description,
      shortDescription: this.supplementPackageDetail.shortDescription,
      currency: this.supplementPackageDetail.currency,
      price: this.supplementPackageDetail.price,
      note: this.supplementPackageDetail.note
    });
  }


  updateTour() {
    if (this.supplementForm.valid) {
      const packageSupplement: SupplementPackage = new SupplementPackage();
      const d: any = this.supplementForm.value;
      packageSupplement.name = d.name;
      packageSupplement.description = d.description;
      packageSupplement.shortDescription = d.shortDescription;
      packageSupplement.currency = d.currency;
      packageSupplement.price = +d.price;
      packageSupplement.note = d.note;

      this.store.dispatch(new ProviderPackagesActions.UpdatePackageSupplementStart({packageSupplementId: this.supplementPackageDetail.id, packageSupplementUpdateReq: packageSupplement}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
