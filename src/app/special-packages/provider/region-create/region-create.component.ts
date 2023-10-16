import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { RegionCreateReq } from 'src/app/model/packages/provider/region-create.req';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/special-packages/provider/store/provider-special-packages.actions'

@Component({
  selector: 'app-region-create',
  templateUrl: './region-create.component.html',
  styleUrls: ['./region-create.component.css']
})
export class RegionCreateComponent implements OnInit {

  regionForm: FormGroup;
  formSubmitError: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private _location: Location,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
  }
  private initForm() {
    this.regionForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  createRegion() {
    if (this.regionForm.valid) {
      const regionCreate: RegionCreateReq = new RegionCreateReq();
      const d: any = this.regionForm.value;
      regionCreate.name = d.name;
      this.store.dispatch(new ProviderPackagesActions.CreatePackageRegionStart({packageRegionCreateReq: regionCreate}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }

}
