import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { TourPackage } from 'src/app/model/packages/provider/tour-package';
import {CurrencyNewRes} from '../../../model/dashboard/currency/currency-new-res.model';
import {appConstant} from '../../../app.constant';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-tour-create',
  templateUrl: './tour-create.component.html',
  styleUrls: ['./tour-create.component.css']
})
export class TourCreateComponent implements OnInit {
  tourForm: FormGroup;
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
    this.tourForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      currency: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      note: new FormControl("", [Validators.required]),
    });
  }

  createTour() {
    if (this.tourForm.valid) {
      const packageTour: TourPackage = new TourPackage();
      const d: any = this.tourForm.value;
      packageTour.name = d.name;
      packageTour.description = d.description;
      packageTour.currency = d.currency;
      packageTour.price = d.price;
      packageTour.note = d.note;

      this.store.dispatch(new ProviderPackagesActions.CreatePackageTourStart({packageTourCreateReq: packageTour}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }

}
