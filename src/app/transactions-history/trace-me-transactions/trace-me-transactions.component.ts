import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import * as fromApp from '../../store/app.reducer';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { TracemeService } from 'src/app/service/traceme/traceme.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { TracemeHistoryListRes } from 'src/app/model/traceme/history/traceme-history-list-res';
import { TraceMeHistoryListReq } from 'src/app/model/traceme/history/traceme-history-req';
import { tracemeConstant } from '../../traceme/traceme.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trace-me-transactions',
  templateUrl: './trace-me-transactions.component.html',
  styleUrls: ['./trace-me-transactions.component.css']
})
export class TraceMeTransactionsComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridView: FlocashPaymentTraceMe[];
  public agentBooking: FlocashPaymentTraceMe[];
  public mySelection: string[] = [];

  user: UserDetail;
  searchForm: FormGroup;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  endDate: string;
  isLoading = false;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private alertify: AlertifyService,
    private tracemeService: TracemeService,
    private datePipe: DatePipe) { }

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
      this.getTraceMeHistoryList();
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
  // processModelUI(tracemeList: FlocashPaymentTraceMe[]) {
  //   tracemeList.map(traceme => {
  //     traceme.customer = `${traceme.payer.firstName.toUpperCase()} ${traceme.payer.lastName.toUpperCase()} / ${traceme.payer.email}`;
  //     traceme.tourItem = `${traceme.item_name} / ${traceme.amount} ${traceme.currencyName}`;
  //     traceme.time = `${traceme.fromTime} -> ${traceme.toTime}`;
  //     traceme.guest = `${traceme.adultCount || 0} aduts, ${traceme.childCount || 0} childs`;
  //   });
  // }

  getTraceMeHistoryList(){
    const searchData = new TraceMeHistoryListReq();
      searchData.userId = this.user.id;
      this.isLoading = true;
      this.tracemeService.getTracemeHistoryList(searchData).subscribe(
        (res: TracemeHistoryListRes) => {
          this.gridView = res.bookingList;
          // if (this.gridView) {
          //   this.processModelUI(this.gridView);
          // }
          // this.agentBooking = res.agentBookingList;
          // if (this.agentBooking) {
          //   this.processModelUI(this.agentBooking);
          // }
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
  }

  viewDetail(tracemeDetail: FlocashPaymentTraceMe) {
    this.router.navigate(['/transactions/traceme-transactions', tracemeDetail.id]);
    sessionStorage.setItem(tracemeConstant.TRACEME_DETAIL_HISOTY, JSON.stringify(tracemeDetail));
  }

  deleteRecord(tracemeDetail: FlocashPaymentTraceMe) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.tracemeService.deleteTracemeRecord(tracemeDetail.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getTraceMeHistoryList();
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

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  searchHistory() {
    const d: any = this.searchForm.value;
    let startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), "yyyy-MM-dd");
    let toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), "yyyy-MM-dd");
    const searchPackageBookingReq = new TraceMeHistoryListReq;
    searchPackageBookingReq.userId = this.user.id;
    searchPackageBookingReq.startDate = startDate;
    searchPackageBookingReq.endDate = toDate;
    this.isLoading = true;
    this.tracemeService.getTracemeHistoryListByDate(searchPackageBookingReq).subscribe(
      (res: TracemeHistoryListRes) => {
        this.gridView = res.bookingList;
        // if (this.gridView) {
        //   this.processModelUI(this.gridView);
        // }
        // this.agentBooking = res.agentBookingList;
        // if (this.agentBooking) {
        //   this.processModelUI(this.agentBooking);
        // }
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridView, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customer',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'tour',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'time',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
}

