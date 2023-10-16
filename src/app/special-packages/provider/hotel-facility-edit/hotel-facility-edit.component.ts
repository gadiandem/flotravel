import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { HotelFacilityReq } from 'src/app/model/packages/provider/hotel-facility-create.req';
import { HotelFacility } from 'src/app/model/packages/provider/hotel-facility';
import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-hotel-facility-edit',
  templateUrl: './hotel-facility-edit.component.html',
  styleUrls: ['./hotel-facility-edit.component.css']
})
export class HotelFacilityEditComponent implements OnInit {
  facilityForm: FormGroup;
  formSubmitError: boolean;

  regionId: string;
  facilityDetail: HotelFacility;
  user: UserDetail;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    this.store.select('providerSpecialPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.facilityDetail = data.packageHotelFacilityDetailRes;
      if (this.facilityDetail) {
        this.updateFormWithData();
      }
    })
  }

  initForm() {
    this.facilityForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  updateFormWithData() {
    this.facilityForm.patchValue({
      name: this.facilityDetail.name
    });
  }

  editFacility() {
    if (this.facilityForm.valid) {
      const facilityCreate: HotelFacilityReq = new HotelFacilityReq();
      const d: any = this.facilityForm.value;
      facilityCreate.name = d.name;
      facilityCreate.lastModifiedBy = this.user.id;

     this.store.dispatch(new ProviderPackagesActions.UpdatePackageHotelFacilityStart({packageHotelFacilityId: this.facilityDetail.id, packageHotelFacilityUpdateReq: facilityCreate}));
     this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }
}
