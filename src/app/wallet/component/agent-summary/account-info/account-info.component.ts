import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { STATUS } from '../../../wallet.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  isCollapsed: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  accountProfile: UserInfoRes;
  account: UserDetail;
  accountStatus: string;
  balanceSummary: AccountSummary[];
  initialLoadData = true;
  constructor(private store: Store<fromApp.AppState>,
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.accountStatus = STATUS['00'];
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.accountProfile = data.merchantProfileRes;
      this.balanceSummary = data.balanceSummaryRes ? data.balanceSummaryRes.summary : [];
      if (this.accountProfile) {
        this.accountStatus = STATUS[this.accountProfile.user.status];
      }
      this.fetchNewData();
    });
  }

  fetchNewData() {
    if (this.initialLoadData) {
      if (!this.accountProfile) {
        this.getProfile();
      }
      if (!this.balanceSummary || this.balanceSummary.length === 0) {
        this.getBalanceSummary();
      }
    }
    this.initialLoadData = false;
  }

  refresh() {
    this.getProfile();
    this.getBalanceSummary();
  }

  getProfile() {
    this.store.dispatch( new WalletActions.GetMerchantProfileStart({ userId: this.account.id }));
  }

  getBalanceSummary() {
    this.store.dispatch( new WalletActions.GetBalanceSummaryStart({ userId: this.account.id }));
  }

  uploadDocument() {
    console.log('Upload document');
    this.route.navigate(['../uploadDocument'], { relativeTo: this.activeRoute });
  }
  verifyAddress() {
    console.log('Verify address');
    this.route.navigate(['../verifyAddress'], { relativeTo: this.activeRoute });
  }

  documentList() {
    console.log('Document list');
    this.route.navigate(['../documentList'], { relativeTo: this.activeRoute });

  }
}
