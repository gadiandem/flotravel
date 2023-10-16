import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Params } from '@fortawesome/fontawesome-svg-core';
import { Subscription } from 'rxjs';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserService } from 'src/app/service/admin/user/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { User } from 'src/app/model/auth/user/user';
import * as fromApp from '../../../store/app.reducer';
import { appConstant, defaultData } from 'src/app/app.constant';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';

@Component({
  selector: 'app-user-detail-edit',
  templateUrl: './user-detail-edit.component.html',
  styleUrls: ['./user-detail-edit.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailEditComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userDataForEdit: UserDetail;
  account: UserDetail;
  userId: string;
  subscription: Subscription;
  formSubmitError: boolean;
  currencies: CurrencyNewRes[];
  defaultData: string;
  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private userManage: UserService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.defaultData = defaultData.noImage;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.formSubmitError = false;
    this.activeRoute.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
      // console.log('userId: ' + this.userId);
      if (this.account != null) {
        if (!this.account.agentId) {
          this.loadUser(this.account.agentId);
        } else {
          this.loadUser(null);
          // this.loadUserExtraInfo();
        }
      }
    });
    this.initForm();
  }

  private updateFormWithData() {
    const agentName = this.userDataForEdit.agent ? this.userDataForEdit.agent.id : '';
    const userGroupName = (this.userDataForEdit.userGroups.length > 0) ? this.userDataForEdit.userGroups[0].id : '';
    this.userForm.patchValue({
      agent: agentName,
      type: userGroupName,
      firstName: this.userDataForEdit.firstName,
      lastName: this.userDataForEdit.lastName,
      email: this.userDataForEdit.email,
      mobile: this.userDataForEdit.mobile,
    });
    if (this.userDataForEdit.currency) {
      this.userForm.patchValue({
        currency: this.userDataForEdit.currency.code,
      });
    }
  }
  private initForm() {
    this.userForm = new FormGroup({
      agent: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
    });
  }

  loadUser(agentId: string) {
    this.subscription = this.userManage.getUserEditInfo(this.account.id, agentId, this.userId).subscribe(
      (res: UserDetail) => {
        this.userDataForEdit = res;
        if (res.id != null) {
          sessionStorage.setItem('userDetail', JSON.stringify(res));
          // this.alertify.success(`Fetch User ${res.name} detail succeeful:`);
          this.updateFormWithData();
        }
      }, e => {
        console.log(e);
      }
    );
  }
  onImgError(event) {
    event.target.src = this.defaultData;
  }
  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = new User();
      userInfo.id = this.userDataForEdit.id;
      userInfo.agentId = d.agent;
      userInfo.userGroupIds = [this.userDataForEdit.userGroups[0].id];
      userInfo.email = this.userDataForEdit.email || d.email;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.mobile = d.mobile;
      const currency: CurrencyNewRes = this.currencies.find(item => item.code === d.currency);
      userInfo.currency = currency;
      this.userManage.editUser(userInfo, this.account.id).subscribe(
        (res: User) => {
          this.alertify.success(`Update ${res.firstName} user succeeful!`);
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
