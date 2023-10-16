import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'src/environments/environment';
import {HotelHistoryListSearch} from 'src/app/model/hotel/hotel-history/hotel-history-list-search';
import {BookingList} from 'src/app/model/hotel/hotel-history/booking-list';
import {BookingDetail} from 'src/app/model/hotel/hotel-history/booking-detail';
import {HotelHistoryList} from 'src/app/model/hotel/hotel-history/hotel-history-list-res';
import {CancellationReq} from 'src/app/model/thing-to-do/cancellation/cancel-req';
import {FlotravelBookingSearch} from '../../../model/auth/report/flotravel-booking-search';

@Injectable({
  providedIn: 'root'
})
export class FlotravelBookingService {
  private searchFlotravelBookingUrl = environment.baseUrl + 'admin/report/search';
  private getBookingDetailUrl = environment.baseUrl + 'admin/report';
  private exportFlotravelBookingUrl = environment.baseUrl + 'admin/report/export';

  constructor(private http: HttpClient) {
  }

  searchFlotravelBookings(data: FlotravelBookingSearch, page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.post<any>(this.searchFlotravelBookingUrl, data, {params});
  }
  fetchBookingDetail(bookingId: string) {
    return this.http.get<any>(`${this.getBookingDetailUrl}/${bookingId}`);
  }

  exportExcelFlotravelBooking(data: FlotravelBookingSearch) {
    const serviceName = data.serviceName;
    const provider = data.provider;
    const startDate = data.startDate;
    const endDate = data.endDate;
    window.open(`${this.exportFlotravelBookingUrl}?serviceName=${serviceName}&provider=${provider}&startDate=${startDate}&endDate=${endDate}`, '_blank');
  }
}
