import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { CardPaymentModel } from "src/app/model/thing-to-do/tour-payment/card-payment-model";
import { UserInfoModel } from "src/app/model/hotel/hotel-payment/user-info.model";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { DepositOrderRes } from "src/app/model/wallet/deposit/deposit-order-res";
import { DepositStep1 } from "src/app/model/wallet/deposit/deposit-step-1";
import { OptionInfo } from "src/app/model/wallet/deposit/option-info";
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { depositConstant } from "../../../deposit-money/deposit.constant";
import { DepositReq } from "src/app/model/wallet/deposit/deposit-req";
import { PayerWallet } from "src/app/model/wallet/deposit/payer";
import { CardInfo } from "src/app/model/flocash/card-info";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { DepositRes } from "src/app/model/wallet/deposit/deposit-res";
import { DEPOSIT_STATUS, REDIRECTMETHOD, REQUESTSTATUS } from "src/app/wallet/wallet.constant";
import { UserInfoRes } from "src/app/model/wallet/profile/user-info-res";
import { DepositService } from "src/app/service/wallet/deposit.service";
import { DepositFeeRes } from "src/app/model/wallet/deposit/fee/deposit-fee-res";

@Component({
  selector: "app-deposit-result",
  templateUrl: "./deposit-result.component.html",
  styleUrls: ["./deposit-result.component.css"],
})
export class DepositResultComponent implements OnInit {
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  userInfo: UserInfoModel[];
  cardPayment: CardPaymentModel;
  user: UserDetail;
  userId: string;
  paymentRes: DepositRes;
  deopistOrder: DepositOrderRes;
  account: UserDetail;
  depositFeeRes: DepositFeeRes;

  initialRequest: boolean;

  depositStep1: DepositStep1;
  selectedPaymentOption: OptionInfo;
  accountProfile: UserInfoRes;
  initialLoadData = true;
  customerInfo: PayerWallet;

  statusRequest: string;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>,
    private depositService: DepositService
  ) {}

  ngOnInit() {
    this.initialRequest = true;
    this.fetchFailed = false;
    this.fetching = true;
    this.depositStep1 = JSON.parse(
      sessionStorage.getItem(depositConstant.DEPOSIT_STEP_1)
    );
    this.selectedPaymentOption = JSON.parse(
      sessionStorage.getItem(depositConstant.SELECTED_PAYMENT_OPTION)
    );
    this.customerInfo = JSON.parse(
      sessionStorage.getItem(depositConstant.CUSTOMER_INFO)
    );
    this.cardPayment = JSON.parse(
      sessionStorage.getItem(depositConstant.CARD_PAYMENT)
    );
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select("wallet").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.accountProfile = data.merchantProfileRes;
      this.depositFeeRes = data.depositFeeRes;
      this.paymentRes = data.depositRes;
      if (this.paymentRes && this.paymentRes.order) {
        this.processResponse();
      } else {
        if (this.paymentRes && this.paymentRes.errorId) {
          this.fetchFailed = true;
          this.errorMes = `${this.paymentRes.errorId} - ${this.paymentRes.errorCode} - ${this.paymentRes.errorMessage}`;
        }
      }
    });
  }

  processResponse() {
    this.deopistOrder = this.paymentRes.order;
    if (this.initialLoadData) {
      const depositStatus = this.deopistOrder.status;
      switch (depositStatus) {
        case DEPOSIT_STATUS["0009"]:
          this.statusRequest = REQUESTSTATUS.PENDING;
          this.onRedirect();
          break;
        case DEPOSIT_STATUS["0004"]:
          this.statusRequest = REQUESTSTATUS.PENDING;
          break;
        case DEPOSIT_STATUS["0003"]:
          this.errorMes = this.deopistOrder.status + this.deopistOrder.statusDesc;
          this.fetchFailed = false;
          break;
        case DEPOSIT_STATUS["0000"]:
          this.fetchFailed = true;
          break;
        case DEPOSIT_STATUS["0012"]:
          this.fetchFailed = true;
          break;
        default:
          this.fetchFailed = false;
          break;
      }
    }
    this.initialLoadData = false;
  }

  onRedirect() {
    const method = this.deopistOrder.redirect.method;
    switch (method.toUpperCase()) {
      case REDIRECTMETHOD.POST:
        console.log("post request to page: " + this.deopistOrder.redirect.url);
        this.sentPostRequest();
        break;
      case REDIRECTMETHOD.GET:
        console.log("redirect to page: " + this.deopistOrder.redirect.url);
        window.open(this.deopistOrder.redirect.url, "_blank");
        break;
    }
  }

  sentPostRequest(){
    this.depositService.postRedirect(this.deopistOrder.redirect.params, this.deopistOrder.redirect.url).subscribe(
      (res: any) => {
        console.log(res);
      }, e => {
        console.log(e);
      }
    )
  }
}
