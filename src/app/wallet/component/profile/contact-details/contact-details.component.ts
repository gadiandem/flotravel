import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { UserType } from '../../../wallet.constant';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserProfileRes } from 'src/app/model/wallet/profile/user-profile-res';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  isCollapsed: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  accountProfile: UserInfoRes;
  userInfo: UserInfo;
  accountType: string;
  account: UserDetail;
  editMode: boolean;
  initialLoadData = true;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.editMode = false;
    // this.accountProfile = JSON.parse(sessionStorage.getItem(depositConstant.ACCOUNT_PROFILE));
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.accountProfile = data.merchantProfileRes;
      if (this.accountProfile && this.accountProfile.user) {
        this.accountType = (this.accountProfile.user.type === 'M') ? UserType.M : UserType.P;
        this.userInfo = this.accountProfile.user;
      }
      this.refreshData();
    });
  }
  refreshData() {
    if (this.initialLoadData) {
      if (!this.accountProfile) {
        this.getProfile();
      }
    }
    this.initialLoadData = false;
  }

  getProfile() {
    this.store.dispatch( new WalletActions.GetMerchantProfileStart({ userId: this.account.id }));
  }

  gotoEdit() {
    this.editMode = true;
  }

  closeEditMode() {
    this.editMode = false;
  }
}
