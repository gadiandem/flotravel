import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { Store } from '@ngrx/store';

import { BankModel } from 'src/app/model/wallet/bank-account/bank-model';
import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';
import { BalanceSummary } from 'src/app/model/wallet/summary/balance-summary';
import { AlertifyService } from 'src/app/service/alertify.service';
import { WithdrawInfo } from 'src/app/model/wallet/withdraw/withdraw-info';
import { withdrawConstant } from 'src/app/wallet/withdraw-money/withdraw.constant';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: 'app-withdraw-choose-bank',
  templateUrl: './withdraw-choose-bank.component.html',
  styleUrls: ['./withdraw-choose-bank.component.css']
})
export class WithdrawChooseBankComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  chooseBankForm: FormGroup;

  currencies: BalanceSummary[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  bankList: BankModel[];
  balanceSummary: AccountSummary[];
  initialLoadData = true;
  account: UserDetail;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
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
      this.balanceSummary = data.balanceSummaryRes ? data.balanceSummaryRes.summary : [];
      this.bankList = data.bankListRes;
      this.refreshData();
    })
  }

  refreshData(){
    // this.getBankList()
    if(this.initialLoadData){
      if(this.balanceSummary.length === 0){
        this.getBalanceSummary();
      } else {
        this.currencies = this.balanceSummary[0].accounts
      }
      if(this.bankList.length === 0){
        this.getBankList();
      }
    }
    this.initialLoadData = false;
  }
  getBankList() {
    this.store.dispatch( new WalletActions.GetBankListStart({ userId: this.account.id }));
  }

  getBalanceSummary(){
    this.store.dispatch( new WalletActions.GetBalanceSummaryStart({ userId: this.account.id }));
  }

  checkValidAmount(){
    const d = this.chooseBankForm.value
    let valid = false;
    if(d.currency){
      const availableAmount = +this.balanceSummary[0].accounts.find(bank => d.currency === bank.currency).balance;
      valid =  (availableAmount >= +d.amount) ? true : false;
    }
    this.fetchFailed = !valid;
    return valid;
  }

  initForm() {
    this.chooseBankForm = this.fb.group({
      bank: ["", Validators.required],
      amount: ["", Validators.required],
      currency: ["", Validators.required]
    });
  }

  cancel() {
    this._location.back();
  }

  confirm() {
    if (this.chooseBankForm.valid) {
      const validAmount =  this.checkValidAmount()
      if(validAmount){
        const d = this.chooseBankForm.value
        const withdrawInfo = new WithdrawInfo();
        withdrawInfo.bank = this.bankList.find(bank => bank.id === +d.bank);
        withdrawInfo.fee = withdrawConstant.WITHDRAW_FEE;
        withdrawInfo.withdrawAmount = +d.amount;
        withdrawInfo.currenctlyBalance = this.balanceSummary[0].accounts.find(balance => balance.currency === d.currency)
        sessionStorage.setItem(withdrawConstant.WITHDRAW_INFO, JSON.stringify(withdrawInfo));
        this.route.navigate(["../withdrawDetail"], { relativeTo: this.activeRoute });
      } else {
        this.alertify.error(`Not enough money with this currency`);
      }
      // this._location.back();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}