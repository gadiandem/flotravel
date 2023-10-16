import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { SupplierSearchProvidersEnable } from 'src/app/model/common/supplier-search-enable/supplier-search-enable';
import { SupplierProviderSettingRequest } from 'src/app/model/common/supplier-search-enable/supplier-setting-enable-request';

export class SearchHotels {
  constructor(private keywords: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class SupplierSearchProviderService {

  private fetchFlightProviderEnableUrl = environment.baseUrl + 'supplier';
  private enableFlightProviderEnableUrl = environment.baseUrl + 'supplier/enable';

  constructor(private http: HttpClient, public datePipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  fetchSupplierSearchProvidersEnable() {
    return this.http.get<SupplierSearchProvidersEnable[]>(this.fetchFlightProviderEnableUrl);
  }

  enableSearchProviders(request: SupplierProviderSettingRequest) {
    return this.http.post<any>(this.enableFlightProviderEnableUrl, request);
  }
}
