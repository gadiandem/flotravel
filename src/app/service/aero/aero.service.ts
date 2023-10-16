import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {of} from 'rxjs';
import {AirportModel } from '../../model/gca/shopping/request/airport-res';
import { GcaHistoryListReq } from "src/app/model/gca/history/gca-history-list-req";
import { GcaHistoryListRes } from "src/app/model/gca/history/gca-history-list-res";
import { FlocashPaymentGca } from "src/app/model/gca/history/gca-history-item";
import { OfferPriceReq } from "src/app/model/flight/offer-price/request/offer-price-req";


@Injectable({
  providedIn: "root",
})
export class AeroService {

  searchAirportUrl = environment.baseUrl + 'aero/airports?keywords=';
  createBookingUrl = environment.baseUrl + "aero/createBooking";
  gcaHistoryDetailUrl = environment.baseUrl + "gca/historyDetail";
  gcaDeleteUrl = environment.baseUrl + "gca/delete";

  constructor(
    private http: HttpClient,
  ) {}

  createBooking(req: OfferPriceReq) {
    return this.http.post<any>(
      this.createBookingUrl, req
    );
  }

  // getGcaHistoryDetail(paymentId: string, req: GcaHistoryListReq) {
  //   return this.http.post<FlocashPaymentGca>(
  //     this.gcaHistoryDetailUrl + "/" + paymentId, req
  //   );
  // }

  // deleteGcaRecord(id: string) {
  //   return this.http.delete<any>(`${this.gcaHistoryListUrl}/${id}`);
  // }

  // camcelGcaRecord(id: string, resean: string) {
  //   return this.http.delete<any>(`${this.gcaHistoryListUrl}/${id}`);
  // }
}
