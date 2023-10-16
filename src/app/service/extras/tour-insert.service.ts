import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { ScheduleListReq } from 'src/app/model/thing-to-do/insert-tour/schedule-list.-req';
import { ExtraPackageAvailability } from 'src/app/model/thing-to-do/insert-tour/extra-package-availability';
import { ExtraDetailAvailability } from 'src/app/model/thing-to-do/insert-tour/extra-detail-availability';
import { ExtraPackageAvailabilityRQ } from 'src/app/model/thing-to-do/insert-tour/extra-package-availability-add-request';

@Injectable({
  providedIn: 'root'
})
export class TourInsertService {

  private addExtraPackageUrl = environment.baseUrl + 'admin/extraPackage';
  private updateExtraPackageUrl = environment.baseUrl + 'admin/extraPackage';
  private extraDetailListUrl = environment.baseUrl + 'admin/extraDetail';
  private getExtraDetailUrl = environment.baseUrl + 'admin/extraDetail/individual';
  private extraDetailEditlUrl = environment.baseUrl + 'admin/extraDetail';
  private extraDetailAddUrl = environment.baseUrl + 'admin/extraDetail';
  private extraPackageAvailabilityUrl = environment.baseUrl + 'extras/packageAvailability/';
  private extraDetailAvailabilityUrl = environment.baseUrl + 'extras/extraDetailAvailability/';
  private addExtraPackageAvailabilityUrl = environment.baseUrl + 'extras/packageAvailability';

  constructor(private http: HttpClient) { }


  addExtraPackage(data: ExtrasPackage) {

    return this.http.post<ExtrasPackage>(this.addExtraPackageUrl, data);
  }
  updateExtraPackage(data: ExtrasPackage, extrapackageId: string) {

    return this.http.put<ExtrasPackage>(this.updateExtraPackageUrl + '/' + extrapackageId, data);
  }
  extraDetailList(extraPackageId: string) {

    return this.http.get<Schedule[]>(`${this.extraDetailListUrl}/${extraPackageId}`);
  }

  extraDetailIndividual(scheduleId: string) {

    return this.http.get<Schedule>(`${this.getExtraDetailUrl}/${scheduleId}`);
  }

  extraDetailEdit(schedule: Schedule, extraDetailId: string) {

    return this.http.put<Schedule>(this.extraDetailEditlUrl + '/' + extraDetailId, schedule);
  }
  extraDetailAdd(schedule: Schedule) {

    return this.http.post<Schedule>(this.extraDetailAddUrl, schedule);
  }

  getExtraPackageAvailability(extraPackageId: string) {

    return this.http.get<ExtraPackageAvailability[]>(this.extraPackageAvailabilityUrl + extraPackageId);
  }
  getExtraDetailAvailability(extraDetailAvailabilityId: string) {

    return this.http.get<ExtraDetailAvailability>(this.extraDetailAvailabilityUrl + extraDetailAvailabilityId);
  }

  deleteExtraPackageAvailability(extraPackageId: string) {

    return this.http.delete<ExtraDetailAvailability>(this.extraPackageAvailabilityUrl + extraPackageId);
  }
  addExtraPackageAvailability(extraPackageAvailabilityRQ: ExtraPackageAvailabilityRQ) {

    return this.http.post<ExtraDetailAvailability>(this.addExtraPackageAvailabilityUrl , extraPackageAvailabilityRQ);
  }
}
