import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { SpecialPackagesProviderService } from "src/app/service/packages/special-packages-provider.service";
import { HotelFacilityReq } from 'src/app/model/packages/provider/hotel-facility-create.req';
import { HotelFacility } from 'src/app/model/packages/provider/hotel-facility';
import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import * as ProviderPackagesActions from '../store/provider-special-packages.actions';

@Component({
  selector: 'app-hotel-facility-create',
  templateUrl: './hotel-facility-create.component.html',
  styleUrls: ['./hotel-facility-create.component.css']
})
export class HotelFacilityCreateComponent implements OnInit {

  facilityForm: FormGroup;
  formSubmitError: boolean;
  user: UserDetail;

  constructor(
    private providerService: SpecialPackagesProviderService,
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
  }
  private initForm() {
    this.facilityForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  createFacility() {
    if (this.facilityForm.valid) {
      const facilityCreate: HotelFacilityReq = new HotelFacilityReq();
      const d: any = this.facilityForm.value;
      facilityCreate.name = d.name;
      facilityCreate.createdBy = this.user.id;
      this.store.dispatch(new ProviderPackagesActions.CreatePackageHotelFacilityStart({packageHotelFacilityCreateReq: facilityCreate}));
      this._location.back();
    } else {
      this.formSubmitError = true;
      this.alertify.error(`There is some field require not input data`);
    }
  }

}
