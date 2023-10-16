import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";

import { AlertifyService } from "src/app/service/alertify.service";
import { TourPackage } from "src/app/model/packages/provider/tour-package";

import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';
import {appConstant} from '../../../app.constant';
import {CurrencyNewRes} from '../../../model/dashboard/currency/currency-new-res.model';

@Component({
  selector: "app-tour-edit",
  templateUrl: "./tour-edit.component.html",
  styleUrls: ["./tour-edit.component.css"],
})
export class TourEditComponent implements OnInit {
  tourForm: FormGroup;
  formSubmitError: boolean;
  tourPackageDetail: TourPackage;
  currencies: CurrencyNewRes[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.tourPackageDetail = data.packageTourDetailRes;
      if (this.tourPackageDetail) {
        this.updateFormWithData();
      }
    });
  }

  initForm() {
    this.tourForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

  updateFormWithData() {
    this.tourForm.patchValue({
      name: this.tourPackageDetail.name,
      description: this.tourPackageDetail.description,
      currency: this.tourPackageDetail.currency,
      price: this.tourPackageDetail.price,
      note: this.tourPackageDetail.note
    });
  }


  updateTour() {
    if (this.tourForm.valid) {
      const packageTour: TourPackage = new TourPackage();
      const d: any = this.tourForm.value;
      packageTour.name = d.name;
      packageTour.description = d.description;
      packageTour.currency = d.currency;
      packageTour.price = d.price;
      packageTour.note = d.note;

      this.store.dispatch(new ProviderPackagesActions.UpdatePackageTourStart({packageTourId: this.tourPackageDetail.id, packageTourUpdateReq: packageTour}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
