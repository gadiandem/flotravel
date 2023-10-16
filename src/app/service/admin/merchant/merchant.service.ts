import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from 'src/app/model/auth/user/user';
import { UserCreateExtraInfo } from 'src/app/model/auth/user/user-create-extra-info';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserListRes } from 'src/app/model/auth/user/userListRes';
import { MerchantModel } from 'src/app/model/auth/merchant/merchant-model';


@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private merchantBaseUrl = environment.baseUrl + 'admin/merchants';
  private merchantInitialUrl = environment.baseUrl + 'admin/merchants/initialize';

  constructor(private http: HttpClient) {
  }

  getMerchantList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<MerchantModel[]>(this.merchantBaseUrl, { headers });
  }

  createMerchant(merchant: MerchantModel, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<MerchantModel>(this.merchantBaseUrl, merchant, { headers });
  }

  getMerchantDetail(userId: string, merchantId: string) {
    const headers = new HttpHeaders().set('user-id', userId);
    return this.http.get<MerchantModel>(`${this.merchantBaseUrl}/${merchantId}`, { headers });
  }

  editMerchant(merchant: MerchantModel, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<MerchantModel>(`${this.merchantBaseUrl}/${merchant.id}`, merchant, { headers });
  }


  deleteMerchant(merchantId: string, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(this.merchantBaseUrl + '/' + merchantId, { headers });
  }

  initialMerchant(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<any>(this.merchantInitialUrl, { headers });
  }

}
