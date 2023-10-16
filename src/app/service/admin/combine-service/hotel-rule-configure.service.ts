import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HotelRuleConfigure } from 'src/app/model/combine-service/hotel-configure-rule';
import { HotelRuleConfigureCreate } from 'src/app/model/combine-service/hotel-configure-rule-create';
import { HotelItem } from 'src/app/model/combine-service/hotel-item';


@Injectable({
  providedIn: 'root'
})
export class HotelRuleConfigureService {
  private hotelRuleListBaseUrl = environment.baseUrl + 'combine/configure/hotel';
  private airportInCountryBaseUrl = environment.baseUrl + 'combine/destinations/airport';

  constructor(private http: HttpClient) {
  }
  getHotelInCityList(cityId: string) {
    return this.http.get<HotelItem[]>(`${this.hotelRuleListBaseUrl}/list-by-city/${cityId}`);
  }

  getAirportByCountryCode(countryCode: string, pageSize?: string,page?: string) {
    const params = new HttpParams()
      .set("cityCode", countryCode)
      .set("pageSize", (pageSize || '15'))
      .set("page", (page || '0'));

    return this.http.get<HotelItem[]>(`${this.airportInCountryBaseUrl}`, {params});
  }

  getHotelRuleList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<HotelRuleConfigure[]>(this.hotelRuleListBaseUrl, { headers });
  }

  createHotelRule(rule: HotelRuleConfigureCreate, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<HotelRuleConfigure>(this.hotelRuleListBaseUrl, rule, { headers });
  }

  getHotelRuleDetail(userId: string, rulleId: string) {
    const headers = new HttpHeaders().set('user-id', userId);
    return this.http.get<HotelRuleConfigure>(`${this.hotelRuleListBaseUrl}/${rulleId}`, { headers });
  }

  editHotelRule(rule: HotelRuleConfigureCreate, ruleId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<HotelRuleConfigure>(`${this.hotelRuleListBaseUrl}/${ruleId}`, rule, { headers });
  }


  deleteHotelRule(ruleId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.hotelRuleListBaseUrl + '/' + ruleId, { headers });
  }


}
