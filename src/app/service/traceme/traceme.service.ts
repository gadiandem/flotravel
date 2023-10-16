import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { FlocashPaymentTraceMe } from "src/app/model/traceme/history/traceme-history-item";
import { TracemeHistoryListRes } from "src/app/model/traceme/history/traceme-history-list-res";
import { TraceMeHistoryListReq } from "src/app/model/traceme/history/traceme-history-req";
import { Params } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TracemeService {

  tracemeHistoryListByDateUrl = environment.baseUrl + 'traceMe/history/filterByDate';
  tracemeHistoryListUrl = environment.baseUrl + "traceMe/history";
  tracemeDeleteUrl = environment.baseUrl + "traceMe/delete";
  // tracemeHistoryDetailUrl = environment.baseUrl + "insurance/history";

  constructor(
    private http: HttpClient,
  ) {}

  getTracemeHistoryList(req: TraceMeHistoryListReq) {
    return this.http.post<TracemeHistoryListRes>(
      this.tracemeHistoryListUrl, req
    );
  }
  getTracemeHistoryListByDate(req: TraceMeHistoryListReq) {
    return this.http.post<TracemeHistoryListRes>(
      this.tracemeHistoryListByDateUrl, req
    );
  }
  getTracemetHistoryDetail(paymentId: string, req: TraceMeHistoryListReq) {
    return this.http.post<FlocashPaymentTraceMe>(
      this.tracemeHistoryListUrl + "/" + paymentId, req
    );
  }

  deleteTracemeRecord(id: string) {
    return this.http.delete<any>(`${this.tracemeDeleteUrl}/${id}`);
  }

  addAuthorizationHeader(tokenType: string, accessToken: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set("authorization", `${tokenType} ${accessToken}`);
    return headers;
  }

  postRedirect(request: Params, url: string) {
    // const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let body = new URLSearchParams();
    body.set('MD', 'FLOEC2201195983808859');
    body.set('PaReq', 'eAFVUtFS4jAUfXfGf+j0dbVJKm0pcwlTUKEKKQPdZfex02ahKimWouCjH+OH+SV7Q2HRPOXck5yce26gs10+GS+yXOeFapvMoqYhVVpkuZq3zZ/x7WXT7PDzM4gXpZTXU5luSslhJNfrZC6NPGubNqXM8XyH+T71TA7jYCKfORw0OUpaNpAjxKtlukhUxSFJn7uh4A3GvCsXyAHCUpbhNXdc16N6uVrevbzpRSLsUwak5kElS8lvh5ExDv4YoYhvJiKIw0gEQ2MYjoDseUiLjarKnZYDcgSwKZ/4II7H0xYhs9nMQhlUEX2rF+FNzQI5+RxvtOM1tr3NM77r/t0Rqlbx490beSDq9ceun/2aPzazRhuIPgFZUkluU9umjPkGa7ScZstB5/s6JEvtiYu+MD7fP9iF51LLp9h/XYeVfi6oAUNSc19rgCMocUbHpo4I5HZVKInSGPf/PZCT/d5Ah55WGG/WHSnlN9zfocrSiViIh+mskNG9XQ20lfqQVswxPNtmtaQGQLQMOUwZY9r/BKx8+yHnZ/8AZPO/cw==');
    body.set('TermUrl', 'https://fcms.flocash.com/mpg/threeds.do');
    // body.set('PaReq', '');
    
    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(
      url, body, options
    );
  }
}
