import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { HistoryOrderPackageListReq } from 'src/app/model/packages/consumer/history-package-order-list-req';
import { HistoryOrderPackageListRes } from 'src/app/model/packages/consumer/history-package-order-list-res';
import { HistoryOrderPackageDetailReq } from 'src/app/model/packages/consumer/history-package-order-detail-req';
import { HistoryOrderPackageDetailRes } from 'src/app/model/packages/consumer/history-package-order-detail-res';
import { CancellationReq } from 'src/app/model/thing-to-do/cancellation/cancel-req';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { GetOrderPackageUpdate } from 'src/app/model/packages/consumer/get-order-update';
import { FlocashOrderResponse } from 'src/app/model/flocash/response/flocash-order.response';
import { RefundPackageOrderUpdate } from 'src/app/model/packages/consumer/refund-order-package-update';

@Injectable({
  providedIn: 'root'
})
export class SpecialPackagesHistoryService {

  private packageOrderHistoryListUrl = environment.baseUrl + 'specialPackages/historyBooking';
  private packageOrderHistoryDetailUrl = environment.baseUrl + 'specialPackages/historyDetail';
  private historyPackageOrderListByDateUrl = environment.baseUrl + 'specialPackages/historyBooking/filterByDate';
  private packageOrderCancelUrl = environment.baseUrl + 'specialPackages/cancellation';
  private packageDeleteUrl = environment.baseUrl + 'specialPackages/delete';
  
  private getPackageOrderUpdateUrl = environment.baseUrl + 'flocash/order';

  constructor(private http: HttpClient) { }


  orderPackageList(userId: string) {
    let requestBody: HistoryOrderPackageListReq = new HistoryOrderPackageListReq();
    requestBody.userId = userId;

    return this.http.post<HistoryOrderPackageListRes>(this.packageOrderHistoryListUrl, requestBody);
  }
  orderPackageListByDate(req: HistoryOrderPackageListReq) {
    return this.http.post<HistoryOrderPackageListRes>(this.historyPackageOrderListByDateUrl, req);
  }
  orderPackageDetail(orderPackagesId: string) {
    const data: HistoryOrderPackageDetailReq = new HistoryOrderPackageDetailReq();
    data.packageOrderId = orderPackagesId;
    return this.http.post<HistoryOrderPackageDetailRes>(this.packageOrderHistoryDetailUrl, data);
  }

  packagesCancelBooking(packageId: string, statement: string) {
    const data: CancellationReq = new CancellationReq();
    data.id = packageId;
    data.statement = statement;
    // header
    const headers = new HttpHeaders()
    .set('environment', environment.paymentEnvironment);
    return this.http.post<OrderPackageCreateRes>(this.packageOrderCancelUrl, data, { headers });
  }

  getPackageOrderRefund(traceNumber: string, userId: string) {
    const headers = new HttpHeaders()
    .set('user-id', userId)
    .set('environment', environment.paymentEnvironment);
    return this.http.get<FlocashOrderResponse>(`${this.getPackageOrderUpdateUrl}/${traceNumber}`, { headers });
  }

  updatePackageOrderRefund(traceNumber: string, userId: string, packageOrderId: string) {
    const data = new RefundPackageOrderUpdate();
    data.packageOrderId = packageOrderId;
    const headers = new HttpHeaders()
    .set('user-id', userId)
    .set('environment', environment.paymentEnvironment);
    return this.http.put<FlocashOrderResponse>(`${this.getPackageOrderUpdateUrl}/${traceNumber}`, data, { headers });
  }


  deletePackageRecord(id: string) {
    return this.http.delete<any>(`${this.packageDeleteUrl}/${id}`);
  }
}
