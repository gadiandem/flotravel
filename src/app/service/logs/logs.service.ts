import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FlotravelLogs } from 'src/app/model/logs/flotravel-logs';
import { FlotravelLogsReq } from 'src/app/model/logs/flotravel-logs-req';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private checkLogsUrl = environment.baseUrl + 'database/logs';
  private checkLogsByIdUrl = environment.baseUrl + 'database/logs';
  userId: string;

  constructor(private http: HttpClient) {
  }

  getInfo(userId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FlotravelLogs[]>(this.checkLogsUrl, { headers });
  }

  getLogDetail(userId: string , logId: string) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.get<FlotravelLogs>(this.checkLogsByIdUrl + '/' + logId, { headers });
  }

  getSelectedLog(userId: string , data: FlotravelLogsReq ) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<FlotravelLogs[]>(this.checkLogsUrl, data , { headers });
  }
  getUserLogs(userId: string , username: string,data: FlotravelLogsReq ) {
    const headers = new HttpHeaders()
      .set('user-id', userId);
    return this.http.post<FlotravelLogs[]>(this.checkLogsUrl + '/' + username ,data, { headers });
  }
  addHeader(userId: string, parentId?: string): HttpHeaders {
    console.log('userId: ' + userId);
    let headers = new HttpHeaders();
    if (parentId == undefined) {
      headers = headers.set('user-id', userId);
    }
    return headers;
  }


  
}
