import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { User } from 'src/app/model/auth/user/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { UserService } from 'src/app/service/admin/user/user.service';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { appConstant } from 'src/app/app.constant';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { WalletCredential } from 'src/app/model/auth/user/wallet-credential';

@Component({
  selector: 'app-profile-supper-admin',
  templateUrl: './profile-supper-admin.component.html',
  styleUrls: ['./profile-supper-admin.component.css']
})
export class ProfileSupperAdminComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userDataForEdit: UserDetail;
  account: UserDetail;
  userId: string;
  subscription: Subscription;
  formSubmitError: boolean;
  userGroupList: UserGroup[];
  currencies: CurrencyNewRes[];

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private userManage: UserService,
    private alertify: AlertifyService,
    private _location: Location,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.activeRoute.params.subscribe((params: Params) => {
      this.userId = params['userId'];
    });
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    //  console.log('userId: ' + this.userId);
      if (this.account != null) {
        this.loadUser();
      }
    });
    this.initForm();
    this.loadUserGroup();
  }
  loadUser() {
    this.subscription = this.userManage.getSuperUserInfo(this.account.id).subscribe(
      (res: UserDetail) => {
        this.userDataForEdit = res;
        if (res.id != null) {
          sessionStorage.setItem('userDetail', JSON.stringify(res));
          // this.alertify.success(`Fetch User ${res.name} detail succeeful:`);
          this.updateFormWithData();
          this.updateUserGroupName();
        }
      }, e => {
        console.log(e);
      }
    );
  }

  loadUserGroup() {
    this.subscription = this.userManage.getUserGroupList(this.account.id).subscribe(
      (res: UserGroup[]) => {
        this.userGroupList = res;
        this.updateFormWithData();
        this.updateUserGroupName();
      }, e => {
        console.log(e);
      }
    );
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
  private updateFormWithData() {
    if(this.userDataForEdit){
      const agentName = this.userDataForEdit.agent ? this.userDataForEdit.agent.name : '';

      this.userForm.patchValue({
        agent: agentName,
        type: this.userDataForEdit.userGroupIds[0],
        firstName: this.userDataForEdit.firstName,
        lastName: this.userDataForEdit.lastName,
        email: this.userDataForEdit.email,
        mobile: this.userDataForEdit.mobile
      });
      if (this.userDataForEdit.currency) {
        this.userForm.patchValue({
          currency: this.userDataForEdit.currency.code,
        });
      }
    }
  }

  updateUserGroupName(){
    if(this.userDataForEdit && this.userGroupList && this.userGroupList.length > 0){
      const userGroup: UserGroup = this.userGroupList.find(g => g.id === this.userDataForEdit.userGroupIds[0]);
      this.userForm.patchValue({
        type: userGroup.value
      })
    }
  }

  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = new User();
      userInfo.id = this.userDataForEdit.id;
      userInfo.agentId = d.agent ||  this.userDataForEdit.agentId ;
      userInfo.userGroupIds = [this.userDataForEdit.userGroupIds[0]];
      userInfo.email = this.userDataForEdit.email || d.email;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.mobile = d.mobile;
      const currency: CurrencyNewRes = this.currencies.find(item => item.code === d.currency);
      userInfo.currency = currency;

      console.log(JSON.stringify(userInfo));
      this.userManage.editSuperUser(userInfo, this.account.id).subscribe(
        (res: User) => {
          this.alertify.success(`Update ${res.firstName} user succeeful!`);
          this.loadUser();
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onImgError(event) {
    event.target.src = "./assets/no-image.png";
  }
}
