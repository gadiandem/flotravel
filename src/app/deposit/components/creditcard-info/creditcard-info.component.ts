import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { depositConstant } from 'src/app/wallet/deposit-money/deposit.constant';
import { DepositReq } from 'src/app/model/wallet/deposit/deposit-req';
import { CardInfo } from 'src/app/model/flocash/card-info';
import { DepositRes } from 'src/app/model/wallet/deposit/deposit-res';
import { DEPOSIT_STATUS } from 'src/app/wallet/wallet.constant';

@Component({
  selector: 'app-creditcard-info',
  templateUrl: './creditcard-info.component.html',
  styleUrls: ['./creditcard-info.component.css']
})
export class CreditcardInfoComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  cardPaymentForm: FormGroup;
  account: UserDetail;
  paymentRes: DepositRes;
  warningMessage: string;

  messages: any = {
    validDate: "valid\ndate",
    monthYear: "mm/yyyy",
  };
  placeholders: any = {
    number: "•••• •••• •••• ••••",
    name: "Full Name",
    expiry: "••/••",
    cvc: "•••",
  };
  masks: any;
  constructor( private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user || JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
    });
    this.store.select('wallet').subscribe((data) => {
      this.paymentRes = data.depositRes;
      if(this.paymentRes && this.paymentRes.order && (this.paymentRes.order.status === DEPOSIT_STATUS['0010'])){
        this.warningMessage = this.paymentRes.order.statusDesc
      }
    });
  }

  initForm(){
     this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", Validators.required],
      cvv: ["", Validators.required],
    });
  }

  cancel(){
    // this._location.back();
    this.route.navigate(["../start"], { relativeTo: this.activeRoute });
  }

  next(){
    // this.route.navigate(["../verifyCard"], { relativeTo: this.activeRoute });
    if(this.cardPaymentForm.valid){
      // this._location.back();
    const d = this.cardPaymentForm.value;
    const cardInfo = new CardInfo();
    cardInfo.cardHolder = d.cardName;
    cardInfo.cardNumber = d.cardNo;
    const month_year: string[] = d.expiry.split(' / ');
    cardInfo.expireMonth = month_year[0];
    cardInfo.expireYear = month_year[1];
    cardInfo.cvv = d.cvv;

    const depositRequest: DepositReq = JSON.parse(sessionStorage.getItem(depositConstant.DEPOSIT_REQ));
    depositRequest.cardInfo = cardInfo;
    this.store.dispatch(new WalletActions.DepositStart({ data: depositRequest, userId: this.account.id }));
      this.route.navigate(["../result"], { relativeTo: this.activeRoute });
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
