import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';

import { DepositStep1 } from 'src/app/model/wallet/deposit/deposit-step-1';
import { depositConstant } from '../../../deposit-money/deposit.constant';
import { PaymentOption } from 'src/app/model/wallet/deposit/deposit.option';
import { OptionInfo } from 'src/app/model/wallet/deposit/option-info';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { GetOptionRes } from 'src/app/model/wallet/deposit/deposit.option-res';
import { walletConstant } from 'src/app/wallet/wallet.constant';
import { DepositFeeReq } from 'src/app/model/wallet/deposit/fee/deposit-fee-req';

@Component({
  selector: 'app-deposit-step-two',
  templateUrl: './deposit-step-two.component.html',
  styleUrls: ['./deposit-step-two.component.css'],
})
export class DepositStepTwoComponent implements OnInit {
  isCollapsed: boolean;
  depositForm: FormGroup;
  formSubmitError: boolean;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  account: UserDetail;

  depositStep1: DepositStep1;
  depositOptionRes: GetOptionRes;
  allDepositOption: OptionInfo[];
  allOptionType: any[];
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
    if (this.depositStep1) {
      this.updateFormWithData();
    }
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.depositOptionRes = data.depositOptionRes;
      if (this.depositOptionRes) {
        this.listAllDepositOption();
      }
      this.refreshData();
    });
  }

  refreshData() {
    if (this.initialLoadData) {
        this.getDepositOptionList();
    }
    this.initialLoadData = false;
  }

  getDepositOptionList() {
    this.store.dispatch( new WalletActions.GetDepositOptionStart(
      { userId: this.account.id,
      countyCode: this.depositStep1.countryCode,
      currencyCode: this.depositStep1.currencyCode}));
  }

  listAllDepositOption() {
    if (this.depositOptionRes.errorId) {
      this.fetchFailed = true;
      this.errorMes = `${this.depositOptionRes.errorId} - ${this.depositOptionRes.errorCode} - ${this.depositOptionRes.errorMessage}`;
    } else {
      this.allDepositOption = [];
      this.allOptionType = Object.keys(this.depositOptionRes.paymentOptions);
      for (const prop of this.allOptionType) {
        // if (prop === 'banks') {
          this.allDepositOption.push(...this.depositOptionRes.paymentOptions[prop]);
        // }
      }
      if (this.allDepositOption.length === 0) {
        this.fetchFailed = true;
      this.errorMes = `There is no bank option to make deposit: try other country and currency`;
      }
    }
  }

  private initForm() {
    this.depositForm = this.fb.group({
      country: ['', Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      paymentOption: ['', Validators.required],
    });
  }
  updateFormWithData() {
    this.depositForm.patchValue({
      country: `${this.depositStep1.countryName} - (${this.depositStep1.countryCode})`,
      currency: `${this.depositStep1.currencyName} - (${this.depositStep1.currencyCode})`,
      amount: this.depositStep1.amount,
    });
  }

  depositBack() {
    this._location.back();
  }

  depositNext() {
    const d = this.depositForm.value;
    if (this.depositForm.valid) {
      const paymentOptionId = +d.paymentOption;
      const selectedPaymentOption = this.allDepositOption.find(
        (option) => option.id === paymentOptionId
      );
      sessionStorage.setItem(
        depositConstant.SELECTED_PAYMENT_OPTION,
        JSON.stringify(selectedPaymentOption)
      );
      this.getDepositFee(selectedPaymentOption);
      this.route.navigate(['../step3'], { relativeTo: this.activeRoute });
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  getDepositFee(selectedPaymentOption: any) {
    const deposistFee: DepositFeeReq = new DepositFeeReq();
    deposistFee.amount = this.depositStep1.amount;
    deposistFee.option = selectedPaymentOption.id;
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
}
