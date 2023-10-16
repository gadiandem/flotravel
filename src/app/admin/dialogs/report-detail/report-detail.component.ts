import { Component, OnInit } from '@angular/core';
import {FlotravelBookingService} from '../../../service/admin/report/flotravel-booking.service';
import {Observable} from 'rxjs';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit {
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  bookingDetail$: Observable<any>;
  bookingId: string;
  constructor(private flotravelBookingService: FlotravelBookingService,
              public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.getProfile();
  }
  getProfile() {
    console.log(this.bookingId);
    this.bookingDetail$ = this.flotravelBookingService.fetchBookingDetail(this.bookingId);
  }

}
