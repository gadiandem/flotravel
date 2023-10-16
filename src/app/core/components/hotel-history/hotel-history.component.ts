import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { HotelBookingHistoryService } from 'src/app/service/hotel/hotel-history/hotel-history.service';
import { HotelHistoryListSearch } from 'src/app/model/hotel/hotel-history/hotel-history-list-search';
import { BookingList } from 'src/app/model/hotel/hotel-history/booking-list';
import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { HotelHistoryList } from 'src/app/model/hotel/hotel-history/hotel-history-list-res';
import { BookingHotelListUI } from 'src/app/model/hotel/hotel-history/booking-hotel-list.ui';
import { appConstant, defaultData } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { BookingDetail } from '../../../model/hotel/hotel-history/booking-detail';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { hotelConstant } from '../../../hotel/hotel.constant';

@Component({
  selector: 'app-hotel-history',
  templateUrl: './hotel-history.component.html',
  styleUrls: ['./hotel-history.component.css']
})
export class HotelHistoryComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public userBooking: BookingHotelListUI[];
  public agentBooking: BookingHotelListUI[];
  public mySelection: string[] = [];
  isCollapsedUser: boolean[];
  isCollapsedAgent: boolean[];

  currency: string;
  user: UserDetail;
  bookings: BookingList[];
  isLoading = false;
  searchForm: FormGroup;
  today: Date = new Date();
  bookingDetail: BookingDetail;
  formSubmitError: boolean;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  isCollapseRefund: boolean[];
  isCollapseNonRefund: boolean[];
  isCollapseCancelled: boolean[];
  isFreeCancel: boolean[];
  isPartialRefund: boolean[];

  isCollapseRefundAgent: boolean[];
  isCollapseNonRefundAgent: boolean[];
  isCollapseCancelledAgent: boolean[];
  isFreeCancelAgent: boolean[];
  isPartialRefundAgent: boolean[];
  defaultData: string;
  constructor(
    private bookingHistoryService: HotelBookingHistoryService,
    private router: Router,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private datePipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.initForm();
    this.formSubmitError = false;
    this.isCollapsedUser = [];
    this.isCollapsedAgent = [];
    this.userBooking = [];
    this.agentBooking = [];
    // user booking
    this.isCollapseRefund = [];
    this.isCollapseNonRefund = [];
    this.isCollapseCancelled = [];
    this.isFreeCancel = [];
    this.isPartialRefund = [];
    // agent booking for user
    this.isCollapseRefundAgent = [];
    this.isCollapseNonRefundAgent = [];
    this.isCollapseCancelledAgent = [];
    this.isFreeCancelAgent = [];
    this.isPartialRefundAgent = [];
    this.defaultData = defaultData.noImage;
    this.currency = sessionStorage.getItem(hotelConstant.CURRENCY) ||
      hotelConstant.METADATA_CURRENCY;
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    // this.user = JSON.parse(localStorage.getItem('userData'));
    if (this.user != null) {
      this.getHotelHistoryList();
    } else {
      sessionStorage.setItem('calbackUrl', '/hotel/history');
      this.router.navigate(['../../auth/login']);
    }
  }

  onImgError(event) {
    event.target.src = this.defaultData;
  }

  getFromDate(data: NgbDate) {
    this.fromDate = data;
  }

  getToDate(data: NgbDate) {
    this.toDate = data;
  }

  getHotelHistoryList() {
    const searchData = new HotelHistoryListSearch(this.user.id);
    this.isLoading = true;
    this.bookingHistoryService.hotelHistoryBookingList(searchData).subscribe(
      (res: HotelHistoryList) => {
        this.userBooking = res.bookingList;
        if (this.userBooking) {
          this.userBooking.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
            this.isCollapseCancelled[i] = true;
            this.isCollapseNonRefund[i] = true;
            this.isCollapseRefund[i] = true;
            this.isFreeCancel[i] = false;
            this.isPartialRefund[i] = false;
            if (data.currency != null) {
              this.currency = data.currency;
            }
          });
        }

        this.agentBooking = res.agentBookingList;
        if (this.agentBooking) {
          this.agentBooking.forEach((data, i) => {
            this.isCollapsedAgent[i] = true;
            this.isCollapseCancelledAgent[i] = true;
            this.isCollapseNonRefundAgent[i] = true;
            this.isCollapseRefundAgent[i] = true;
            this.isFreeCancelAgent[i] = false;
            this.isPartialRefundAgent[i] = false;
            if (data.currency != null) {
              this.currency = data.currency;
            }
          });
        }

        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }, e => {
        console.log(e);
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    );
  }

  viewDetail(bookingDetail: BookingList, index: number, type: string) {
    if (type === 'user') {
      this.isCollapsedUser[index] = !this.isCollapsedUser[index];
    } else {
      this.isCollapsedAgent[index] = !this.isCollapsedAgent[index];
    }
    this.bookingHistoryService.hotelHistoryBookingDetail(bookingDetail.id).subscribe(
      (res: BookingDetail) => {
        this.bookingDetail = res;
       // console.log(this.bookingDetail);
      }, e => {
        console.log(e);
      }
    );
  }

  deleteRecord(hotelItem: BookingHotelListUI) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.bookingHistoryService.deleteHotelRecord(hotelItem.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getHotelHistoryList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }

  getDays(total: string, perNight: string): number {
    return +total / (+perNight);
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  searchHistory() {
    const d: any = this.searchForm.value;
    const startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), 'yyyy-MM-dd');
    const searchData = new HotelHistoryListSearch(this.user.id, startDate, toDate);
    this.isLoading = true;
    this.bookingHistoryService.hotelHistoryBookingListByDate(searchData).subscribe(
      (res: HotelHistoryList) => {
        this.userBooking = res.bookingList;
        if (this.userBooking) {
          // this.processModelUI(this.userBooking);
          this.userBooking.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
          });
        }
        this.agentBooking = res.agentBookingList;
        if (this.agentBooking) {
          // this.processModelUI(this.agentBookingList);
          this.agentBooking.forEach((data, i) => {
            this.isCollapsedAgent[i] = true;
          });
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }, e => {
        console.log(e);
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    );
  }

  getFreeCancelTime(data: string) : Date {
    const freeCancelTime = new Date(data);
    freeCancelTime.setDate(freeCancelTime.getDate() - 1);
    return freeCancelTime;
  }

  viewCancelOption(bookingDetail: BookingHotelListUI, index: number, type: string) {
    if (type === 'user') {
      if (bookingDetail.status === 'CANCELLED') {
        this.isCollapseNonRefund[index] = true;
        this.isCollapseRefund[index] = true;
        this.isCollapsedUser[index] = true;
        this.isCollapseCancelled[index] = !this.isCollapseCancelled[index];
      } else {
        const today = new Date();
        const dateInCancelPolicies : number[] = [];
        bookingDetail.cancelPoliciesInfos.cancelPolicyInfos.forEach(data => {
          dateInCancelPolicies.push(new Date(data.cancelTime).setHours(0, 0, 0, 0));
        });
        const dateInCancelCondition: number[] = [];
        dateInCancelPolicies.forEach(data => {
          if (data > today.getTime()) {
            dateInCancelCondition.push(data);
          }
        });
        if (dateInCancelCondition.length > 0) {
          this.isCollapseNonRefund[index] = true;
          this.isCollapseRefund[index] = !this.isCollapseRefund[index];
          this.isCollapsedUser[index] = true;
          this.isCollapseCancelled[index] = true;
          if (dateInCancelPolicies[0] > today.getTime()) {
            this.isFreeCancel[index] = true;
          } else {
            this.isPartialRefund[index] = true;
          }
        } else {
          this.isCollapseNonRefund[index] = !this.isCollapseNonRefund[index];
          this.isCollapseRefund[index] = true;
          this.isCollapsedUser[index] = true;
          this.isCollapseCancelled[index] = true;
        }
      }
    } else {
      if (bookingDetail.status === 'CANCELLED') {
        this.isCollapseNonRefundAgent[index] = true;
        this.isCollapseRefundAgent[index] = true;
        this.isCollapsedAgent[index] = true;
        this.isCollapseCancelledAgent[index] = !this.isCollapseCancelledAgent[index];
      } else {
        const today = new Date();
        const dateInCancelPolicies : number[] = [];
        bookingDetail.cancelPoliciesInfos.cancelPolicyInfos.forEach(data => {
          dateInCancelPolicies.push(new Date(data.cancelTime).setHours(0, 0, 0, 0));
        });
        const dateInCancelCondition: number[] = [];
        dateInCancelPolicies.forEach(data => {
          if (data > today.getTime()) {
            dateInCancelCondition.push(data);
          }
        });
        if (dateInCancelCondition.length > 0) {
          this.isCollapseNonRefundAgent[index] = true;
          this.isCollapseRefundAgent[index] = !this.isCollapseRefundAgent[index];
          this.isCollapsedAgent[index] = true;
          this.isCollapseCancelledAgent[index] = true;
          if (dateInCancelPolicies[0] > today.getTime()) {
            this.isFreeCancelAgent[index] = true;
          } else {
            this.isPartialRefundAgent[index] = true;
          }
        } else {
          this.isCollapseNonRefundAgent[index] = !this.isCollapseNonRefundAgent[index];
          this.isCollapseRefundAgent[index] = true;
          this.isCollapsedAgent[index] = true;
          this.isCollapseCancelledAgent[index] = true;
        }
      }
    }
  }

  goToCancelBookingPage(bookingDetail: BookingHotelListUI) {
    sessionStorage.setItem(hotelConstant.BOOKING_HISTORY_DETAIL, JSON.stringify(bookingDetail));
    this.router.navigate(['/hotel/hotelCancelBooking', bookingDetail.id]);
  }
}
