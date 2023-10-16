import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {Location} from '@angular/common';

import {appConstant} from 'src/app/app.constant';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {Airline} from 'src/app/model/flight/airline/airline';
import {AlertifyService} from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import {AirportRes} from 'src/app/model/flight/airport/airportRes';
import {SearchFlightService} from 'src/app/service/flight/search-flight.service';
import {CommissionFlotravelService} from 'src/app/service/commission/commission-flotravel.service';
import {CommissionFlotravelItem} from 'src/app/model/commission/commission-flotravel-item';
import {CommissionFlotravelCreate} from 'src/app/model/commission/commission-flotravel-create';
import {FlotravelProvider} from 'src/app/model/auth/provider/flotravel-provider';
import {FlotravelProviderService} from 'src/app/service/admin/provider/flotravel-provider.service';

@Component({
  templateUrl: './commission-flotravel-edit.component.html',
  styleUrls: ['./commission-flotravel-edit.component.css']
})
export class CommissionFlotravelEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  commissionForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;
  sugFlyFrom$: Observable<AirportRes[]>;
  searchFlyFrom: string[] = [];
  sugFlyTo$: Observable<AirportRes[]>;
  searchFlyTo: string[] = [];
  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  flyFrom: AirportRes;
  destination: AirportRes;
  commissionId: string;
  commissionDetail: CommissionFlotravelItem;
  providers: FlotravelProvider[];
  sourceProviders: FlotravelProvider[];

  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private _location: Location,
              private searchAirport: SearchFlightService,
              private alertify: AlertifyService,
              private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private commissionService: CommissionFlotravelService,
              private providerService: FlotravelProviderService, ) {
  }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.providers = [];
    this.sourceProviders = [];
    this.activeRoute.params.subscribe((params: Params) => {
      this.commissionId = params['commissionId'];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (!this.user) {
        this.router.navigate(['/']);
      }
      this.fetchProviders();
      this.fetchCommissionDetail();
    });
  }

  fetchCommissionDetail() {
    this.commissionService.getCommissionDetail(this.user.id, this.commissionId).subscribe(
      res => {
        this.commissionDetail = res;
        this.updateFormData();
        if(res){
          this.onChangeProvider(res.type)
        }
      }, e => {
        this.alertify.error(e);
      }
    );
  }

  fetchProviders() {
    this.subscription = this.providerService.getProviders(this.user.id).subscribe(
      (res: FlotravelProvider[]) => {
        this.sourceProviders = res;
      }
    );
  }

  private initForm() {
    this.commissionForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      provider: ['', Validators.required],
      margin: ['',[Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(100)]],
      unit: ['%', [Validators.required]],
      unitName: ['percent', [Validators.required]],
    });
  }

  updateFormData() {
    this.onChangeProvider(this.commissionDetail.type);
    this.commissionForm.patchValue({
      type: this.commissionDetail.type,
      name: this.commissionDetail.name,
      provider: this.commissionDetail.provider,
      margin: this.commissionDetail.margin,
      unit: this.commissionDetail.unit,
      unitName: this.commissionDetail.unitName,
    });
  }

  editCommission() {
    console.log(this.commissionForm.value);
    if (this.commissionForm.valid) {
      const d: any = this.commissionForm.value;
      const request = new CommissionFlotravelCreate();
      request.code = d.provider;
      request.type = d.type;
      request.name = d.name;
      request.provider = d.provider;
      request.margin = +d.margin;
      request.unit = d.unit;
      request.unitName = d.unitName;
      this.commissionService.editCommission(request, this.commissionId, this.user.id).subscribe(
        res => {
          this.alertify.success(`Create Flight rule succeeful!`);
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

  onChangeProvider(type: string){
    console.log(type);
    if(type && this.sourceProviders.length > 0){
      this.providers = this.sourceProviders.filter(item => item.type === type);
    }
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
