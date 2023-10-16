import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { CommissionFlotravelService } from 'src/app/service/commission/commission-flotravel.service';
import { CommissionFlotravelItem } from 'src/app/model/commission/commission-flotravel-item';
import { CommissionFlotravelCreate } from 'src/app/model/commission/commission-flotravel-create';
import { FlotravelProvider } from 'src/app/model/auth/provider/flotravel-provider';
import { FlotravelProviderService } from 'src/app/service/admin/provider/flotravel-provider.service';
import { CommissionAgentService } from 'src/app/service/commission/commission-agent.service';
import { CommissionAgentCreate } from 'src/app/model/commission/commission-agent-create';

@Component({
  templateUrl: './commission-agent-edit.component.html',
  styleUrls: ['./commission-agent-edit.component.css']
})
export class CommissionAgentEditComponent implements OnInit {
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
  sourceProviders: FlotravelProvider[];
  providers: FlotravelProvider[];
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private searchAirport: SearchFlightService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private commissionService: CommissionAgentService,
    private providerService: FlotravelProviderService, ) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.sourceProviders = [];
    this.providers = [];
    this.activeRoute.params.subscribe((params: Params) => {
      this.commissionId = params['commissionId'];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        this.fetchCommissionDetail();
    });
  }

  fetchCommissionDetail() {
    this.commissionService.getCommissionDetail(this.user.id, this.commissionId).subscribe(
      res => {
        this.commissionDetail = res;
        this.updateFormData();
      }, e => {
        this.alertify.error(e);
      }
    );
  }

  private initForm() {
    this.commissionForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      margin: ['', [ Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(100)]],
      unit: ['%', [Validators.required]],
      unitName: ['percent', [Validators.required]],
    });
  }
  updateFormData() {
    this.commissionForm.patchValue({
      type: this.commissionDetail.type,
      name: this.commissionDetail.name,
      margin: this.commissionDetail.margin,
      unit: this.commissionDetail.unit,
      unitName: this.commissionDetail.unitName,
    });
  }

  editCommission() {
    console.log(this.commissionForm.value);
    if (this.commissionForm.valid) {
      const d: any = this.commissionForm.value;
      const request = new CommissionAgentCreate();
      request.code = d.provider;
      request.agentId = this.user.agentId;
      request.type = d.type;
      request.name = d.name;
      request.margin = +d.margin;
      request.unit = d.unit;
      request.unitName = d.unitName;
      this.commissionService.editCommission(request, this.commissionId, this.user.id).subscribe(
        res => {
          this.alertify.success(`Update Flight rule succeeful!`);
          this._location.back();
        }, e => {
          this.alertify.error(`${e}`);
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
  // onChangeProvider(type: string){
  //   if(type){
  //     this.providers = this.sourceProviders.filter(item => item.type === type);
  //   }
  // }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
