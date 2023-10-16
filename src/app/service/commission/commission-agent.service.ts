import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommissionAgentItem } from 'src/app/model/commission/commission-agent-item';
import { CommissionAgentCreate } from 'src/app/model/commission/commission-agent-create';


@Injectable({
  providedIn: 'root'
})
export class CommissionAgentService {
  private agentCommissionBaseUrl = environment.baseUrl + 'commission/agent';

  constructor(private http: HttpClient) {
  }

  getCommissionList(userId: string, agentId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId)
      .set('agent-id', agentId);
    return this.http.get<CommissionAgentItem[]>(this.agentCommissionBaseUrl, { headers });
  }

  createCommission(rule: CommissionAgentCreate, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<CommissionAgentItem>(this.agentCommissionBaseUrl, rule, { headers });
  }

  getCommissionDetail(userId: string, commissionId: string) {
    const headers = new HttpHeaders().set('user-id', userId);
    return this.http.get<CommissionAgentItem>(`${this.agentCommissionBaseUrl}/${commissionId}`, { headers });
  }

  editCommission(rule: CommissionAgentCreate, commissionId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<CommissionAgentItem>(`${this.agentCommissionBaseUrl}/${commissionId}`, rule, { headers });
  }


  deleteCommission(commissionId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.agentCommissionBaseUrl + '/' + commissionId, { headers });
  }


}
