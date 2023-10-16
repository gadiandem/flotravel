import {Component, OnDestroy, OnInit} from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Agent } from 'src/app/model/auth/agency/agency';
import { AgentInfo } from 'src/app/model/auth/agency/agent-info';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { User } from 'src/app/model/auth/user/user';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { flightProviderName } from 'src/app/flight/flight.constant';
import { FlightSearchProviderService } from 'src/app/service/setting/flight-search-provider.service';


@Component({
  selector: 'app-edit-flight-provider',
  templateUrl: './edit-flight-provider.component.html',
  styleUrls: ['./edit-flight-provider.component.css']
})
export class EditFlightProviderComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  public mySelection: string[] = [];
  agentId: string;
  isLoading: boolean;
  agentDetail: Agent;
  agentList: Agent[];
  userGroupList: UserGroup[];
  formSubmitError: boolean;
  formUserError: boolean;
  account: UserDetail;
  agencyUsers: Array<User> = [];

  agentSettingForm: FormGroup;
  userList: User[];
  subAgents: Agent[];
  userForm: FormGroup;

  flightAgentSetting: any;

  hahnAirEnable = false;
  aeroEnable = false;
  etEnable = false;
  qrEnable = false;
  floAirEnable = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private providerSetting: FlightSearchProviderService,
    private agencyManage: AgencyService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.formUserError = false;
    this.initFlightAgentSettingForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.agentId = params['agentId'];
      console.log(this.agentId);
      if (this.agentId !== '0') {
        this.isLoading = true;
        this.fetchingFlightAgentSetting();
      } else {
        this.agentDetail = new Agent();
        this.agentDetail.agentInfo = new AgentInfo();
      }
    });
    this.initFlightAgentSettingForm();
  }
  fetchingFlightAgentSetting() {
    this.providerSetting.fetchAgentFLightSettingDetail(this.agentId).subscribe(
      res => {
        this.flightAgentSetting = res;
        this.updateAgentFlightSettingFormData(res);
      }, e => {
        this.alertify.error(e.message);
      }
    );
  }

  updateAgentFlightSettingFormData(data: any) {
    if (data.flightSupplierOptions && data.flightSupplierOptions.length > 0) {
      data.flightSupplierOptions.forEach(provider => {
          if (provider.supplierName === flightProviderName[flightProviderName.HahnAir]) {
            this.hahnAirEnable = provider.systemSearchEnable;
            this.agentSettingForm.patchValue({ hahnAir: provider.searchEnable });
          }
          if (provider.supplierName === flightProviderName[flightProviderName.AeroCRS]) {
            this.aeroEnable = provider.systemSearchEnable;
            this.agentSettingForm.patchValue({ aero: provider.searchEnable });
          }
          if (provider.supplierName === flightProviderName[flightProviderName.ET]) {
            this.etEnable = provider.systemSearchEnable;
            this.agentSettingForm.patchValue({ et: provider.searchEnable });
          }
          if (provider.supplierName === flightProviderName[flightProviderName.QR]) {
            this.qrEnable = provider.systemSearchEnable;
            this.agentSettingForm.patchValue({ qr: provider.searchEnable });
          }
          if (provider.supplierName === flightProviderName[flightProviderName.FloAir]) {
            this.floAirEnable = provider.systemSearchEnable;
            this.agentSettingForm.patchValue({ floAir: provider.searchEnable });
          }
      });
    }
  }

  initFlightAgentSettingForm() {
    this.agentSettingForm = new FormGroup({
      hahnAir: new FormControl(false, Validators.required),
      aero: new FormControl(false, Validators.required),
      et: new FormControl(false, Validators.required),
      qr: new FormControl(false, Validators.required),
      floAir: new FormControl(false, Validators.required)
    });
  }

  saveSetting() {
    const d = this.agentSettingForm.value;
    console.log(d);
    this.flightAgentSetting.flightSupplierOptions
      .filter(provider => provider.supplierName === 'HahnAir')
      .map(item => item.searchEnable = d.hahnAir);

    this.flightAgentSetting.flightSupplierOptions
      .filter(provider => provider.supplierName === 'AeroCRS')
      .map(item => item.searchEnable = d.aero);

    this.flightAgentSetting.flightSupplierOptions
      .filter(provider => provider.supplierName === 'ET')
      .map(item => item.searchEnable = d.et);

    this.flightAgentSetting.flightSupplierOptions
      .filter(provider => provider.supplierName === 'QR')
      .map(item => item.searchEnable = d.qr);

    this.flightAgentSetting.flightSupplierOptions
      .filter(provider => provider.supplierName === 'FloAir')
      .map(item => item.searchEnable = d.floAir);
    this.updatePrivderSetting();
  }

  updatePrivderSetting() {
    this.providerSetting.updateAgentFLightSetting(this.agentId, this.flightAgentSetting).subscribe(
      res => {
        this.alertify.success('Update Provider successfull!');
        this.fetchingFlightAgentSetting();
      }, e => {
        this.alertify.error(e);
      }
    );
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
