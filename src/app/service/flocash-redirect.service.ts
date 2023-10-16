import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';
import { SearchAirport } from 'src/app/model/flight/search-airport';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { StateListRes } from '../model/common/country/state-list-res';
import { RedirectReq } from '../model/flocash/redirect/redirect-req';

@Injectable({
  providedIn: 'root'
})
export class FlocashRedirectService {

  flotravelRedirectUrl = environment.baseUrl + 'flocash/redirect';
  getStateUrl = environment.baseUrl + 'countries/state';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  flotravelRedirect(request: RedirectReq) {

    return this.http.post<any>(this.flotravelRedirectUrl, request);
  }

}
