import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import { FlightHistoryReq } from 'src/app/model/flight/history/flight-history-req';
import { FlightHistory } from 'src/app/model/flight/history/flight-history-res';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CancellationReq } from 'src/app/model/thing-to-do/cancellation/cancel-req';
import { HoldFlightResponse } from 'src/app/model/flight/hold-booking';
import { HoldFlightList } from 'src/app/model/flight/hold-booking-list';
import { PartialFlightList } from 'src/app/model/flight/partial-flight-list';
import { PartialFlightReq } from 'src/app/model/flight/partial-flight-req';

@Injectable({
  providedIn: 'root'
})
export class FlightBookingHistoryService {

  private historyHahnAirFlightListByDateUrl = environment.baseUrl + 'ndc/history/filterByDate';
  private histoyHahnAirFlightListUrl = environment.baseUrl + 'ndc/history';
  private histoyAeroFlightListUrl = environment.baseUrl + 'aero/historyList';
  private hisotyFlightDetailUrl = environment.baseUrl + 'ndc/history';
  private deleteRecordUrl = environment.baseUrl + 'ndc/delete';
  private holdFlightDetailUrl = environment.baseUrl + 'hold/bookings';
  private deleteSavedFlightUrl = environment.baseUrl + 'holdbooking/cancellation';
  private flightOrderHahnAirCancelUrl = environment.baseUrl + 'ndc/cancellation';
  private flightOrderAeroCancelUrl = environment.baseUrl + 'aero/cancellation';
  private flightOrderQRCancelUrl = environment.baseUrl + 'qr/cancellation';
  private flightOrderFloAirCancelUrl = environment.baseUrl + 'floAir/cancellation';
  private historyFlightListByDateUrl = environment.baseUrl + 'flight/history/filterByDate';
  private histoyFlightListUrl = environment.baseUrl + 'flight/history';
  private bookingHoldETFlightListUrl = environment.baseUrl + 'hold/bookings';
  private partialFlightRecordListUrl = environment.baseUrl + 'records/partialFlight';
  private deletePartialFlightUrl = environment.baseUrl + 'flight/partialFlight/cancellation';
  private editPartialFlightRecordUrl = environment.baseUrl + 'flight/partial-order/update';

  constructor(private http: HttpClient) { }


  flightHistoryBookingList(userId: string) {
    const data = new FlightHistoryReq();
    data.userId = userId;
    return this.http.post<FlightHistory>(this.histoyHahnAirFlightListUrl, data);
    // return forkJoin(this.http.post<FlightHistory>(this.histoyHahnAirFlightListUrl, data),
    // this.http.post<FlightHistory>(this.histoyAeroFlightListUrl, data)).pipe(
    //   map(data => data.reduce((previous, current, index, array) => this.reducer(previous, current, index, array), []))
    // )
  }
  partialFlightBookingList(userId: string) {
    const data = new FlightHistoryReq();
    data.userId = userId;
    return this.http.post<PartialFlightList>(this.partialFlightRecordListUrl, data);
   
  }
  editPartialFlightBookingList(data: PartialFlightReq) {
    return this.http.post<FlocashPaymentFlight>(this.editPartialFlightRecordUrl, data);
   
  }

  flightHoldBookingList(userId: string) {
    const data = new FlightHistoryReq();
    data.userId = userId;
    return this.http.post<HoldFlightList>(this.bookingHoldETFlightListUrl, data);
  
  }
  deletePartialFlightBooking(bookingId: string) {
    return this.http.delete<any>(`${this.deletePartialFlightUrl}/${bookingId}`);
  }
  deleteBookingHoldFlight(bookingId: string) {
    return this.http.delete<any>(`${this.deleteSavedFlightUrl}/${bookingId}`);
  }
  flightHoldBookingDetail(bookingId: string) {
    return this.http.get<HoldFlightResponse>(this.holdFlightDetailUrl + '/' + bookingId);
  }
  flightHistoryBookingListByDate(req: FlightHistoryReq) {
    return this.http.post<FlightHistory>(this.historyHahnAirFlightListByDateUrl, req);
  }

  allFlightHistoryBookingList(userId: string) {
    const data = new FlightHistoryReq();
    data.userId = userId;
    return this.http.post<FlightHistory>(this.histoyFlightListUrl, data);
  }

  allFlightHistoryBookingListByDate(req: FlightHistoryReq) {
    return this.http.post<FlightHistory>(this.historyFlightListByDateUrl, req);
  }

  reducer(previous: FlightHistory[], current: FlightHistory, index: number, array = []) {
    if(previous.length > 0){
      previous[0].bookingList = current.bookingList;
      previous[0].agentBookingList = current.agentBookingList;
    } else {
      previous[0] = current;
    }
    return previous;
  }

  flightHistoryBookingDetail(bookingId: string) {

    return this.http.get<FlocashPaymentFlight>(this.hisotyFlightDetailUrl + '/' + bookingId);
  }

  deleteBookingRecord(id: string) {
    return this.http.delete<any>(`${this.deleteRecordUrl}/${id}`);
  }

 flightCancelBooking(flight: FlocashPaymentFlight, flightId: string, statement: string) {
     let cancelEndpoint: string = '';
     if(flight.item_name =='Booking Hahn air') {
       cancelEndpoint = this.flightOrderHahnAirCancelUrl;
     } else if(flight.serviceName =='AERO_CRS') {
       cancelEndpoint = this.flightOrderAeroCancelUrl;
     } else if(flight.serviceName =='FloAir') {
          cancelEndpoint = this.flightOrderFloAirCancelUrl;
     } else if(flight.serviceName =='QR') {
      cancelEndpoint = this.flightOrderQRCancelUrl;
    }  
    const data: CancellationReq = new CancellationReq();
    data.id = flightId;
    data.statement = statement;

    const headers = new HttpHeaders()
    .set('environment', environment.paymentEnvironment);
   return this.http.post<FlocashPaymentFlight>(cancelEndpoint, data, { headers });
   
  }
}
