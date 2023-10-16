import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AgencySellingCurrencyResponse } from '../../../../model/auth/agency/selling-currency/agency-selling-currency-response';
import { AgencySellingCurrencyRequest } from '../../../../model/auth/agency/selling-currency/agency-selling-currency-request';
import { BaseResponse } from '../../../../model/common/base-response';

@Injectable({
  providedIn: 'root'
})
export class SellingCurrencyService {
  private sellingCurrencyListUrl = environment.baseUrl + 'admin/agency-selling-currency';
  private sellingCurrencyDetailUrl = environment.baseUrl + 'admin/agency-selling-currency/detail';
  private sellingCurrencyCreateUrl = environment.baseUrl + 'admin/agency-selling-currency';
  private sellingCurrencyUpdateUrl = environment.baseUrl + 'admin/agency-selling-currency';
  private sellingCurrencyDeleteUrl = environment.baseUrl + 'admin/agency-selling-currency/remove-configure';

  constructor(private http: HttpClient) {
  }

  getSellingCurrencyList(userId: string) {
    const headers = this.addHeader(userId);
    return this.http.get<AgencySellingCurrencyResponse[]>(this.sellingCurrencyListUrl, {headers});
  }

  getSellingCurrencyDetail(userId: string, email: string) {
    const headers = this.addHeader(userId);
    const params = new HttpParams().set('email', email);
    return this.http.get<AgencySellingCurrencyResponse>(this.sellingCurrencyDetailUrl, {headers, params});
  }

  createSellingCurrency(userId: string, agencySellingCurrencyRequest: AgencySellingCurrencyRequest) {
    const headers = this.addHeader(userId);
    return this.http.post<AgencySellingCurrencyResponse>(this.sellingCurrencyCreateUrl, agencySellingCurrencyRequest, {headers});
  }

  updateSellingCurrency(userId: string, agencySellingCurrencyRequest: AgencySellingCurrencyRequest) {
    const headers = this.addHeader(userId);
    return this.http.put<AgencySellingCurrencyResponse>(this.sellingCurrencyUpdateUrl, agencySellingCurrencyRequest, {headers});
  }

  deleteSellingCurrency(userId: string, agencySellingCurrencyRequest: any) {
    const headers = this.addHeader(userId);
    return this.http.put<BaseResponse>(this.sellingCurrencyDeleteUrl, agencySellingCurrencyRequest, {headers});
  }

  addHeader(userId: string, parentId?: string): HttpHeaders {
    // console.log('parentId: ' + parentId);
    let headers = new HttpHeaders();
    if (parentId == undefined) {
      headers = headers.set('user-id', userId);
    } else {
      headers = headers.set('user-id', userId)
        .set('agent-id', parentId);
    }
    return headers;
  }
}
