import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { CommissionFlotravelService } from 'src/app/service/commission/commission-flotravel.service';
import { CommissionFlotravelItem } from 'src/app/model/commission/commission-flotravel-item';

@Component({
  templateUrl: './commission-flotravel-detail.component.html',
  styleUrls: ['./commission-flotravel-detail.component.css']
})
export class CommissionFlotravelDetailComponent implements OnInit {
  subscription: Subscription;
  commissionForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;
  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  commissionId: string;
  commissionDetail: CommissionFlotravelItem;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private commissionFLotravelService: CommissionFlotravelService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.commissionId = params["commissionId"];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        this.fetRuleDetail();
    });
  }

  fetRuleDetail(){
    this.commissionFLotravelService.getCommissionDetail(this.user.id, this.commissionId).subscribe(
      res => {
        this.commissionDetail = res;
        this.updateFormData();
      }, e => {
        this.alertify.error(e);
      }
    )
  }

  private initForm() {
    this.commissionForm = this.fb.group({
      type: ["", Validators.required],
      name: ["", Validators.required],
      provider: ["", Validators.required],
      margin: ["", Validators.required],
      unit: ["", [Validators.required]],
    });
  }
  updateFormData() {
    this.commissionForm.patchValue({
      type: this.commissionDetail.type,
      name: this.commissionDetail.name,
      provider: this.commissionDetail.provider,
      margin: this.commissionDetail.margin,
      unit: this.commissionDetail.unit,
    });
  }

  findProviderName(index: number): string{
    switch(index){
      case 0:
        return 'ALL';
      case 1:
          return 'HAHN_AIR';
      case 2:
        return 'AERO_CRS';
      case 3:
        return 'ET';
      default:
        return 'ALL';
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
