import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmailExistValidation } from '../model/wallet/email-validation';
import { environment } from 'src/environments/environment';
import { AgentNameExistValidation } from '../model/wallet/agent-name-validation';

@Injectable({
  providedIn: 'root'
})
export class AgentNameValidationService {

  checkAgentNameExistUrl = environment.baseUrl + 'admin/agency/validation';

  constructor(private http: HttpClient) { }

  agentNameValidation(email: string) {
    const params = new HttpParams()
    .set("agentName", email);

    return this.http.get<AgentNameExistValidation>(`${this.checkAgentNameExistUrl}`, { params });
  }

}
