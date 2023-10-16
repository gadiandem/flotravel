import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { STATUS, UserType } from '../../wallet.constant';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {
  isCollapsed: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  accountProfile: UserInfoRes;
  accountType: string;
  accountStatus: string;
  account: UserDetail;
  userId: string;
  initialLoadData = true;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.accountProfile = data.merchantProfileRes;
      if(this.accountProfile){
        this.accountType = (this.accountProfile.user.type === 'M') ? UserType.M : UserType.P;
        this.accountStatus = STATUS[this.accountProfile.user.status];
      }
      this.refreshData();
    })
  }

  refreshData(){
    if(this.initialLoadData){
      if(!this.accountProfile){
        this.getProfile();
      }
    }
    this.initialLoadData = false;
  }

  getProfile(){
    this.store.dispatch( new WalletActions.GetMerchantProfileStart({ userId: this.account.id }));
  }
}
