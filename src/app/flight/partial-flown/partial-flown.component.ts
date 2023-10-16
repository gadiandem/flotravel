import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import { User } from 'src/app/model/auth/user/user';
import { appConstant } from 'src/app/app.constant';
import { flightConstant,orderChangeType } from '../flight.constant';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { process } from '@progress/kendo-data-query';
import { AlertifyService } from 'src/app/service/alertify.service';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { PartialFlightList } from 'src/app/model/flight/partial-flight-list';
import { OrderChangeReq } from 'src/app/model/flight/order-change';

@Component({
  selector: 'app-partial-flown',
  templateUrl: './partial-flown.component.html',
  styleUrls: ['./partial-flown.component.css']
})
export class PartialFlownComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: FlocashPaymentFlight[];
  public gridView: FlocashPaymentFlight[];
  public mySelection: string[] = [];
  fightResponse: FlocashPaymentFlight
  user: UserDetail;
  selectedUser: User;
  isLoading = true;
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
      this.fightResponse = data.flightPartialBookingResult;
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
      this.flightHistoryService.partialFlightBookingList(this.user.id).subscribe(
        (res: PartialFlightList) => {
          this.gridViewData = res.bookingList;
          this.gridView = res.bookingList;
          if (this.gridView) {
            this.isLoading = false;
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
  }

  reShopFlight(flightDetail: FlocashPaymentFlight) {
    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.flightDetail = flightDetail;
    bookingData.orderId =  flightDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.PARTIAL_CHANGE;
    bookingData.orderItemRef = flightDetail.orderItemID;
    bookingData.provider = 5;
    sessionStorage.setItem(flightConstant.FLIGHT_CHANGE, JSON.stringify(bookingData));
    window.open(`#/dashboard/flight-reshop`, '_blank');
    sessionStorage.setItem('flightBookingDetail', JSON.stringify(flightDetail));
  }

  deleteRecord(bookingDetail: FlocashPaymentFlight) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.flightHistoryService.deletePartialFlightBooking(bookingDetail.id).subscribe(
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
