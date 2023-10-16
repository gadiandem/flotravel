import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {Location} from '@angular/common';
import { Store } from '@ngrx/store';

import { DepositStep1 } from "src/app/model/wallet/deposit/deposit-step-1";
import { depositConstant } from "../../../deposit-money/deposit.constant";
import { OptionInfo } from "src/app/model/wallet/deposit/option-info";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { DepositReq } from "src/app/model/wallet/deposit/deposit-req";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { DepositFeeReq } from "src/app/model/wallet/deposit/fee/deposit-fee-req";
import { DepositFeeRes } from "src/app/model/wallet/deposit/fee/deposit-fee-res";
import { GetOptionRes } from "src/app/model/wallet/deposit/deposit.option-res";
import { DepositFee } from "src/app/model/wallet/deposit/fee/deposit-fee";

@Component({
  selector: 'app-deposit-step-three',
  templateUrl: './deposit-step-three.component.html',
  styleUrls: ['./deposit-step-three.component.css']
})
export class DepositStepThreeComponent implements OnInit {
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
    this.isCollapsed = false;
    this.initForm();
    this.depositStep1 = JSON.parse(sessionStorage.getItem(depositConstant.DEPOSIT_STEP_1));
    this.selectedPaymentOption = JSON.parse(sessionStorage.getItem(depositConstant.SELECTED_PAYMENT_OPTION));
    if(this.depositStep1){
      this.updateFormWithData();
    }
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      // this.exchangeRate = data.exchangeRateRes;
      this.depositFeeRes = data.depositFeeRes;
      if(this.depositFeeRes && this.depositFeeRes.depositFee){
        this.updateFormData(this.depositFeeRes.depositFee);
      }
      this.refreshData();
    })
    this.getDepositFee();
  }
  refreshData(){
    if(this.initialLoadData){
      if(!this.depositFeeRes){
        this.getDepositFee();
        // this.getExchangeRate();
      }
    }
    this.initialLoadData = false;
  }
  private initForm() {
    this.depositForm = this.fb.group({
      country: ["", Validators.required],
      currency: ["", Validators.required],
      amount: ["", Validators.required],
      paymentOption: ["", Validators.required],
      fee: ["", Validators.required],
      totalAmount: ["", Validators.required],
      exchangeRate: ["", Validators.required],
      amountToPay: ["", Validators.required],
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

  getExchangeRate(){
    this.store.dispatch(
      new WalletActions.GetExchangeRateStart({
        source: this.depositStep1.currencyCode,
        dest: this.depositStep1.currencyCode,
        // dest: 'USD',
      })
    );
  }

  getDepositFee(){
    const deposistFee: DepositFeeReq = new DepositFeeReq();
    deposistFee.amount = this.depositStep1.amount;
    deposistFee.option = this.selectedPaymentOption.id;
    deposistFee.currency = this.depositStep1.currencyCode;
    deposistFee.country = this.depositStep1.countryCode;
    console.log('depositStart: ' + JSON.stringify(deposistFee));
    this.store.dispatch(
      new WalletActions.GetDepositFeeStart({
        data: deposistFee,
        userId: this.account.id,
        // dest: 'USD',
      })
    );
  }

  updateFormData (depositFee : DepositFee){
    this.depositForm.patchValue({
      totalAmount: this.depositStep1.amount + depositFee.fee,
      fee: depositFee.fee,
      exchangeRate: depositFee.exchangeRate,
      amountToPay: `${depositFee.payAmount} - ${depositFee.currency}`,
    });
  }

  depositBack(){
    this._location.back();
  }

  depositNext() {
    // const d = this.depositForm.value;
    // console.log(JSON.stringify(d));
    // if (this.depositForm.valid) {
    //   sessionStorage.setItem(depositConstant.EXCHANGE_RATE, JSON.stringify(this.exchangeRate));
    //   this.route.navigate(["../summary"], { relativeTo: this.activeRoute });
    // } else {
    //   this.formSubmitError = true;
    //   return;
    // }
    const depositReq = new DepositReq();
    depositReq.depositAmount = this.depositStep1.amount;
    depositReq.amount = this.depositStep1.amount + this.depositFeeRes.depositFee.fee;
    depositReq.currency = this.depositStep1.currencyCode;
    // depositReq.amount = this.depositFeeRes.depositFee.payAmount;
    // depositReq.currency = this.depositFeeRes.depositFee.currency;
    depositReq.payOptionId = this.selectedPaymentOption.id.toString();
    this.store.dispatch(new WalletActions.DepositStart({ data: depositReq, userId: this.account.id }));
    this.route.navigate(["../depositResult"], {
      relativeTo: this.activeRoute,
    });
  }
}
