import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/model/auth/user/user';
import { UserCreateExtraInfo } from 'src/app/model/auth/user/user-create-extra-info';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserListRes } from 'src/app/model/auth/user/userListRes';
import { UserGroup } from 'src/app/model/auth/agency/user-group';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userListUrl = environment.baseUrl + 'admin/user/list';
  private userListPaginationUrl = environment.baseUrl + 'admin/user';
  private userUrl = environment.baseUrl + 'admin/user';
  private userCreateUrl = environment.baseUrl + 'admin/user/create';
  private userUpdateUrl = environment.baseUrl + 'admin/user/update';
  private userDeleteUrl = environment.baseUrl + 'admin/user/delete';
  private userEditUrlGet = environment.baseUrl + 'admin/user/edit';
  private getSuperAdminUrl = environment.baseUrl + 'superAdmin/user';
  private getUserGroupListUrl = environment.baseUrl + 'admin/userGroup/list';
  private updateSuperUserUrl = environment.baseUrl + 'superAdmin/user/update';

  constructor(private http: HttpClient) {
  }

  getUserList(userId: string) {
    return this.http.get<UserListRes[]>(this.userListUrl);
  }
  getUserListPagination(page: number, pageSize: number, searchText?: string) {
    let params;
    if (searchText) {
      params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('search', searchText);
    } else {
      params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
    }
    return this.http.get<any>(this.userListPaginationUrl, { params });
  }
  getUserById(userId: string, accountId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<User>(this.userUrl + '/' + accountId, { headers });
  }

  getUserEditInfo(userId: string, agentId: string, userEditId: string) {
    let headers: HttpHeaders;
    if (agentId) {
      headers = new HttpHeaders()
        .set('user-id', userId)
        .set('agent-id', agentId);
    } else {
      headers = new HttpHeaders()
        .set('user-id', userId);
    }
    return this.http.get<UserDetail>(this.userEditUrlGet + '/' + userEditId, { headers });
  }
  getSuperUserInfo(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<UserDetail>(`${this.getSuperAdminUrl}/${userId}`, { headers });
  }
  getUserCreateInfo(userId: string, agentId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId)
      .set('agent-id', agentId);
    return this.http.get<UserCreateExtraInfo>(this.userCreateUrl, { headers });
  }
  createNewUser(user: User, userId: string, agentId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId)
      .set('agent-id', agentId);
    return this.http.post<User>(this.userCreateUrl, user, { headers });
  }

  editUser(user: User, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<User>(this.userUpdateUrl, user, { headers });
  }

  editSuperUser(user: User, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<User>(`${this.updateSuperUserUrl}/${userId}`, user, { headers });
  }

  deleteUser(userId: string, id: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.userDeleteUrl + '/' + id, { headers });
  }

  deleteUserFromAgent(userId: string, agentId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId)
      .set('agent-id', agentId);
    return this.http.delete<any>(this.userDeleteUrl, { headers });
  }

  getUserGroupList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<UserGroup[]>(this.getUserGroupListUrl, { headers });
  }
}
