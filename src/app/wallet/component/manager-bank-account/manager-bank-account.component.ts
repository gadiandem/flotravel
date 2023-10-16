import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from '@ngrx/store';

import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
@Component({
  selector: "app-manager-bank-account",
  templateUrl: "./manager-bank-account.component.html",
  styleUrls: ["./manager-bank-account.component.css"],
})
export class ManagerBankAccountComponent implements OnInit {
  isCollapsed: boolean;

  bankList: BankModel[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  account: UserDetail;
  initialLoadData = true;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.fetching = true;
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.bankList = data.bankListRes;
      this.refreshData();
    })
  }

  refreshData(){
    if(this.initialLoadData){
      if(this.bankList.length === 0){
        this.getBankList();
      }
    }
    this.initialLoadData = false;
  }

  getBankList() {
    this.store.dispatch( new WalletActions.GetBankListStart({ userId: this.account.id }));
  }

  
  confirmDelete(bank: BankModel) {
    this.route.navigate(["../deleteBank", bank.id], { relativeTo: this.activeRoute });
  }

  next() {
    this.route.navigate(["../addBank"], { relativeTo: this.activeRoute });
  }
}
