import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { FLightSearchProvidersEnable } from 'src/app/model/common/flight-search-enable/flight-search-enable';
import { FLightProviderSettingRequest } from 'src/app/model/common/flight-search-enable/flight-setting-enable-request';

export class SearchHotels {
  constructor(private keywords: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class FlightSearchProviderService {

  private fetchFlightProviderEnableUrl = environment.baseUrl + 'flight/supplier';
  private enableFlightProviderEnableUrl = environment.baseUrl + 'flight/supplier/enable';
  private agentSettingListUrl = environment.baseUrl + 'supplier/agent-setting';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  fetchFLightSearchProvidersEnable() {
    return this.http.get<FLightSearchProvidersEnable[]>(this.fetchFlightProviderEnableUrl);
  }

  enableFLightSearchProviders(request: FLightProviderSettingRequest) {
    return this.http.post<any>(this.enableFlightProviderEnableUrl, request);
  }
  fetchAgentFLightSettings(page: number, pageSize: number, searchText?: string) {
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
    return this.http.get<any>(this.agentSettingListUrl, { params });
  }
  fetchAgentFLightSettingDetail(agentId: string) {
    return this.http.get<any[]>(`${this.agentSettingListUrl}/${agentId}`);
  }

  updateAgentFLightSetting(agentId: string, data: any) {
    return this.http.put<any[]>(`${this.agentSettingListUrl}/${agentId}`, data);
  }
}
