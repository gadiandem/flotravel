import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { flightConstant } from '../flight.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { User } from 'src/app/model/auth/user/user';
import { appConstant } from 'src/app/app.constant';
import { FormControl, FormGroup } from '@angular/forms';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { HoldFlightResponse } from 'src/app/model/flight/hold-booking';
import { process } from '@progress/kendo-data-query';
import { HoldFlightList } from 'src/app/model/flight/hold-booking-list';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { createTrue } from 'typescript';
import { async } from 'rxjs/internal/scheduler/async';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-hold-booking',
  templateUrl: './flight-hold-booking.component.html',
  styleUrls: ['./flight-hold-booking.component.css']
})
export class FlightHoldBookingComponent implements OnInit, OnDestroy {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: HoldFlightResponse[];
  public gridView: HoldFlightResponse[];
  public gridViewAgent: HoldFlightResponse[];
  public mySelection: string[] = [];
  user: UserDetail;
  holdFlightResponse: HoldFlightResponse;
  selectedUser: User;
  isLoading = false;
  searchForm: FormGroup;
  errorMessage:string;
  sub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private flightHistoryService: FlightBookingHistoryService,
    private alertify: AlertifyService,
  ) { }
  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
  // const flightReq : FlightPaymentRequest = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_ORDER_CREATE_REQ));
  // const holdFlightBooking : HoldFlightResponse = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_HOLD_BOOKING_RES));
  this.isLoading = true;
  this.initForm();
  this.sub=  this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    },
    );
    this.store.select('flightList').subscribe((data) => {
      this.isLoading = data.loading;
      this.holdFlightResponse = data.holdBookingResult;
      if(!this.isLoading){
        this.getBookingList();
      }
      if(data.errorMessage){
        this.errorMessage = data.errorMessage;
        console.log(JSON.stringify(this.errorMessage));
        this.alertify.error(this.errorMessage);
      }

    });
  }

  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }

  getBookingList(){
    this.isLoading = true;
      this.flightHistoryService.flightHoldBookingList(this.user.id).subscribe(
        (res: HoldFlightList) => {
          this.gridViewData = res.bookingList;
          this.gridView = res.bookingList;
          if (this.gridView) {
            this.processModelUI(this.gridView);
          }
          this.gridViewAgent = res.agentBookingList;
          if (this.gridViewAgent) {
            this.processModelUI(this.gridViewAgent);
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

  processModelUI(bookingList: HoldFlightResponse[]) {
    bookingList.map(flight => {
        //   console.log("flight: " + JSON.stringify(flight.status));
        }, e => {
          console.log(e);
        }
     );
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

  viewDetail(flightDetail: HoldFlightResponse) {
   // console.log(JSON.stringify(flightDetail));
    this.router.navigate(['/flight/hold-booking-result', flightDetail.id]);
    sessionStorage.setItem('flightBookingDetail', JSON.stringify(flightDetail));
  }

  deleteRecord(bookingDetail: HoldFlightResponse) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.flightHistoryService.deleteBookingHoldFlight(bookingDetail.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getBookingList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }


}
