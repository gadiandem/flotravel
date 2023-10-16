import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HotelRuleConfigure } from 'src/app/model/combine-service/hotel-configure-rule';
import { FlightRuleConfigure } from 'src/app/model/combine-service/flight-configure-rule';
import { FlightRuleConfigureCreate } from 'src/app/model/combine-service/flight-configure-rule-create';


@Injectable({
  providedIn: 'root'
})
export class FlightRuleConfigureService {
  private flightRuleListBaseUrl = environment.baseUrl + 'combine/configure/flight';

  constructor(private http: HttpClient) {
  }

  getFlightRuleList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FlightRuleConfigure[]>(this.flightRuleListBaseUrl, { headers });
  }

  createFlightRule(rule: FlightRuleConfigureCreate, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<FlightRuleConfigure>(this.flightRuleListBaseUrl, rule, { headers });
  }

  getFlightRuleDetail(userId: string, rulleId: string) {
    const headers = new HttpHeaders().set('user-id', userId);
    return this.http.get<FlightRuleConfigure>(`${this.flightRuleListBaseUrl}/${rulleId}`, { headers });
  }

  editFlightRule(rule: FlightRuleConfigureCreate, ruleId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<FlightRuleConfigure>(`${this.flightRuleListBaseUrl}/${ruleId}`, rule, { headers });
  }


  deleteFlightRule(ruleId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.flightRuleListBaseUrl + '/' + ruleId, { headers });
  }


}
