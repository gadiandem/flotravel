import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { walletConstant } from '../../wallet.constant';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  isCollapsed: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  balanceSummary: AccountSummary[];
  account: UserDetail;
  initialLoadData: boolean = true;
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
      this.balanceSummary = data.balanceSummaryRes? data.balanceSummaryRes.summary : [];
      if(this.balanceSummary.length === 0){
       this.refreshData();
      }
    })
  }

  refreshData(){
    if(this.initialLoadData){
      this.getBalanceSummary();
    }
    this.initialLoadData = false;
  }

  getBalanceSummary(){
    this.store.dispatch( new WalletActions.GetBalanceSummaryStart({ userId: this.account.id }));
  }
}
