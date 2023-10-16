import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { UserDetail } from '../../../../model/auth/user/user-detail';
import { FormControl, FormGroup } from '@angular/forms';
import { BookingDetail } from '../../../../model/hotel/hotel-history/booking-detail';
import { PaginationInstance } from 'ngx-pagination';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookingHotelListUI } from '../../../../model/hotel/hotel-history/booking-hotel-list.ui';
import { HotelBookingHistoryService } from '../../../../service/hotel/hotel-history/hotel-history.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../../../../service/alertify.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { DatePipe } from '@angular/common';
import { appConstant } from '../../../../app.constant';
import { HotelHistoryListSearch } from '../../../../model/hotel/hotel-history/hotel-history-list-search';
import { HotelHistoryList } from '../../../../model/hotel/hotel-history/hotel-history-list-res';
import { BookingList } from '../../../../model/hotel/hotel-history/booking-list';

@Component({
  selector: 'app-hotel-history-simulator',
  templateUrl: './hotel-history-simulator.component.html',
  styleUrls: ['./hotel-history-simulator.component.css']
})
export class HotelHistorySimulatorComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public mySelection: string[] = [];

  currency: string;
  user: UserDetail;
  isLoading = false;
  searchForm: FormGroup;
  today: Date = new Date();
  bookingDetail: BookingDetail;
  formSubmitError: boolean;
  public config: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  public userBooking: BookingHotelListUI[];
  userBookingView: BookingHotelListUI[];
  isCollapsedUser: boolean[];

  constructor (
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
    this.userBooking = [];
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

  getFromDate(data: NgbDate) {
    this.fromDate = data;
  }

  getToDate(data: NgbDate) {
    this.toDate = data;
  }

  getHotelHistoryList(){
    const searchData = new HotelHistoryListSearch(this.user.id);
    this.isLoading = true;
    this.bookingHistoryService.hotelHistorySimulatorBookingList(searchData).subscribe(
      (res: HotelHistoryList) => {
        this.userBooking = res.bookingList;
        this.userBookingView = [...this.userBooking];
        if (this.userBookingView) {
          this.userBookingView.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
            if (data.currency != null) {
              this.currency = data.currency;
            } else {
              this.currency = 'USD';
            }
          })
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
    }
    this.bookingHistoryService.hotelHistoryBookingDetail(bookingDetail.id).subscribe(
      (res: BookingDetail) => {
        this.bookingDetail = res;
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
    return +total/(+perNight);
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  searchHistory(){
    const d: any = this.searchForm.value;
    let startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), "yyyy-MM-dd");
    let toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), "yyyy-MM-dd");
    const searchData = new HotelHistoryListSearch(this.user.id, startDate, toDate);
    this.isLoading = true;
    this.bookingHistoryService.hotelHistorySimulatorBookingListByDate(searchData).subscribe(
      (res: HotelHistoryList) => {
        this.userBooking = res.bookingList;
        this.userBookingView = [...this.userBooking];
        if (this.userBookingView) {
          // this.processModelUI(this.userBooking);
          this.userBookingView.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
          })
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
}
