import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';
import { SearchAirport } from 'src/app/model/flight/search-airport';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { StateListRes } from '../model/common/country/state-list-res';
import { Airline } from '../model/flight/airline/airline';

@Injectable({
  providedIn: 'root'
})
export class SearchCountryService {

  datePipeEn: DatePipe = new DatePipe('en-US');
  searchCountryUrl = environment.baseUrl + 'countries/search';
  getStateUrl = environment.baseUrl + 'countries/state';
  getAirlinesUrl = environment.baseUrl + 'ndc/airlines';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  searchCountry(searchTerm: string, pageSize?: string,page?: string) {
    const params = new HttpParams()
      .set("keywords", searchTerm)
      .set("pageSize", (pageSize || '15'))
      .set("page", (page || '0'));

    return this.http.get<CountryRes[]>(this.searchCountryUrl, {params});
  }

  getStatus(country: string, pageSize?: string,page?: string) {
    const params = new HttpParams()
      .set("country", country)
      .set("pageSize", (pageSize || '15'))
      .set("page", (page || '0'));

    return this.http.get<StateListRes>(this.getStateUrl, {params});
  }

  getAirline() {
    return this.http.get<Airline[]>(this.getAirlinesUrl);
  }

}
