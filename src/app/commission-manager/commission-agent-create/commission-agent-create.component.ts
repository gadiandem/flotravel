import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { FlotravelProviderService } from 'src/app/service/admin/provider/flotravel-provider.service';
import { FlotravelProvider } from 'src/app/model/auth/provider/flotravel-provider';
import { CommissionAgentService } from 'src/app/service/commission/commission-agent.service';
import { CommissionAgentCreate } from 'src/app/model/commission/commission-agent-create';

@Component({
  templateUrl: './commission-agent-create.component.html',
  styleUrls: ['./commission-agent-create.component.css']
})
export class CommissionAgentCreateComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  commissionForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;

  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private providerService: FlotravelProviderService,
    private commissionAgentService: CommissionAgentService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (!this.user) {
        this.router.navigate(['/']);
      }
    });
  }

  initForm() {
    this.commissionForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      margin: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(100)]],
      unit: ['%', [Validators.required]],
      unitName: ['percent', [Validators.required]],
    });
  }

  createRule() {
    console.log(this.commissionForm.value);
    if (this.commissionForm.valid) {
      const d: any = this.commissionForm.value;
      const request = new CommissionAgentCreate();
      // request.code = d.provider;
      request.agentId = this.user.agentId;
      request.type = d.type;
      request.name = d.name;
      // request.provider = d.provider;
      request.margin = +d.margin;
      request.unit = d.unit;
      request.unitName = d.unitName;

      this.commissionAgentService.createCommission(request, this.user.id).subscribe(
        res => {
          this.alertify.success(`Create Commission Agent successful!`);
          this._location.back();
        }, e => {
          if(e.error){
            this.alertify.error(`${e.error.message}`);
          } else {
            this.alertify.error(`${e}`);
          }
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
