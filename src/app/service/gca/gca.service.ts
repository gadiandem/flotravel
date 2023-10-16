import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {of} from 'rxjs';
import {AirportModel } from '../../model/gca/shopping/request/airport-res';
import { GcaHistoryListReq } from "src/app/model/gca/history/gca-history-list-req";
import { GcaHistoryListRes } from "src/app/model/gca/history/gca-history-list-res";
import { FlocashPaymentGca } from "src/app/model/gca/history/gca-history-item";
import { QuoteCreatedRes } from "src/app/model/gca/quote/response/quote-created-res";
import { GcaQuoteReq } from "src/app/model/gca/quote/request/gca-quote-req";


@Injectable({
  providedIn: "root",
})
export class GcaService {

  searchAirportUrl = environment.baseUrl + 'ndc/airports?keywords=';
  gcaHistoryListUrl = environment.baseUrl + "gca/historyList";
  gcaHistoryListByDateUrl = environment.baseUrl + "gca/historyList/filterByDate";
  gcaHistoryDetailUrl = environment.baseUrl + "gca/historyDetail";
  gcaDeleteUrl = environment.baseUrl + "gca/delete";
  gcaQuoteCreateUrl = environment.baseUrl + "gca/quote";

  constructor(
    private http: HttpClient,
  ) {}

  searchAirport(searchTerm: string) {
    if (searchTerm.length < 3) {
      return of([]);
    }
    return this.http.get<AirportModel[]>(this.searchAirportUrl + searchTerm);
  }

  getGcaHistoryList(req: GcaHistoryListReq) {
    return this.http.post<GcaHistoryListRes>(
      this.gcaHistoryListUrl, req
    );
  }

  getGacHistoryListByDate(req: GcaHistoryListReq) {
    return this.http.post<GcaHistoryListRes>(
      this.gcaHistoryListByDateUrl, req
    );
  }


  getGcaHistoryDetail(paymentId: string, req: GcaHistoryListReq) {
    return this.http.post<FlocashPaymentGca>(
      this.gcaHistoryDetailUrl + "/" + paymentId, req
    );
  }

  deleteGcaRecord(id: string) {
    return this.http.delete<any>(`${this.gcaHistoryListUrl}/${id}`);
  }

  camcelGcaRecord(id: string, resean: string) {
    return this.http.delete<any>(`${this.gcaHistoryListUrl}/${id}`);
  }

  getQuote(data: GcaQuoteReq){
    return this.http.post<QuoteCreatedRes>(this.gcaQuoteCreateUrl, data)
  }
}
