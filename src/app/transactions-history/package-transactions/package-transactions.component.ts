import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import * as fromApp from '../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { PackagesHistoryService } from 'src/app/service/packages/packages-history.service';
import { HistoryOrderPackageListRes } from 'src/app/model/packages/consumer/history-package-order-list-res';
import { OrderListItem } from 'src/app/model/packages/consumer/order-list-item';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserService } from 'src/app/service/admin/user/user.service';
import { User } from 'src/app/model/auth/user/user';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { HistoryOrderPackageListReq } from 'src/app/model/packages/consumer/history-package-order-list-req';

@Component({
  selector: 'app-package-transactions',
  templateUrl: './package-transactions.component.html',
  styleUrls: ['./package-transactions.component.css']
})
export class PackageTransactionsComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: OrderListItem[];
  public gridView: OrderListItem[];
  public agentBookingData: OrderListItem[];
  public agentBooking: OrderListItem[];
  public mySelection: string[] = [];
  public agent : User;

  user: UserDetail;
  searchForm: FormGroup;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  endDate: string;
  isLoading = false;
  constructor(private store: Store<fromApp.AppState>,
    private userManage: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private packageHistoryService: PackagesHistoryService,
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
      sessionStorage.setItem('calbackUrl', '/transactions/package-transactions');
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
    this.packageHistoryService.orderPackageList(this.user.id).subscribe(
      (res: HistoryOrderPackageListRes) => {
        this.gridData = res.bookingList;
        this.agentBookingData = res.agentBookingList;
        this.gridView = this.gridData;
        if (this.gridView) {
          this.gridView.forEach((data, i) => {
            this.gridView[i].user = this.user;
            this.gridView[i].accountBooking;
            this.gridView[i].customer = `${this.gridView[i].payer.firstName.toUpperCase()} ${this.gridView[i].payer.lastName.toUpperCase()} / ${this.gridView[i].payer.email}`;
            this.gridView[i].packageInfo = ` ${this.gridView[i].name.toUpperCase()}  ${this.gridView[i].selectedPackage.cityName}`;
            this.userManage.getUserById(this.user.id , this.gridView[i].accountBooking).subscribe(
              (res: User) => {
                this.gridView[i].user = res;
                this.gridView[i].agent = `${this.gridView[i].user.firstName.toUpperCase()} ${this.gridView[i].user.lastName.toUpperCase()} / ${this.gridView[i].user.email}`;
               // console.log(this.gridView[i].accountBooking);
              }, e => {
                console.log(e);
              }
           );
         
          })
        }       
       // console.log(this.gridData);
        this.agentBooking = this.agentBookingData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(packageDetail: OrderListItem) {
    this.router.navigate(['/transactions/package-transactions', packageDetail.id]);
    // sessionStorage.setItem('tourBookingDetail', JSON.stringify(tourDetail));
  }

  deleteRecord(packageItem: OrderListItem) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.packageHistoryService.deletePackageRecord(packageItem.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.fetchHistoryList();
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
    const searchPackageBookingReq = new HistoryOrderPackageListReq;
    searchPackageBookingReq.userId = this.user.id;
    searchPackageBookingReq.startDate = startDate;
    searchPackageBookingReq.endDate = toDate;
    this.isLoading = true;
    this.packageHistoryService.orderPackageListByDate(searchPackageBookingReq).subscribe(
      (res: HistoryOrderPackageListRes) => {
        this.gridData = res.bookingList;
        this.agentBookingData = res.agentBookingList;
        this.gridView = this.gridData;
        if (this.gridView) {
          this.gridView.forEach((data, i) => {
            this.gridView[i].user = this.user;
            this.gridView[i].accountBooking;
            this.gridView[i].customer = `${this.gridView[i].payer.firstName.toUpperCase()} ${this.gridView[i].payer.lastName.toUpperCase()} / ${this.gridView[i].payer.email}`;
            this.gridView[i].packageInfo = ` ${this.gridView[i].name.toUpperCase()}  ${this.gridView[i].selectedPackage.cityName}`;
            this.userManage.getUserById(this.user.id , this.gridView[i].accountBooking).subscribe(
              (res: User) => {
                this.gridView[i].user = res;
                this.gridView[i].agent = `${this.gridView[i].user.firstName.toUpperCase()} ${this.gridView[i].user.lastName.toUpperCase()} / ${this.gridView[i].user.email}`;
               // console.log(this.gridView[i].accountBooking);
              }, e => {
                console.log(e);
              }
           );
         
          })
        }       
       // console.log(this.gridData);
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
            field: 'bookingId',
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
            field: 'bookingId',
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
