import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pageable} from '../../../model/common/pagination/pageable';
import { HotelInfoSimulator } from '../../../model/hotel/simulator/hotel-info-simulator';
import { PaginationModel } from '../../../model/common/pagination/pagination-model';
import { HotelRoomSimulator } from '../../../model/hotel/simulator/hotel-room-simulator';
import { map } from 'rxjs/operators';
import { HotelShoppingReq } from '../../../model/dashboard/hotel/hotel-shopping-req';
import { Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from '../../../model/auth/user/user-detail';
import { HotelShoppingSimulatorResponse } from '../../../model/hotel/simulator/hotel-shopping-simulator-response';
import { HotelDetailReq } from '../../../model/hotel/hotel-detail/hotel-detail-req';
import { HotelDetailSimulatorResponse } from '../../../model/hotel/simulator/hotel-detail-simulator-response';
import {HotelPaymentRequest} from '../../../model/hotel/hotel-payment/hotelPaymentRequest';
import {PaymentRes} from '../../../model/hotel/hotel-payment/payment.res';

@Injectable({
  providedIn: 'root'
})
export class HotelSimulatorService {
  private hotelInfoSimulatorUrl = environment.baseUrl + 'admin/simulator/hotel';
  private hotelRoomSimulatorUrl = environment.baseUrl + 'admin/simulator/hotelRoom';
  private hotelShoppingSimulatorUrl = environment.baseUrl + 'simulator/hotel/Shopping';
  private hotelOfferPriceSimulatorUrl = environment.baseUrl + 'simulator/hotel/offerDetail';
  private hotelPaymentSimulatorUrl = environment.baseUrl + 'simulator/hotel/payment'
  user: UserDetail;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  getHotelInfoSimulatorList(pageable: Pageable) {
    const params = new HttpParams()
      .set("page", pageable.page.toString())
      .set("pageSize", pageable.pageSize.toString());
    return this.http.get<PaginationModel<HotelInfoSimulator>>(this.hotelInfoSimulatorUrl, {params});
  }

  getHotelSimulatorListByName(hotelName: string) {
    const params = new HttpParams()
      .set("page", "0")
      .set("pageSize", "10")
      .set("hotelName", hotelName);
    return this.http.get<PaginationModel<HotelInfoSimulator>>(`${this.hotelInfoSimulatorUrl}/search`, {params}).pipe(map(data => [...data.items]));
  }

  getHotelInfoSimulatorById(hotelInfoSimulatorId: string) {
    return this.http.get<HotelInfoSimulator>(`${this.hotelInfoSimulatorUrl}/${hotelInfoSimulatorId}`);
  }

  createHotelInfoSimulator(hotelInfo: HotelInfoSimulator) {
    return this.http.post<HotelInfoSimulator>(this.hotelInfoSimulatorUrl, hotelInfo);
  }

  updateHotelInfoSimulator(hotelInfo: HotelInfoSimulator, hotelInfoSimulatorId: string) {
    return this.http.put<HotelInfoSimulator>(`${this.hotelInfoSimulatorUrl}/${hotelInfoSimulatorId}`, hotelInfo);
  }

  deleteHotelInfoSimulator(hotelInfoSimulatorId: string) {
    return this.http.delete<any>(`${this.hotelInfoSimulatorUrl}/${hotelInfoSimulatorId}`);
  }

  getAllHotelRoomByHotel(hotelSimulatorId: string, pageable: Pageable) {
    const headers = new HttpHeaders().set("hotel-simulator-id", hotelSimulatorId);
    const params = new HttpParams()
      .set("page", pageable.page.toString())
      .set("pageSize", pageable.pageSize.toString());
    return this.http.get<PaginationModel<HotelRoomSimulator>>(this.hotelRoomSimulatorUrl, {headers, params});
  }

  getHotelRoomSimulatorById(hotelRoomSimulatorId: string) {
    return this.http.get<HotelRoomSimulator>(`${this.hotelRoomSimulatorUrl}/${hotelRoomSimulatorId}`);
  }

  createHotelRoomSimulator(hotelRoomSimulator: HotelRoomSimulator) {
    return this.http.post<HotelRoomSimulator>(this.hotelRoomSimulatorUrl, hotelRoomSimulator);
  }

  updateHotelRoomSimulator(hotelRoomSimulator: HotelRoomSimulator, hotelRoomId: string) {
    return this.http.put<HotelRoomSimulator>(`${this.hotelRoomSimulatorUrl}/${hotelRoomId}`, hotelRoomSimulator);
  }

  deleteHotelRoomSimulator(hotelRoomSimulatorId: string) {
    return this.http.delete<any>(`${this.hotelRoomSimulatorUrl}/${hotelRoomSimulatorId}`);
  }

  shoppingHotelSimulator(hotelShoppingReq: HotelShoppingReq) {
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    const headers = new HttpHeaders();
    if (this.user) {
      headers.set('user-id', this.user.id);
    }
    return this.http.post<HotelShoppingSimulatorResponse>(this.hotelShoppingSimulatorUrl, hotelShoppingReq, {headers});
  }

  offerPriceSimulator(hotelDetailReq: HotelDetailReq) {
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    const headers = new HttpHeaders();
    if (this.user) {
      headers.set('user-id', this.user.id);
    }
    return this.http.post<HotelDetailSimulatorResponse>(this.hotelOfferPriceSimulatorUrl, hotelDetailReq, {headers});
  }

  paymentAndBookingHotelSimulator(hotelPaymentReq: HotelPaymentRequest) {
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    const headers = new HttpHeaders();
    if (this.user) {
      headers.set('user-id', this.user.id);
    }
    return this.http.post<PaymentRes>(this.hotelPaymentSimulatorUrl, hotelPaymentReq, {headers});
  }
}
