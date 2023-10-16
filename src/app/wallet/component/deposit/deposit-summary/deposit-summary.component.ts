import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { Store } from "@ngrx/store";

import { OptionInfo } from "src/app/model/wallet/deposit/option-info";
import { SessionStorageService } from "src/app/service/session-storage.service";
import { CardPaymentModel } from "src/app/model/hotel/hotel-payment/card-payment.model";
import { DepositStep1 } from "src/app/model/wallet/deposit/deposit-step-1";
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { depositConstant } from "../../../deposit-money/deposit.constant";
import { UserInfo } from "src/app/model/wallet/profile/user-info";
import { PayerWallet } from "src/app/model/wallet/deposit/payer";
import { DepositReq } from "src/app/model/wallet/deposit/deposit-req";
import { CardInfo } from "src/app/model/flocash/card-info";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { UserInfoRes } from "src/app/model/wallet/profile/user-info-res";
@Component({
  selector: 'app-deposit-summary',
  templateUrl: './deposit-summary.component.html',
  styleUrls: ['./deposit-summary.component.css']
})
export class DepositSummaryComponent implements OnInit {
  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  formSubmitError: boolean;
  cardPayment: CardPaymentModel;
  isCollapsed: boolean;
  isCardCollapsed: boolean;
  isSummaryCollapsed: boolean;
  account: UserDetail;
  
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
  // user: User;

  depositStep1: DepositStep1;
  selectedPaymentOption: OptionInfo;
  exchangeRate: ExchangeResponse;
  accountProfile: UserInfoRes;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.formSubmitError = false;
    this.initForm();
    this.depositStep1 = JSON.parse(sessionStorage.getItem(depositConstant.DEPOSIT_STEP_1));
    this.selectedPaymentOption = JSON.parse(sessionStorage.getItem(depositConstant.SELECTED_PAYMENT_OPTION));
    // this.exchangeRate = JSON.parse(sessionStorage.getItem(depositConstant.EXCHANGE_RATE));
    this.accountProfile = JSON.parse(sessionStorage.getItem(depositConstant.ACCOUNT_PROFILE));
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.exchangeRate = data.exchangeRateRes;
      this.accountProfile = data.merchantProfileRes;
    })
    if (this.cardPayment) {
      this.initFormWithData();
    }
    if (this.accountProfile) {
      this.initilCustomerFormData();
    }
  }

  private initForm() {
    this.customersForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      mobile: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });

    this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", Validators.required],
      cvv: ["", Validators.required],
    });
  }

  private initFormWithData() {
    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
    });

  }

  initilCustomerFormData() {
    this.customersForm.patchValue({
      firstName: "",
      middleName: "",
      lastName: this.accountProfile.user.lastName,
      mobile: this.accountProfile.user.mobile,
      email: this.accountProfile.user.email
    })
  }

  deposit() {
    if (this.customersForm.valid && (this.cardPaymentForm.valid)) {
      const d = this.customersForm.value;
      const cardPayment = this.cardPaymentForm.value;
      const customerInfo = new PayerWallet();
      customerInfo.firstName = d.firstName;
      customerInfo.lastName = d.lastName;
      customerInfo.mobile = d.mobile;
      customerInfo.email = d.email;
      customerInfo.country = this.depositStep1.countryCode;
      this.sessionStorageService.set( depositConstant.CUSTOMER_INFO,customerInfo);
      this.sessionStorageService.set(depositConstant.CARD_PAYMENT,cardPayment);

      const depositReq = new DepositReq();
      depositReq.amount = this.depositStep1.amount * this.exchangeRate.exchange.rate;
      depositReq.currency = this.depositStep1.currencyCode;
      depositReq.payOptionId = this.selectedPaymentOption.id.toString();
      const payer = customerInfo;
      depositReq.payer = payer;
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, "");
      const month_year: string[] = cardPayment.expiry.replace(/ /g, "").split("/");
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      depositReq.cardInfo = cardInfo;
      this.store.dispatch(new WalletActions.DepositStart({ data: depositReq, userId: this.account.id }));

      this.route.navigate(["../depositResult"], {
        relativeTo: this.activeRoute,
      });
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
