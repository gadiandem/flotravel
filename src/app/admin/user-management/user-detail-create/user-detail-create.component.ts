import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UserService } from 'src/app/service/admin/user/user.service';
import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { User } from 'src/app/model/auth/user/user';
import { UserCreateExtraInfo } from 'src/app/model/auth/user/user-create-extra-info';
import { Agent } from 'src/app/model/auth/agency/agency';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import * as fromApp from '../../../store/app.reducer';
import { appConstant } from 'src/app/app.constant';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail-create.component.html',
  styleUrls: ['./user-detail-create.component.css']
})
export class UserDetailCreateComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  userDataForCreate: UserCreateExtraInfo;
  account: UserDetail;
  userId: string;
  isLoading: boolean;
  subscription: Subscription;
  formSubmitError: boolean;
  currencies: CurrencyNewRes[];

  agentList: Agent[];
  userGroupList: UserGroup[];

  constructor(private route: Router,
    private userManage: UserService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.formSubmitError = false;
    this.agentList = [];
    this.userGroupList = [];
    this.userDataForCreate = new UserCreateExtraInfo();

    this.store.select('auth').subscribe(authState => {
      // this.isLoading = authState.loading;
      // this.error = authState.authError;
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
      if (this.account != null) {
        this.loadUserExtraInfo();
      }
    });
    this.initForm();
  }
  private initForm() {
    this.userForm = new FormGroup({
      agent: new FormControl('', Validators.required),
      userGroup: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
    });
  }

  loadUserExtraInfo() {
    if (!this.account.agentId) {
      this.account.agentId = '';
    }
    this.subscription = this.userManage.getUserCreateInfo(this.account.id, this.account.agentId).subscribe(
      (res: UserCreateExtraInfo) => {
        this.userDataForCreate = res;
        // this.alertify.success(`Fetch User ${res.name} extra info succeeful:`);
        // this.initFormWithData();
        this.agentList = res.agentList;
        this.userGroupList = res.userGroupList;
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
      }
    );
  }

  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = new User();
      userInfo.id = this.userDataForCreate.id;
      userInfo.agentId = d.agent;
      userInfo.userGroupIds = [d.userGroup];
      userInfo.email = this.userDataForCreate.email || d.email;
      userInfo.password = d.password;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.mobile = d.mobile;
      const currency: CurrencyNewRes = this.currencies.find(item => item.code === d.currency);
      userInfo.currency = currency;

      this.userManage.createNewUser(userInfo, this.account.id, this.account.agentId).subscribe(
        (res: User) => {
          this.alertify.success(`Create ${res.firstName} user succeeful!`);
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }, () => {
          this.route.navigate(['/admin/user']);
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
