import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDetail} from '../../../model/auth/user/user-detail';
import {DepositStep1} from '../../../model/wallet/deposit/deposit-step-1';
import {OptionInfo} from '../../../model/wallet/deposit/option-info';
import {ExchangeResponse} from '../../../model/wallet/deposit/exchange-rate-response';
import {DepositFeeRes} from '../../../model/wallet/deposit/fee/deposit-fee-res';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Store} from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import {depositConstant} from '../../../wallet/deposit-money/deposit.constant';
import {DepositFeeReq} from '../../../model/wallet/deposit/fee/deposit-fee-req';
import {DepositFee} from '../../../model/wallet/deposit/fee/deposit-fee';
import {DepositReq} from '../../../model/wallet/deposit/deposit-req';

@Component({
  selector: 'app-bank-deposit-summary',
  templateUrl: './bank-deposit-summary.component.html',
  styleUrls: ['./bank-deposit-summary.component.css']
})
export class BankDepositSummaryComponent implements OnInit {
  isCollapsed: boolean;
  depositForm: FormGroup;
  formSubmitError: boolean;

  account: UserDetail;
  depositStep1: DepositStep1;
  selectedPaymentOption: OptionInfo;
  exchangeRate: ExchangeResponse;
  depositFeeRes: DepositFeeRes;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoadData = true;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.fetching = true;
    this.isCollapsed = false;
    this.initForm();
    this.depositStep1 = JSON.parse(sessionStorage.getItem(depositConstant.DEPOSIT_STEP_1));
    this.selectedPaymentOption = JSON.parse(sessionStorage.getItem(depositConstant.SELECTED_PAYMENT_OPTION));
    if (this.depositStep1) {
      this.updateFormWithData();
    }
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
     ///this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      // this.exchangeRate = data.exchangeRateRes;
      this.depositFeeRes = data.depositFeeRes;
      if (data.depositFeeRes) {
        this.depositFeeRes = data.depositFeeRes;
        this.updateFormData(this.depositFeeRes.depositFee);
        this.fetching = false;
      } 
      //else {
      //  this.refreshData();
      //  this.fetching = false;
    //  }
    });
  }
  refreshData() {
    if (this.initialLoadData) {
      if (!this.depositFeeRes) {
        this.getDepositFee();
        // this.getExchangeRate();
      }
    }
    this.initialLoadData = false;
  }
  private initForm() {
    this.depositForm = this.fb.group({
      country: ['', Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      paymentOption: ['', Validators.required],
      fee: ['', Validators.required],
      totalAmount: ['', Validators.required],
      exchangeRate: ['', Validators.required],
      amountToPay: ['', Validators.required],
    });
  }
  updateFormWithData() {
    this.depositForm.patchValue({
      country: `${this.depositStep1.countryName} - (${this.depositStep1.countryCode})`,
      currency: `${this.depositStep1.currencyName} - (${this.depositStep1.currencyCode})`,
      amount: this.depositStep1.amount,
      paymentOption: `${this.selectedPaymentOption.displayName} (${this.selectedPaymentOption.type})`,
      fee: 0,
      totalAmount: this.depositStep1.amount,
      exchangeRate: 1,
      amountToPay: +this.depositStep1.amount * 1,
    });
  }

  getExchangeRate() {
    this.store.dispatch(
      new WalletActions.GetExchangeRateStart({
        source: this.depositStep1.currencyCode,
        dest: this.depositStep1.currencyCode,
        // dest: 'USD',
      })
    );
  }

  getDepositFee() {
    const deposistFee: DepositFeeReq = new DepositFeeReq();
    deposistFee.amount = this.depositStep1.amount;
    deposistFee.option = this.selectedPaymentOption.id;
    deposistFee.currency = this.depositStep1.currencyCode;
    deposistFee.country = this.depositStep1.countryCode;
   // console.log('depositStart: ' + JSON.stringify(deposistFee));
    this.store.dispatch(
      new WalletActions.GetDepositFeeStart({
        data: deposistFee,
        userId: this.account.id,
        // dest: 'USD',
      })
    );
  }

  updateFormData(depositFee : DepositFee) {
    this.depositForm.patchValue({
      totalAmount: this.depositStep1.amount + depositFee.fee,
      fee: depositFee.fee,
      exchangeRate: depositFee.exchangeRate,
      amountToPay: `${depositFee.payAmount} - ${depositFee.currency}`,
    });
    this.fetching = false;
  }

  depositBack() {
    this._location.back();
  }

  depositNext() {
    const depositReq = new DepositReq();
    depositReq.depositAmount = this.depositStep1.amount;
    depositReq.amount = this.depositStep1.amount + this.depositFeeRes.depositFee.fee;
    depositReq.currency = this.depositStep1.currencyCode;
    depositReq.payOptionId = this.selectedPaymentOption.id.toString();
    sessionStorage.setItem(depositConstant.DEPOSIT_REQ, JSON.stringify(depositReq))
    this.store.dispatch(new WalletActions.DepositStart({ data: depositReq, userId: this.account.id }));
    this.route.navigate(['../result'], {
      relativeTo: this.activeRoute,
    });
  }

}
