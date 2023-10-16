import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Store } from '@ngrx/store';

import { WithdrawInfo } from 'src/app/model/wallet/withdraw/withdraw-info';
import { withdrawConstant } from 'src/app/wallet/withdraw-money/withdraw.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { WithdrawCreateReq } from 'src/app/model/wallet/withdraw/withdraw-create-req';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-withdraw-detail',
  templateUrl: './withdraw-detail.component.html',
  styleUrls: ['./withdraw-detail.component.css']
})
export class WithdrawDetailComponent implements OnInit {
  isCollapsed: boolean;

  account: UserDetail;
  withdrawInfo: WithdrawInfo;
  constructor(private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private activeRoute: ActivatedRoute,
    private route: Router) { }
  ngOnInit() {
    this.withdrawInfo = JSON.parse(sessionStorage.getItem(withdrawConstant.WITHDRAW_INFO));
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    // this.store.select('wallet').subscribe(data => {
    // })
  }

  cancel() {
    this._location.back();
  }
 confirm() {
  // this.alertify.error(`Not feature currently not support`);
  const withdraw = new WithdrawCreateReq();
  withdraw.bankId = this.withdrawInfo.bank.id;
  withdraw.amount = this.withdrawInfo.withdrawAmount;
  withdraw.currency = this.withdrawInfo.currenctlyBalance.currency;
  withdraw.fee = this.withdrawInfo.fee;
  this.store.dispatch(new WalletActions.WithdrawStart({ data: withdraw, userId: this.account.id }));
  this.route.navigate(["../withdrawResult"], {
    relativeTo: this.activeRoute,
  });
  }
}
