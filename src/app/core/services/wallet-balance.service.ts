import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
import { SummaryBalanceRes } from "src/app/model/wallet/summary/balance-summary-res";

@Injectable({
  providedIn: "root",
})
export class WalletBalanceService {

  getBalanceSummaryUrl = environment.baseUrl + 'wallet/summary/balance';

  constructor(
    private http: HttpClient,
  ) { }

  async getSummaryBalance() {
    return await this.http.get<SummaryBalanceRes>(this.getBalanceSummaryUrl).toPromise();
  }

  checkWalletBalanceEnough(price: number, currency: string): boolean {
    // let balanceSummary: SummaryBalanceRes;
    let isEnoughBalance = false;
    this.getSummaryBalance().then(response => {
      // balanceSummary = response);
      if(response && response.summary.length > 0){
        let accounts =  response.summary[0].accounts;
        if(accounts.length > 0){
          let checkBalance = accounts.filter(item => item.currency === currency);
          if(checkBalance && checkBalance.length > 0){
            if (price <= +checkBalance[0].balance) {
              isEnoughBalance = true;
            }
          }
        }
      }
    })
    return isEnoughBalance;
  }

}
