import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { PaymentOption } from "src/app/model/wallet/deposit/deposit.option";
import { ExchangeResponse } from "src/app/model/wallet/deposit/exchange-rate-response";
import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
import { CreateBankReq } from "src/app/model/wallet/bank-account/create-bank-req";

@Injectable({
  providedIn: "root",
})
export class BankAccountService {

  getBankListUrl = environment.baseUrl + "wallet/bankAccount/bankList";
  depositExchangeRateUrl = environment.baseUrl + "wallet/deposit/exchangeRate";
  createNewBankUrl = environment.baseUrl + "wallet/bankAccount";
  deleteBankUrl = environment.baseUrl + "wallet/bankAccount";

  constructor(
    private http: HttpClient,
  ) {}

  getBankList(userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.get<BankModel[]>(
      this.getBankListUrl, { headers}
    );
  }

  getDepositExchangeRate(source: string, dest: string) {
    let params = new HttpParams();
      params = params.append("source", source);
      params = params.append("dest", dest);
    return this.http.get<ExchangeResponse>(
      this.depositExchangeRateUrl , { params }
    );
  }

  addNewBank(req: CreateBankReq, userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.post<BankModel>(
      this.createNewBankUrl , req, { headers }
    );
  }

  deleteBank(bankId: string) {
    return this.http.delete<any>(
      this.deleteBankUrl
    );
  }

  addUserIdHeader(userId: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set("user-id", `${userId}`);
    return headers;
  }
}
