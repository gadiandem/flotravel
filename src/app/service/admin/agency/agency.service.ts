import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Agent} from 'src/app/model/auth/agency/agency';
import {AgentInfo} from 'src/app/model/auth/agency/agent-info';


@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private agencyListUrl = environment.baseUrl + 'admin/agency';
  private agencyListNoValidateUrl = environment.baseUrl + 'admin/agency/list';
  private agencyCreateUrl = environment.baseUrl + 'admin/agency/create';
  private agencyEditUrl = environment.baseUrl + 'admin/agency/update';
  private agencyDeleteUrl = environment.baseUrl + 'admin/agency/delete';
  private subAgencyDeleteUrl = environment.baseUrl + 'admin/agency/subAgent/delete';
  private subAgencyCreateUrl = environment.baseUrl + 'admin/agency/subAgent/create';
  private subAgencyEditUrl = environment.baseUrl + 'admin/agency/subAgent/update';
  private agencyUrl = environment.baseUrl + 'admin/agency';

  constructor(private http: HttpClient) {
  }

  getAgencyListNoValidate() {
    return this.http.get<Agent[]>(this.agencyListNoValidateUrl);
  }


  getAgencyList(userId: string) {
    const headers = this.addHeader(userId);
    return this.http.get<Agent[]>(this.agencyListUrl, {headers});
  }

  getAgency(agentId: string, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.get<Agent>(this.agencyUrl + '/' + agentId, {headers});
  }

  createNewAgency(agency: Agent, userId: string) {
    const headers = this.addHeader(userId);
    // agency.agentId = 'new agency';
    const agentInfo = new AgentInfo();
    agentInfo.address = agency.agentInfo.address;
    agentInfo.website = agency.agentInfo.website;
    agentInfo.logo = agency.agentInfo.logo;
    agency.agentInfo = agentInfo;

    return this.http.post<Agent>(this.agencyCreateUrl, agency, {headers});
  }

  createNewSubAgency(agency: Agent, userId: string) {
    const headers = this.addHeader(userId, agency.parent);
    // agency.agentId = 'new agency';
    const agentInfo = new AgentInfo();
    agentInfo.address = agency.agentInfo.address;
    agentInfo.website = agency.agentInfo.website;
    agentInfo.logo = agency.agentInfo.logo;
    agency.agentInfo = agentInfo;

    return this.http.post<Agent>(this.subAgencyCreateUrl, agency, {headers});
  }

  editAgency(agency: Agent, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.put<Agent>(this.agencyEditUrl, agency, {headers});
  }

  editSubAgency(agency: Agent, userId: string) {
    const headers = this.addHeader(userId, agency.parent);
    return this.http.put<Agent>(this.subAgencyEditUrl, agency, {headers});
  }

  deleteAgency(agentId: string, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.delete(this.agencyDeleteUrl + '/' + agentId, {headers});
  }


  deleteSubAgency(agentId: string, userId: string, parentId: string) {
    console.log('parentId: ' + parentId);
    const headers = this.addHeader(userId, parentId);
    return this.http.delete(this.subAgencyDeleteUrl + '/' + agentId, {headers});
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
