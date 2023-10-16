import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FlotravelProvider } from 'src/app/model/auth/provider/flotravel-provider';


@Injectable({
  providedIn: 'root'
})
export class FlotravelProviderService {
  private providerListUrl = environment.baseUrl + 'admin/provider';
  private providerCreateUrl = environment.baseUrl + 'admin/provider';
  private providerUpdateUrl = environment.baseUrl + 'admin/provider';
  private providerDeleteUrl = environment.baseUrl + 'admin/provider';

  constructor(private http: HttpClient) {
  }
  getProviders(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FlotravelProvider[]>(this.providerListUrl + '/list', { headers });
  }

  getProviderList(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FlotravelProvider[]>(this.providerListUrl, { headers });
  }

  createProvider(provider: FlotravelProvider, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<FlotravelProvider>(this.providerCreateUrl, provider, { headers });
  }

  editProvider(provider: FlotravelProvider, userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.put<FlotravelProvider>(`${this.providerUpdateUrl}/${provider.id}`, provider, { headers });
  }


  deleteProvider(userId: string, id: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.delete<any>(`${this.providerDeleteUrl}/${id}`, { headers });
  }

}
