import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/service/admin/user/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import { User } from 'src/app/model/auth/user/user';
import { appConstant } from 'src/app/app.constant';
import { adminConstant } from '../userGroup-constant';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { WalletCredential } from 'src/app/model/auth/user/wallet-credential';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userDataForEdit: UserDetail;
  account: UserDetail;
  userId: string;
  isLoading: boolean;
  subscription: Subscription;
  storeSub: Subscription;
  formSubmitError: boolean;

  currencies: CurrencyNewRes[];
  isAdmin = false;
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
    this.storeSub = this.store.select('auth').subscribe(authState => {

      this.account = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));

      if (this.account) {
        this.loadUser();
      }
    });
    this.initForm();
  }

  loadUser() {
    const agentId = this.account.agentId || null;

    this.subscription = this.userManage.getUserEditInfo(this.account.id, agentId, this.userId).subscribe(
      (res: UserDetail) => {
        this.userDataForEdit = res;
        if (res.id != null) {
          this.checkAdmin();
          this.updateFormWithData();
        }
        this.isLoading = false;
      }, e => {
        this.isLoading = false;
        console.log(e);
      }
    );
  }

  checkAdmin(){
    this.userDataForEdit.userGroups.forEach((group) => {
      if (group.value === adminConstant.ADMIN) {
        this.isAdmin = true;
      }
      if (group.value === adminConstant.SADMIN) {
        this.isAdmin = true;
      }
    });
  }

  private initForm() {
    this.userForm = new FormGroup({
      agent: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required)
    });
  }
  private updateFormWithData() {
    if(this.userDataForEdit){
      const agentName = this.userDataForEdit.agent ? this.userDataForEdit.agent.name : '';
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
  }
  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = new User();
      userInfo.id = this.userDataForEdit.id;
      userInfo.agentId = d.agent ||  this.userDataForEdit.agentId ;
      userInfo.userGroupIds = [this.userDataForEdit.userGroups[0].id];
      userInfo.email = this.userDataForEdit.email || d.email;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.mobile = d.mobile;

      const currency: CurrencyNewRes = this.currencies.find(item => item.code === d.currency);
      userInfo.currency = currency;

      console.log(JSON.stringify(userInfo));
      this.userManage.editUser(userInfo, this.account.id).subscribe(
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
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
