import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { CardPaymentModel } from "src/app/model/thing-to-do/tour-payment/card-payment-model";
import { UserInfoModel } from "src/app/model/hotel/hotel-payment/user-info.model";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { appConstant } from "src/app/app.constant";
import { PaymentInfo } from "src/app/model/flocash/payment-info";
import { DepositOrderRes } from "src/app/model/wallet/deposit/deposit-order-res";
import { DepositService } from "src/app/service/wallet/deposit.service";
import { DepositStep1 } from "src/app/model/wallet/deposit/deposit-step-1";
import { OptionInfo } from "src/app/model/wallet/deposit/option-info";
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { UserInfo } from "src/app/model/wallet/profile/user-info";
import { depositConstant } from "../../../deposit-money/deposit.constant";
import { DepositReq } from "src/app/model/wallet/deposit/deposit-req";
import { PayerWallet } from "src/app/model/wallet/deposit/payer";
import { CardInfo } from "src/app/model/flocash/card-info";
import * as fromApp from 'src/app/store/app.reducer';
import { WithdrawCreateRes } from "src/app/model/wallet/withdraw/withdraw-create-res";
import { WithdrawInfo } from "src/app/model/wallet/withdraw/withdraw-info";
import { withdrawConstant } from "src/app/wallet/withdraw-money/withdraw.constant";

@Component({
  selector: 'app-withdraw-result',
  templateUrl: './withdraw-result.component.html',
  styleUrls: ['./withdraw-result.component.css']
})
export class WithdrawResultComponent implements OnInit {
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  account: UserDetail;

  withdrawInfo: WithdrawInfo;
  withdrawCreateRes: WithdrawCreateRes;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.withdrawInfo = JSON.parse(sessionStorage.getItem(withdrawConstant.WITHDRAW_INFO));

    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.withdrawCreateRes = data.withrawRes;
    })
  }
}
