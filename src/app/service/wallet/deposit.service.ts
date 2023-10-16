import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {DepositOrderRes} from 'src/app/model/wallet/deposit/deposit-order-res';
import {DepositReq} from 'src/app/model/wallet/deposit/deposit-req';
import {Params} from 'src/app/model/wallet/deposit/params';
import {appConstant} from '../../app.constant';
import {catchError, concatMap, delay, map, retryWhen, take} from 'rxjs/operators';
import {FlocashCreateOrderResponse} from '../../model/flocash/response/flocash-create-order.response';
import {of, throwError} from 'rxjs';
import {genericRetryStrategy} from '../utils/rx-utils';
import { FlocashOrderResponse } from 'src/app/model/flocash/response/flocash-order.response';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  depositUrl = environment.baseUrl + 'wallet/deposit';
  pollTransactionUrl = environment.baseUrl + 'flocash/order';
  captureTransactionUrl = environment.baseUrl + 'flocash/order/captures';

  constructor(
    private http: HttpClient,
  ) {
  }

  deposit(request: DepositReq, userId: string) {
    const headers = this.addUserIdHeader(userId);
    return this.http.post<DepositOrderRes>(
      this.depositUrl, request, {headers}
    );
  }

  pollTransactionStatus(traceNumber: string, userId: string) {
    const userDetail = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user-id': `${userId}`,
        'Authorization': 'Basic ' + btoa(`${userDetail.apiUser}:${userDetail.apiPassword}`)
      })
    };
    let i = 0;
    return this.http.get<FlocashOrderResponse>(
      `${this.pollTransactionUrl}/${traceNumber}`, httpOptions
    ).pipe(map(response => {
        console.log('number try' + i++);
        if (response.status != '0004') {
          return response;
        } else {
          throw response;
        }
      }), retryWhen(genericRetryStrategy()),
      catchError(error => of(error)));
  }

  captureTransaction(request: any, tracenumber: string) {
    return this.http.post<FlocashCreateOrderResponse>(
      `${this.depositUrl}/${tracenumber}`, request
    );
  }

  postRedirect(request: Params, url: string) {
    return this.http.post<any>(
      url, request
    );
  }

  addUserIdHeader(userId: string): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('user-id', `${userId}`);
    return headers;
  }
}
