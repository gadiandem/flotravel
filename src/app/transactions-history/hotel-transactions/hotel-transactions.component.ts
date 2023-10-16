import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { HotelBookingHistoryService } from 'src/app/service/hotel/hotel-history/hotel-history.service';
import { HotelHistoryListSearch } from 'src/app/model/hotel/hotel-history/hotel-history-list-search';
import { BookingList } from 'src/app/model/hotel/hotel-history/booking-list';
import * as fromApp from '../../store/app.reducer';
import * as HotelActions from '../../hotel/store/hotel.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { User } from 'src/app/model/auth/user/user';
import { HotelHistoryList } from 'src/app/model/hotel/hotel-history/hotel-history-list-res';
import { BookingHotelListUI } from 'src/app/model/hotel/hotel-history/booking-hotel-list.ui';
import { appConstant } from 'src/app/app.constant';
import { hotelConstant } from '../../hotel/hotel.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';
import { UserService } from 'src/app/service/admin/user/user.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hotel-transactions',
  templateUrl: './hotel-transactions.component.html',
  styleUrls: ['./hotel-transactions.component.css']
})
export class HotelTransactionsComponent implements OnInit {

@ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
// public gridData: Booking[];
public userBooking: BookingHotelListUI[];
public agentBookingList: BookingList[];
public mySelection: string[] = [];

fromDate: NgbDateStruct;
toDate: NgbDateStruct;
searchForm: FormGroup;

user: UserDetail;
selectedUser: User;
bookings: BookingList[];
isLoading = false;

constructor(private bookingHistoryService: HotelBookingHistoryService,
   private router: Router,
   private userManage: UserService,
   private alertify: AlertifyService,
  private store: Store<fromApp.AppState>,
  private datePipe: DatePipe) {
}

public ngOnInit(): void {
  // this.gridView = this.gridData;
  this.isLoading = true;
  this.initForm();
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

private initForm() {
  this.searchForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl()
  });
}
convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }
getHotelHistoryList() {
  const searchData = new HotelHistoryListSearch(this.user.id);
  this.bookingHistoryService.hotelHistoryBookingList(searchData).subscribe(
    (res: HotelHistoryList) => {
      this.userBooking = res.bookingList;
      if (this.userBooking) {
      //  this.processModelUI(this.userBooking);
      }
      this.agentBookingList = res.agentBookingList;
      if (this.agentBookingList) {
     //   this.processModelUI(this.agentBookingList);
      }
      this.isLoading = false;

    }, e => {
      console.log(e);
      this.isLoading = false;
    }
  );

}

processModelUI(bookingList: BookingHotelListUI[]) {
  bookingList.map(hotel => {
    hotel.user = this.user;
    hotel.customer = `${hotel.payer.firstName.toUpperCase()} ${hotel.payer.lastName.toUpperCase()} / ${hotel.payer.email}`;
   // hotel.item = `${hotel.hotelInfo.name} / ${hotel.hotelInfo.address} / ${hotel.amount} ${hotel.currency}`;
    hotel.stay = `${hotel.checkInDate} -> ${hotel.checkOutDate}`;
    const guest = [];
    hotel.roomDetails.roomDetails.forEach(room => {
      guest.push(`${room.roomDescription} / ${room.adultCount || 0} / ${room.childCount || 0}`);
    });
    hotel.guest = guest.toString();
    this.userManage.getUserById(this.user.id , hotel.accountBooking).subscribe(
      (res: User) => {
        hotel.user = res;
        hotel.agent = `${hotel.user.firstName.toUpperCase()} ${hotel.user.lastName.toUpperCase()} / ${hotel.user.email}`;
     // console.log("user: " + hotel.user.email);
      }, e => {
        console.log(e);
      }
   );
    // console.log(hotel);
  });
}
viewDetail(bookingDetail: BookingList) {
  this.router.navigate(['/transactions/hotel-transactions', bookingDetail.id]);
  sessionStorage.setItem(hotelConstant.BOOKING_HISTORY_DETAIL, JSON.stringify(bookingDetail));
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

getFromDate(data: NgbDate) {
  this.fromDate = data;
}

getToDate(data: NgbDate) {
  this.toDate = data;
}

searchHistory() {
  this.isLoading = true;
  const startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), 'yyyy-MM-dd');
  const toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), 'yyyy-MM-dd');
  const searchData = new HotelHistoryListSearch(this.user.id, startDate, toDate);
  this.bookingHistoryService.hotelHistoryBookingListByDate(searchData).subscribe(
  (res: HotelHistoryList) => {
    this.userBooking = res.bookingList;
    if (this.userBooking) {
    //  this.processModelUI(this.userBooking);
    }
    this.agentBookingList = res.agentBookingList;
    if (this.agentBookingList) {
   //   this.processModelUI(this.agentBookingList);
    }
    this.isLoading = false;

  }, e => {
    console.log(e);
    this.isLoading = false;
  }
);
}

public onFilter(inputValue: string): void {
  this.userBooking = process(this.userBooking, {
    filter: {
      logic: 'or',
      filters: [
        {
          field: 'customer',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'hotel',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'createDate',
          operator: 'contains',
          value: inputValue
        }, ,
        {
          field: 'budget',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'bookingId',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'address',
          operator: 'contains',
          value: inputValue
        }
      ],
    }
  }).data;

  this.dataBinding.skip = 0;
}
}
