import { Component, OnInit } from '@angular/core';
import { BookingDetail} from 'src/app/model/hotel/hotel-history/booking-detail';
import { BookingList} from 'src/app/model/hotel/hotel-history/booking-list';
import { UserDetail} from 'src/app/model/auth/user/user-detail';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotelBookingHistoryService } from 'src/app/service/hotel/hotel-history/hotel-history.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import {appConstant, appDefaultData} from 'src/app/app.constant';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hotel-cancel-booking',
  templateUrl: './hotel-cancel-booking.component.html',
  styleUrls: ['./hotel-cancel-booking.component.css']
})
export class HotelCancelBookingComponent implements OnInit {
  bookingId: string;
  bookingDetail: BookingDetail;
  selectedBookingDetail: BookingList;
  isLoading = false;
  user: UserDetail;
  startRate = 1;
  currency: string;

  error: any;

  cancellationForm: FormGroup;
  formSubmitError: boolean;
  isCollapsed: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private bookingHistoryService: HotelBookingHistoryService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private _location: Location,
  ){}

  ngOnInit() {
    this.initForm();
    this.isCollapsed = true;

    this.bookingDetail = new BookingDetail();
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.selectedBookingDetail = JSON.parse(sessionStorage.getItem(hotelConstant.BOOKING_HISTORY_DETAIL));
    if (this.selectedBookingDetail != null) {
      this.currency = this.selectedBookingDetail.currency;
    } else {
      this.currency = appDefaultData.DEFAULT_CURRENCY;
    }
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['orderId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.bookingHistoryService.hotelHistoryBookingDetail(this.bookingId).subscribe(
          (res: BookingDetail) => {
            this.bookingDetail = res;
            this.startRate = res.hotelInfo.starRating;
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

  initForm() {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }

  showStatementCancel() {
    this.isCollapsed = !this.isCollapsed;
  }


  getFreeCancelTime(data: string) : Date {
    let freeCancelTime = new Date(data);
    freeCancelTime.setDate(freeCancelTime.getDate() - 1);
    return freeCancelTime;
  }

  cancelBooking() {
    if (this.cancellationForm.valid) {
      const d: any = this.cancellationForm.value;
      const reason: string = d.reason;
      this.bookingHistoryService.hotelCancellation(this.bookingId, reason).subscribe(
        (res: BookingDetail) => {
          console.log('res: ' + JSON.stringify(res));
          this.alertify.success('Cancel booking successful!');
        }, e => {
          this.error = e.error;
          this.alertify.error(`There are some error: ${e.error.code} - ${e.error.message}`);
        }
      );
      this._location.back();
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
