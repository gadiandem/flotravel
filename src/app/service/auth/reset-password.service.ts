import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { of } from "rxjs";
import { AirportModel } from "../../model/gca/shopping/request/airport-res";
import { GcaHistoryListReq } from "src/app/model/gca/history/gca-history-list-req";
import { GcaHistoryListRes } from "src/app/model/gca/history/gca-history-list-res";
import { FlocashPaymentGca } from "src/app/model/gca/history/gca-history-item";
import { OfferPriceReq } from "src/app/model/flight/offer-price/request/offer-price-req";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordService {
  forgetPasswordUrl = environment.baseUrl + "resetPassword/forget";
  checkTokenUrl = environment.baseUrl + "resetPassword/checkTokenValid";
  resetPasswordUrl = environment.baseUrl + "resetPassword/reset";

  constructor(private http: HttpClient) {}

  forgetPassword(email: string) {
    const request = {email: email};
    return this.http.post<any>(this.forgetPasswordUrl, request);
  }

  checkTokenValid(token: string) {
    return this.http.get<any>(`${this.checkTokenUrl}/${token}`);
  }

  
  resetPassword(payload: any) {
    return this.http.post<any>(this.resetPasswordUrl, payload);
  }
}
