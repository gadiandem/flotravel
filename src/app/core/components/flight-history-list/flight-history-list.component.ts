import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import * as fromApp from '../../../store/app.reducer';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlightHistory } from 'src/app/model/flight/history/flight-history-res';
import { FlightBookingListUI } from 'src/app/model/flight/history/flight-booking-list.ui';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { Flight } from '../../../model/flight/flight-list/flight';
import { PaginationInstance } from 'ngx-pagination';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {HotelHistoryListSearch} from '../../../model/hotel/hotel-history/hotel-history-list-search';
import {HotelHistoryList} from '../../../model/hotel/hotel-history/hotel-history-list-res';
import {DatePipe} from '@angular/common';
import {FlightHistoryReq} from '../../../model/flight/history/flight-history-req';
import { toHtml } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-flight-history-list',
  templateUrl: './flight-history-list.component.html',
  styleUrls: ['./flight-history-list.component.css']
})
export class FlightHistoryListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public flightUserBooking: FlightBookingListUI[];
  public flightAgentBooking: FlightBookingListUI[];
  public gridView: FlightBookingListUI[];
  public gridViewAgent: FlightBookingListUI[];
  public mySelection: string[] = [];
  hourDuration: number;
  minuteDuration: number;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  searchForm: FormGroup;
  formSubmitError: boolean;
  user: UserDetail;
  isLoading = true;
  fetching = false

  isCollapsedUser: boolean[];
  isCollapsedCancelUser: boolean[];
  isCollapseModifylUser: boolean[];
  isCollapsedAgent: boolean[];
  isCollapsedCancelAgent: boolean[];
  isCollapsedModifyAgent: boolean[];

  public config: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;
  flightBookingDetail: FlocashPaymentFlight;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private flightHistoryService: FlightBookingHistoryService,
    private datePipe: DatePipe
  ){}

  ngOnInit() {
    this.initForm();
    this.formSubmitError = false;
    this.flightUserBooking = [];
    this.flightAgentBooking = [];
    this.isCollapsedUser = [];
    this.isCollapsedAgent = [];
    this.isCollapsedCancelUser = [];
    this.isCollapseModifylUser =[];
    this.isCollapsedCancelAgent = [];
    this.isCollapsedModifyAgent = [];

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

  getBookingList(){
      this.flightHistoryService.allFlightHistoryBookingList(this.user.id).subscribe(
        (res: FlightHistory) => {
          this.flightUserBooking = res.bookingList;
          if (this.flightUserBooking) {
            this.flightUserBooking.forEach((data, i) => {
              this.isCollapsedUser[i] = true;
              this.isCollapsedCancelUser[i] = true;
              this.isCollapseModifylUser[i]= true
            })
            this.isLoading = false;
          }
          this.flightAgentBooking = res.agentBookingList;
          if (this.flightAgentBooking) {
            this.flightAgentBooking.forEach((data, i) => {
              this.isCollapsedAgent[i] = true;
              this.isCollapsedCancelAgent[i] = true;
              this.isCollapsedModifyAgent[i] = true;
            })
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

  deleteRecord(bookingDetail: FlocashPaymentFlight) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.flightHistoryService.deleteBookingRecord(bookingDetail.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete successful:!!!`);
          this.getBookingList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if (data.flightSegments.length > 1) {
      data.flightSegments.forEach(segment => {
        let hour = segment.duration.split('H')[0];
        let minute  = segment.duration.split('M')[0].split('H')[1];
        this.hourDuration += +hour;
        this.minuteDuration += +minute;
        if (this.minuteDuration >= 60) {
          this.hourDuration += 1;
          this.minuteDuration -= 60;
        }
      })
      return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
    } else {
      return data.flightSegments[0].duration;
    }
  }

  viewDetail(flight: FlocashPaymentFlight, index: number, type: string) {
    if (type === 'agent') {
      this.isCollapsedAgent[index] = !this.isCollapsedAgent[index];
      this.isCollapsedCancelAgent[index] = true;
      this.isCollapsedModifyAgent[index] = true;
    } else if (type === 'user'){
      this.isCollapsedUser[index] = !this.isCollapsedUser[index];
      this.isCollapsedCancelUser[index] = true;
      this.isCollapseModifylUser[index] = true;
    }
    this.flightHistoryService.flightHistoryBookingDetail(flight.id).subscribe(
      (res: FlocashPaymentFlight) => {
        this.flightBookingDetail = res;
      }, e => {
        console.log(e);
      }
    );
  }

  viewCancelPopup(flightDetail: FlocashPaymentFlight, index: number, type: string) {
    this.fetching = true;
    if (type === 'user') {
      this.isCollapsedCancelUser[index] = !this.isCollapsedCancelUser[index];
      this.isCollapsedUser[index] = true;
    } else if (type === 'agent'){
      this.isCollapsedCancelAgent[index] = !this.isCollapsedCancelAgent[index];
      this.isCollapsedModifyAgent[index] = !this.isCollapsedModifyAgent[index];
      this.isCollapsedAgent[index] = true;
    }
    this.flightHistoryService.flightHistoryBookingDetail(flightDetail.id).subscribe(
      (res: FlocashPaymentFlight) => {
        this.flightBookingDetail = res;
        if(this.flightBookingDetail){
          this.fetching = false;
          sessionStorage.setItem('flightBookingDetail', JSON.stringify(this.flightBookingDetail));
        }
      }, e => {
        console.log(e);
      }
    );
  }
  viewModifyPopup(flightDetail: FlocashPaymentFlight, index: number, type: string) {
    this.fetching = true;
    if (type === 'user') {
      this.isCollapseModifylUser[index] = !this.isCollapseModifylUser[index];
      this.isCollapsedUser[index] = true;
    } else if (type === 'agent'){
      this.isCollapsedCancelAgent[index] = !this.isCollapsedCancelAgent[index];
      this.isCollapsedModifyAgent[index] = !this.isCollapsedModifyAgent[index];
      this.isCollapsedAgent[index] = true;
    }
    this.flightHistoryService.flightHistoryBookingDetail(flightDetail.id).subscribe(
      (res: FlocashPaymentFlight) => {
        this.flightBookingDetail = res;
        if(this.flightBookingDetail){
          this.fetching = false;
          sessionStorage.setItem('flightBookingDetail', JSON.stringify(this.flightBookingDetail));
        }
      }, e => {
        console.log(e);
      }
    );
  }

  goToCancelBookingPage(bookingCancelSelected: FlightBookingListUI) {
    sessionStorage.setItem('flightBookingDetail', JSON.stringify(this.flightBookingDetail));
    this.router.navigate(['/flight/flightCancelBooking', bookingCancelSelected.id]);
  }

  goToModifyBookingPage(bookingModifySelected: FlightBookingListUI) {
    this.router.navigate(['/flight/flightModifyBooking', bookingModifySelected.id]);
    sessionStorage.setItem('flightBookingDetail', JSON.stringify(this.flightBookingDetail));
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
    this.flightHistoryService.allFlightHistoryBookingListByDate(searchFlightBookingReq).subscribe(
      (res: FlightHistory) => {
        this.flightUserBooking = res.bookingList;
        if (this.flightUserBooking) {
          this.flightUserBooking.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
          })
        }
        this.flightAgentBooking = res.agentBookingList;
        if (this.flightAgentBooking) {
          this.flightAgentBooking.forEach((data, i) => {
            this.isCollapsedAgent[i] = true;
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

  getDays(total: string, perNight: string): number {
    return +total/(+perNight);
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
