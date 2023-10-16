import { Component, OnInit } from '@angular/core';
import { Agent } from 'src/app/model/auth/agency/agency';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { User } from 'src/app/model/auth/user/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { AgentInfo } from 'src/app/model/auth/agency/agent-info';

@Component({
  selector: 'app-profile-agent',
  templateUrl: './profile-agent.component.html',
  styleUrls: ['./profile-agent.component.css']
})
export class ProfileAgentComponent implements OnInit {
  agentDetail: Agent;
  subscription: Subscription;
  account: UserDetail;
  isLoading: boolean;
  userGroupList: UserGroup[];
  userList: User[];
  subAgents: Agent[];
  formSubmitError: boolean;
  isNewAgent: boolean;
  agentId: string;
  agentForm: FormGroup;
  constructor(private agencyManage: AgencyService,
    private alertify: AlertifyService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    // this.formUserError = false;
    // this.isShowFormUser = false;
    // this.isShowFormSubAgent = false;
    // this.agentList = JSON.parse(sessionStorage.getItem('agentList'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.agentId = params['agentId'];
      if (this.agentId !== '0') {
        this.isNewAgent = false;
        this.isLoading = true;
        // this.agentDetail = this.agentList.find(a => a.id === this.agentId);
      } else {
        this.isNewAgent = true;
        this.agentDetail = new Agent();
        this.agentDetail.agentInfo = new AgentInfo();
      }
    });
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem('accountInfo'));
      }

      console.log('agentId: ' + this.agentId);
      if (this.account != null) {
        this.loadAgent();
      }
    });
    this.initForm();
  }

  loadAgent() {
    this.subscription = this.agencyManage.getAgency(this.agentId, this.account.id).subscribe(
      (res: Agent) => {
        this.agentDetail = res;
        sessionStorage.setItem('agentDetail', JSON.stringify(res));
        this.userGroupList = res.userGroupList;
        this.userList = res.userList;
        this.subAgents = res.subAgents;
        this.updateFormWithData();
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
      }
    );
  }
  private initForm() {
    this.agentForm = new FormGroup({
      agentId: new FormControl('', Validators.required),
      agentInfo: new FormGroup({
        address: new FormControl('', Validators.required),
        // logo: new FormControl('', Validators.required),
        // website: new FormControl('', Validators.required),
      }),
      name: new FormControl('', Validators.required)
    });
  }
  private updateFormWithData() {
    this.agentForm.patchValue({
      // agentId: this.agentDetail.agentId || '',
      agentInfo: {
        address: this.agentDetail.agentInfo.address || ''
      },
      name: this.agentDetail.name || ''
    });
  }
  saveAgent() {
    if (this.agentForm.valid) {
      const d: Agent = this.agentForm.value;
      const agentInfo: Agent = this.agentDetail;
      // agentInfo.agentId = d.agentId;
      agentInfo.agentInfo.address = d.agentInfo.address;
      agentInfo.name = d.name;
      if (!this.isNewAgent) {
        console.log('agent update: ' + JSON.stringify(agentInfo));
        this.agencyManage.editAgency(agentInfo, this.account.id).subscribe(
          (res: Agent) => {
            this.alertify.success(`Agent ${res.name} save succeeful`);
            console.log('agent updated: ' + JSON.stringify(res));
          }, e => {
            this.alertify.error(`${e.error.message}`);
            console.log(e);
          }, () => this.route.navigate(['/admin/agency'])
        );
      } else {
        this.agencyManage.createNewAgency(agentInfo, this.account.id).subscribe(
          (res: Agent) => {
            this.alertify.success(`Agent ${res.name} create succeeful`);
            this.route.navigate(['../'], { relativeTo: this.activeRoute });
          }, e => {
            this.alertify.error(`There is some error!!!`);
            console.log(e);
          }, () => this.route.navigate(['/admin/agency'])
        );
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
