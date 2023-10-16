import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { RegionCreateReq } from 'src/app/model/packages/provider/region-create.req';
import { RegionPackage } from 'src/app/model/packages/provider/region';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'

@Component({
  selector: 'app-region-edit',
  templateUrl: './region-edit.component.html',
  styleUrls: ['./region-edit.component.css']
})
export class RegionEditComponent implements OnInit {
  regionForm: FormGroup;
  formSubmitError: boolean;

  regionId: string;
  regionDetail: RegionPackage;

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
    this.initForm();
    this.store.select('providerPackages').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.regionDetail = data.packageRegionDetailRes;
      if (this.regionDetail) {
        this.updateFormWithData();
      }
    })
    this.formSubmitError = false;
  }
  private initForm() {
    this.regionForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  private updateFormWithData() {
    this.regionForm.patchValue({
      name: this.regionDetail.name
    });
  }

  editRegion() {
    if (this.regionForm.valid) {
      const regionCreate: RegionCreateReq = new RegionCreateReq();
      const d: any = this.regionForm.value;
      regionCreate.name = d.name;
      this.store.dispatch(new ProviderPackagesActions.UpdatePackageRegionStart({packageRegionUpdateReq: regionCreate, packageRegionId: this.regionDetail.id}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
