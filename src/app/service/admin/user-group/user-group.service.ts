import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Agent } from 'src/app/model/auth/agency/agency';
import { AgentInfo } from 'src/app/model/auth/agency/agent-info';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { UserGroupDetail } from 'src/app/model/auth/user-group/user-group-detail';


@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  private userGroupListUrl = environment.baseUrl + 'admin/userGroup/list';
  private userGroupDetailUrl = environment.baseUrl + 'admin/userGroup';
  private userGroupCreateUrl = environment.baseUrl + 'admin/userGroup';

  private userGroupDeleteUrl = environment.baseUrl + 'admin/userGroup';

  constructor(private http: HttpClient) {
  }

  getUserGroupList(userId: string) {
    const headers = this.addHeader(userId);
    return this.http.get<UserGroup[]>(this.userGroupListUrl, { headers });
  }

  getUserGroupDetail(groupId: string, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.get<UserGroupDetail>(this.userGroupDetailUrl + '/' + groupId, { headers });
  }

  createNewUserGroup(userGroup: UserGroup, userId: string) {
    const headers = this.addHeader(userId);
    // agency.agentId = 'new agency';
    return this.http.post(this.userGroupCreateUrl, userGroup, { headers });
  }

  editUserGroup(userGroup: UserGroup, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.put(this.userGroupCreateUrl, userGroup, { headers });
  }

  deleteUserGroup(userGroupId: string, userId: string) {
    const headers = this.addHeader(userId);
    return this.http.delete(this.userGroupDeleteUrl + '/' + userGroupId, { headers });
  }

  addHeader(userId: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('user-id', userId);
    return headers;
  }
}
