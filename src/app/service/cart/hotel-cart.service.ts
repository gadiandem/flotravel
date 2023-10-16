import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { CheckRoomReq } from 'src/app/model/hotel/hotel-cart/checkRoomReq';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import { AvailablePropertyReq } from 'src/app/model/hotel/hotel-cart/available-property-req';

@Injectable({
  providedIn: 'root'
})
export class HotelCartService {

  private searchHotelUrl = environment.baseUrl + 'hotel/availableProperty';

  constructor(private http: HttpClient) { }


  checkRoomAvailability(data: CheckRoomReq) {
    const reqForm = new AvailablePropertyReq();
    reqForm.selectedRoom = data;
    return this.http.post<AvailablePropertyRes>(this.searchHotelUrl, reqForm);
  }
}
