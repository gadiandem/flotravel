import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { CommissionFlotravelService } from 'src/app/service/commission/commission-flotravel.service';
import { CommissionFlotravelCreate } from 'src/app/model/commission/commission-flotravel-create';
import { FlotravelProviderService } from 'src/app/service/admin/provider/flotravel-provider.service';
import { FlotravelProvider } from 'src/app/model/auth/provider/flotravel-provider';


@Component({
  templateUrl: './commission-flotravel-create.component.html',
  styleUrls: ['./commission-flotravel-create.component.css']
})
export class CommissionFlotravelCreateComponent implements OnInit {
  subscription: Subscription;
  commissionForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;

  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  providers: FlotravelProvider[];
  sourceProviders: FlotravelProvider[];
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private providerService: FlotravelProviderService,
    private commissionFlotravelService: CommissionFlotravelService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.providers = [];
    this.sourceProviders = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        this.fetchProviders();
    });
  }

  fetchProviders() {
    this.subscription = this.providerService.getProviders(this.user.id).subscribe(
      (res: FlotravelProvider[]) => {
        // this.providers = res;
        this.sourceProviders = res;
      }
    );
  }

  private initForm() {
    this.commissionForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      provider: ['', Validators.required],
      margin: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(100)]],
      unit: ['%', [Validators.required]],
      unitName: ['percent', [Validators.required]],
    });
  }

  createRule() {
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

    console.log(request);
      this.commissionFlotravelService.createCommission(request, this.user.id).subscribe(
        res => {
          this.alertify.success(`Create Commission Flotravel succeeful!`);
          this._location.back();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  onChangeProvider(type: string){
    if(type){
      this.providers = this.sourceProviders.filter(item => item.type === type);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
