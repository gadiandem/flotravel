import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { HotelHistoryListSearch } from 'src/app/model/hotel/hotel-history/hotel-history-list-search';
import { BookingList } from 'src/app/model/hotel/hotel-history/booking-list';
import { BookingDetail } from 'src/app/model/hotel/hotel-history/booking-detail';
import { HotelHistoryList } from 'src/app/model/hotel/hotel-history/hotel-history-list-res';
import { CancellationReq } from 'src/app/model/thing-to-do/cancellation/cancel-req';

@Injectable({
  providedIn: 'root'
})
export class HotelBookingHistoryService {

  private hisotyHotelListUrl = environment.baseUrl + 'hotel/history';
  private historyHotelListByDateUrl = environment.baseUrl + 'hotel/history/filterByDate'
  private hisotyHotelDetailUrl = environment.baseUrl + 'hotel/history';
  private hotelCancellationUrl = environment.baseUrl + 'hotel/cancellation';
  private hotelBookingDeleteUrl = environment.baseUrl + "hotel/deleteRecord";
  private historyHotelSimulatorUrl = environment.baseUrl + 'simulator/hotel/history';
  private historyHotelSimulatorByDateUrl = environment.baseUrl + 'simulator/hotel/history/filterByDate';


  constructor(private http: HttpClient) { }

   hotelHistorySimulatorBookingList(data: HotelHistoryListSearch) {
      return this.http.post<HotelHistoryList>(this.historyHotelSimulatorUrl, data);
   }

   hotelHistorySimulatorBookingListByDate(data: HotelHistoryListSearch) {
      return this.http.post<HotelHistoryList>(this.historyHotelSimulatorByDateUrl, data);
   }

  hotelHistoryBookingList(data: HotelHistoryListSearch) {

    return this.http.post<HotelHistoryList>(this.hisotyHotelListUrl, data);
  }

  hotelHistoryBookingListByDate(data: HotelHistoryListSearch) {
    return this.http.post<HotelHistoryList>(this.historyHotelListByDateUrl, data);
  }

  hotelHistoryBookingDetail(bookingId: string) {

    return this.http.get<BookingDetail>(this.hisotyHotelDetailUrl + '/' + bookingId);
  }

  hotelCancellation(id: string, statement: string) {
    const data: CancellationReq = new CancellationReq();
    data.id = id;
    data.statement = statement;
    return this.http.post<BookingDetail>(this.hotelCancellationUrl, data);
  }

  deleteHotelRecord(id: string) {
    return this.http.delete<any>(`${this.hotelBookingDeleteUrl}/${id}`);
  }

}
