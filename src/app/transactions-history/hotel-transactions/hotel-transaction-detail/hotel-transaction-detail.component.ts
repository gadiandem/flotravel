import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from "rxjs/operators";
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { BookingDetail } from 'src/app/model/hotel/hotel-history/booking-detail';
import { HotelBookingHistoryService } from 'src/app/service/hotel/hotel-history/hotel-history.service';
import { BookingList } from 'src/app/model/hotel/hotel-history/booking-list';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CancelDialogComponent } from 'src/app/hotel/cancel-dialog/cancel-dialog.component';
import { appConstant } from 'src/app/app.constant';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { User } from 'src/app/model/auth/user/user';

@Component({
  selector: 'app-hotel-transaction-detail',
  templateUrl: './hotel-transaction-detail.component.html',
  styleUrls: ['./hotel-transaction-detail.component.css']
})
export class HotelHistoryDetailComponent implements OnInit {

  bookingId: string;
  bookingDetail: BookingDetail;
  selectedBookingDetail: BookingList;
  isLoading = false;
  user: UserDetail;
  selectedUser: User;
  startRate = 1;
  currency: string;
  bsModalRef: BsModalRef;

  error: any;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private bookingHistoryService: HotelBookingHistoryService,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.bookingDetail = new BookingDetail();
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.selectedBookingDetail = JSON.parse(sessionStorage.getItem(hotelConstant.BOOKING_HISTORY_DETAIL));
    if (this.selectedBookingDetail != null) {
      this.currency = this.selectedBookingDetail.currency;
    } else {
      this.currency = 'USD';
    }
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['bookingId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.bookingHistoryService.hotelHistoryBookingDetail(this.bookingId).subscribe(
          (res: BookingDetail) => {
            this.bookingDetail = res;
            this.startRate = res.hotelInfo.starRating;
           // console.log(this.bookingDetail);
            // this.currency = res.currency;
            this.isLoading = false;
          }, e => {
            this.isLoading = false;
          }
        );
      } else {
        this.router.navigate(['/login']);
      }

    });
  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(CancelDialogComponent);
    this.bsModalRef.content.event.subscribe(res => {
      console.log('reason: ' + res);
      this.cancelBooking(res);
    });
  }

  cancelBooking(reason: string) {
    this.bookingHistoryService.hotelCancellation(this.bookingId, reason).subscribe(
      (res: BookingDetail) => {
        console.log('res: ' + JSON.stringify(res));
        this.alertify.success('Cancel booking successful!');
        this.router.navigate(['/hotel/history']);
      }, e => {
        this.error = e.error;
        this.alertify.error(`an error occurred: ${e.error.code} - ${e.error.message}`);
      }
    );
  }
}
