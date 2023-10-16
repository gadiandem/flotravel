import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { appConstant } from 'src/app/app.constant';

import { Agent } from 'src/app/model/auth/agency/agency';
import { AgentInfo } from 'src/app/model/auth/agency/agent-info';
import { Tariff } from 'src/app/model/auth/agency/tariff';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-agent-detail-create',
  templateUrl: './agent-detail-create.component.html',
  styleUrls: ['./agent-detail-create.component.css'],
})
export class AgentDetailCreateComponent implements OnInit {
  subscription: Subscription;

  isLoading: boolean;
  tempSubAgent: Agent;
  userGroupList: UserGroup[];
  formSubmitError: boolean;
  account: UserDetail;

  agentForm: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private agencyManage: AgencyService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(
          localStorage.getItem(appConstant.ACCOUNT_INFO)
        );
      }
    });
    this.initAgentForm();
  }

  private initAgentForm() {
    this.agentForm = new FormGroup({
      agentInfo: new FormGroup({
        address: new FormControl('', Validators.required),
      }),
      name: new FormControl('', Validators.required),
    });
  }

  userGroupName(userGroupId: string): string {
    if (this.userGroupList != null) {
      const userGroup = this.userGroupList.find(
        (u: UserGroup) => u.id === userGroupId
      );
      if (userGroup != undefined) {
        return userGroup.value;
      }
    }
    return null;
  }

  saveAgent() {
    if (this.agentForm.valid) {
      const d: Agent = this.agentForm.value;
      const agentCreate: Agent = new Agent();
      const agentInfo: AgentInfo = new AgentInfo();
      // agentInfo.agentId = d.agentId;
      agentInfo.address = d.agentInfo.address;
      agentInfo.logo = d.agentInfo.logo;
      agentCreate.name = d.name;
      this.agencyManage.createNewAgency(agentCreate, this.account.id).subscribe(
        (res: Agent) => {
          this.alertify.success(`Agent ${res.name} create succeeful`);
          this.route.navigate(['../'], { relativeTo: this.activeRoute });
        },
        (e) => {
          this.alertify.error(`There is some error!!!`);
          console.log(e);
        },
        () => this.route.navigate(['/admin/agency'])
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
