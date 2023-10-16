import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { FLightSearchProvidersEnable } from 'src/app/model/common/flight-search-enable/flight-search-enable';
import {GeoIP} from '../../model/common/GeoIP';

export class SearchHotels {
  constructor(private keywords: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  datePipeEn: DatePipe = new DatePipe('en-US');
  private destinationUrl = environment.baseUrl + 'hotel/destinations?keywords=';
  private fetchCountriesUrl = environment.baseUrl + 'countries';
  // private destinationUrl = environment.baseUrl + 'hotel/destinations/elasticsearch?keywords=';
  // private fetchCurrenciesUrl = environment.baseUrl + 'dashboard/currencies';
  private fetchCurrenciesUrl = environment.baseUrl + 'currencies';
  private fetchFlightProviderEnableUrl = environment.baseUrl + 'flight/supplier';
  private fetchLocationCurrentUrl = environment.baseUrl + 'currentLocation';
  private getDestinationByCodeUrl = environment.baseUrl + 'hotel/destinations';
  private packageShoppingForImageUrl = environment.baseUrl + 'packages/shopping/forImage';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }


  getDestination(searchTerm: string) {
    if (searchTerm === '') {
      return of([]);
    }
    const data = new SearchHotels(searchTerm);
    return this.http.get<DestinationRes[]>(this.destinationUrl + searchTerm);
  }

  fetchCurrencies() {
    return this.http.get<CurrencyNewRes>(this.fetchCurrenciesUrl);
  }

  fetchCountries() {
    return this.http.get<CountryRes>(this.fetchCountriesUrl);
  }

  fetchFLightSearchProvidersEnable() {
    return this.http.get<FLightSearchProvidersEnable[]>(this.fetchFlightProviderEnableUrl);
  }
  getLocationCurrent() {
    const headers = new HttpHeaders();
    return this.http.get<GeoIP>(this.fetchLocationCurrentUrl, {headers});
  }
}
