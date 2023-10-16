import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as fromApp from '../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { PackagesHistoryService } from 'src/app/service/packages/packages-history.service';
import { HistoryOrderPackageListRes } from 'src/app/model/packages/consumer/history-package-order-list-res';
import { OrderListItem } from 'src/app/model/packages/consumer/order-list-item';
import { AlertifyService } from 'src/app/service/alertify.service';
import { GcaService } from 'src/app/service/gca/gca.service';
import { GcaHistoryListReq } from 'src/app/model/gca/history/gca-history-list-req';
import { GcaHistoryListRes } from 'src/app/model/gca/history/gca-history-list-res';
import { FlocashPaymentGca } from 'src/app/model/gca/history/gca-history-item';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';

@Component({
  selector: 'app-hepstar-transactions',
  templateUrl: './hepstar-transactions.component.html',
  styleUrls: ['./hepstar-transactions.component.css']
})
export class HepstarTransactionsComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: any[];
  public gridView: any[];
  public agentBookingData: any[];
  public agentBooking: any[];
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
    private hepstarHistoryService: HepstarService,
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
     this.fetchHistoryList();
    } else {
      sessionStorage.setItem('calbackUrl', '/hepstar/history');
      this.router.navigate(['../../auth/login']);
    }
  }
  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }
  fetchHistoryList(){
    this.isLoading = true;
    const req = new GcaHistoryListReq();
    req.userId = this.user.id;
    this.hepstarHistoryService.getHepstarHistoryList(req).subscribe(
      (res: any) => {
        this.gridData = res.bookingList;
        this.agentBookingData = res.agentBookingList;
        this.gridView = this.gridData;
       // console.log(this.gridView)
        this.agentBooking = this.agentBookingData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(packageDetail: any) {
    this.router.navigate(['/transactions/hepstar-transactions', packageDetail.id]);
    // sessionStorage.setItem('tourBookingDetail', JSON.stringify(tourDetail));
  }

  deleteRecord(packageItem: OrderListItem) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.hepstarHistoryService.deleteGcaRecord(packageItem.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.fetchHistoryList();
        }, e => {
          this.alertify.error(`Delete feature currently not support`);
          // this.alertify.error(`${e.error.message}`);
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
    const searchPackageBookingReq = new GcaHistoryListReq;
    searchPackageBookingReq.userId = this.user.id;
    searchPackageBookingReq.startDate = startDate;
    searchPackageBookingReq.endDate = toDate;
    this.isLoading = true;
    this.hepstarHistoryService.getHepstarHistoryListByDate(searchPackageBookingReq).subscribe(
        (res: any) => {
          this.gridData = res.bookingList;
          this.agentBookingData = res.agentBookingList;
          this.gridView = this.gridData;
         // console.log(this.gridView)
          this.agentBooking = this.agentBookingData;
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
    );
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customer',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'packageName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'price',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'traceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'createDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'startDate',
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
  public onFilterAgent(inputValue: string): void {
    this.agentBooking = process(this.agentBookingData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customer',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'packageName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'price',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'traceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'createDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'startDate',
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

}
