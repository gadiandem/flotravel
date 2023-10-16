import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchHotelService {

  datePipeEn: DatePipe = new DatePipe('en-US');
  private searchHotelUrl = environment.baseUrl + 'hotels/hotelList';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

}
