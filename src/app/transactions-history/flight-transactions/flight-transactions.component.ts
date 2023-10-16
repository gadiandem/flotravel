import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import {DatePipe} from '@angular/common';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import { process } from '@progress/kendo-data-query';


import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import * as fromApp from '../../store/app.reducer';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlightHistory } from 'src/app/model/flight/history/flight-history-res';
import { FlightBookingListUI } from 'src/app/model/flight/history/flight-booking-list.ui';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { User } from 'src/app/model/auth/user/user';
import { UserService } from 'src/app/service/admin/user/user.service';
import { FlightHistoryReq } from 'src/app/model/flight/history/flight-history-req';

@Component({
  selector: 'app-flight-transactions',
  templateUrl: './flight-transactions.component.html',
  styleUrls: ['./flight-transactions.component.css']
})
export class FlightTransactionsComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: FlightBookingListUI[];
  public gridView: FlightBookingListUI[];
  public gridViewAgent: FlightBookingListUI[];
  public mySelection: string[] = [];
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct; 
  searchForm: FormGroup;
  formSubmitError: boolean;
  user: UserDetail;
  selectedUser: User;
  isLoading = false;
  constructor(private router: Router,
    private userManage: UserService,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private flightHistoryService: FlightBookingHistoryService) { }

  ngOnInit() {
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
    if (this.user != null) {
      this.getBookingList();
    } else {
      sessionStorage.setItem('calbackUrl', '/flight/history');
      this.router.navigate(['../../auth/login']);
    }
  }
  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }
  getBookingList(){
    this.isLoading = true;
      this.flightHistoryService.flightHistoryBookingList(this.user.id).subscribe(
        (res: FlightHistory) => {
         //console.log('flight history data: ' + JSON.stringify(res));
          this.gridViewData = res.bookingList;
          this.gridView = res.bookingList;
          if (this.gridView) {
       //     this.processModelUI(this.gridView);
          }
          this.gridViewAgent = res.agentBookingList;
          if (this.gridViewAgent) {
        //    this.processModelUI(this.gridViewAgent);
          }
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
  }
  

  processModelUI(bookingList: FlightBookingListUI[]) {
    bookingList.map(flight => {
      flight.customer = `${flight.payer.firstName.toUpperCase()} ${flight.payer.lastName.toUpperCase()} / ${flight.payer.email}`;
      flight.itemPrice = `Total Price ${flight.amount} ${flight.currencyName}: ${flight.baseAmount} baseAmount ${flight.taxes} taxes`;
      flight.userId = flight.accountBooking;
      flight.user = this.user;
      this.userManage.getUserById(this.user.id , flight.userId).subscribe(
        (res: User) => {
          flight.user = res;
          flight.agent = `${flight.user.firstName.toUpperCase()} ${flight.user.lastName.toUpperCase()} / ${flight.user.email}`;
        // console.log("user: " + flight.user.email);
        }, e => {
          console.log(e);
        }
     ); 
      
    });
    
  }


  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridViewData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'itemName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'bookingId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'createDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'bookingStatus',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
    this.processModelUI(this.gridView);
  }

  viewDetail(flightDetail: FlocashPaymentFlight) {
    this.router.navigate(['/transactions/flight-transactions', flightDetail.id]);
    sessionStorage.setItem('flightBookingDetail', JSON.stringify(flightDetail));
  }

  deleteRecord(bookingDetail: FlocashPaymentFlight) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.flightHistoryService.deleteBookingRecord(bookingDetail.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getBookingList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  
  searchHistory() {
    const d: any = this.searchForm.value;
    let startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), "yyyy-MM-dd");
    let toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), "yyyy-MM-dd");
    const searchFlightBookingReq = new FlightHistoryReq();
    searchFlightBookingReq.userId = this.user.id;
    searchFlightBookingReq.startDate = startDate;
    searchFlightBookingReq.endDate = toDate;
    this.isLoading = true;
    this.flightHistoryService.flightHistoryBookingListByDate(searchFlightBookingReq).subscribe(
      (res: FlightHistory) => {
        // console.log('flight history data: ' + JSON.stringify(res));
         this.gridViewData = res.bookingList;
         this.gridView = res.bookingList;
         if (this.gridView) {
       //    this.processModelUI(this.gridView);
         }
         this.gridViewAgent = res.agentBookingList;
         if (this.gridViewAgent) {
        //   this.processModelUI(this.gridViewAgent);
         }
         this.isLoading = false;
       }, e => {
         console.log(e);
         this.isLoading = false;
       }
     );
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  getFromDate(data: NgbDate) {
    this.fromDate = data;
  }

  getToDate(data: NgbDate) {
    this.toDate = data;
  }

}
