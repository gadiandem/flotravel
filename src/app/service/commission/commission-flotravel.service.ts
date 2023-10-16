import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FlightRuleConfigure } from 'src/app/model/combine-service/flight-configure-rule';
import { environment } from 'src/environments/environment';
import { CommissionFlotravelItem } from 'src/app/model/commission/commission-flotravel-item';
import { CommissionFlotravelCreate } from 'src/app/model/commission/commission-flotravel-create';


@Injectable({
  providedIn: 'root'
})
export class CommissionFlotravelService {
  private flotravelCommisionBaseUrl = environment.baseUrl + 'commission/flotravel';

  constructor(private http: HttpClient) {
  }

  getCommissionList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<CommissionFlotravelItem[]>(this.flotravelCommisionBaseUrl, { headers });
  }

  createCommission(commission: CommissionFlotravelCreate, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<FlightRuleConfigure>(this.flotravelCommisionBaseUrl, commission, { headers });
  }

  getCommissionDetail(userId: string, commissionId: string) {
    const headers = new HttpHeaders().set('user-id', userId);
    return this.http.get<CommissionFlotravelItem>(`${this.flotravelCommisionBaseUrl}/${commissionId}`, { headers });
  }

  editCommission(commission: CommissionFlotravelCreate, commissionId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<CommissionFlotravelItem>(`${this.flotravelCommisionBaseUrl}/${commissionId}`, commission, { headers });
  }


  deleteCommission(commissionId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.flotravelCommisionBaseUrl + '/' + commissionId, { headers });
  }


}
