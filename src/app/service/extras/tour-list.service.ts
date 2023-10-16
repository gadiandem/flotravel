import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { TourHistoryListReq } from 'src/app/model/thing-to-do/tour-history-list-req';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { TourHistoryListRes } from 'src/app/model/thing-to-do/tour-history-list-res';
import { CancellationReq } from 'src/app/model/thing-to-do/cancellation/cancel-req';
import { ExtrasHistoryDetailRS } from 'src/app/model/thing-to-do/extra-detail-history-res';

@Injectable({
  providedIn: 'root'
})
export class TourListService {

  private extrapackageListUrl = environment.baseUrl + 'admin/extraPackage';
  private extraDetailUrl = environment.baseUrl + 'extras/detail/';
  private extraPacakgeDetailUrl = environment.baseUrl + 'admin/extraPackage/detail/';
  private tourHistoryListUrl = environment.baseUrl + 'extras/history';
  private tourHistoryDetailUrl = environment.baseUrl + 'extras/history';
  private tourCancelBookingUrl = environment.baseUrl + 'extras/cancellation';

  constructor(private http: HttpClient) { }


  extraPackageList(data: TourShoppingRQ) {
    let requestBody: TourShoppingRQ = new TourShoppingRQ();
    if(data){
      requestBody = data;
    }
    return this.http.get<ExtrasPackage[]>(this.extrapackageListUrl);
  }

  tourDetail(tourId: string) {
    const data: TourShoppingRQ = new TourShoppingRQ();
    return this.http.post<ExtrasPackage>(this.extraDetailUrl + tourId, data);
  }
  getExtrasPackageDetail(extraPackageId: string) {
    const data: TourShoppingRQ = new TourShoppingRQ();
    return this.http.get<ExtrasPackage>(this.extraPacakgeDetailUrl + extraPackageId);
  }
  tourlHistoryBookingList(data: TourHistoryListReq) {

    return this.http.post<TourHistoryListRes>(this.tourHistoryListUrl, data);
  }

  tourlHistoryBookingDetail(tourId: string) {

    return this.http.get<ExtrasHistoryDetailRS>(this.tourHistoryDetailUrl + '/' + tourId);
  }

  tourCancelBooking(tourId: string, statement: string) {
    const data: CancellationReq = new CancellationReq();
    data.id = tourId;
    data.statement = statement;
    return this.http.post<PaymentTour>(this.tourCancelBookingUrl, data);
  }
}
