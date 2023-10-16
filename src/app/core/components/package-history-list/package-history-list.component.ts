import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { BOOKINGSTATUS, appConstant } from 'src/app/app.constant';
import { PackagesHistoryService } from 'src/app/service/packages/packages-history.service';
import { HistoryOrderPackageListRes } from 'src/app/model/packages/consumer/history-package-order-list-res';
import { OrderListItem } from 'src/app/model/packages/consumer/order-list-item';
import { AlertifyService } from 'src/app/service/alertify.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PaginationInstance } from 'ngx-pagination';
import { HistoryOrderPackageDetailRes } from '../../../model/packages/consumer/history-package-order-detail-res';
import { packagesConstant } from '../../../packages/packages.constant';
import {adminConstant} from '../../../admin/userGroup-constant';
import { DatePipe } from '@angular/common';
import { HistoryOrderPackageListReq } from 'src/app/model/packages/consumer/history-package-order-list-req';

@Component({
  selector: 'app-package-history-list',
  templateUrl: './package-history-list.component.html',
  styleUrls: ['./package-history-list.component.css']
})
export class PackageHistoryListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  orderPackageDetail: HistoryOrderPackageDetailRes;
  public userBooking: OrderListItem[];
  public agentBooking: OrderListItem[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;
  searchForm: FormGroup;

  formSubmitError: boolean;
  public config: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  endDate: string;
  isCollapsedUser: boolean[];
  isCollapsedCancelUser: boolean[];
  isCollapsedAgent: boolean[];
  isCollapsedCancelAgent: boolean[];

  isSAdmin = false;
  bookingStatus: BOOKINGSTATUS;
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private alertify: AlertifyService,
    private packageHistoryService: PackagesHistoryService,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {
    this.initForm();
    this.userBooking = [];
    this.agentBooking = [];
    this.isCollapsedUser = [];
    this.isCollapsedAgent = [];
    this.isCollapsedCancelUser = [];
    this.isCollapsedCancelAgent = [];
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
      if (this.user && this.user.userGroups) {
        this.user.userGroups.forEach(group => {
          if (group.value === adminConstant.SADMIN) {
            this.isSAdmin = true;
          }
        })
      }
     this.fetchHistoryList();
    } else {
      sessionStorage.setItem('calbackUrl', '/hotel/history');
      this.router.navigate(['../../auth/login']);
    }
  }

  fetchHistoryList(){
    this.isLoading = true;
    this.packageHistoryService.orderPackageList(this.user.id).subscribe(
      (res: HistoryOrderPackageListRes) => {
        this.userBooking = res.bookingList;
        this.agentBooking = res.agentBookingList;
        if (this.userBooking) {
          this.userBooking.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
            this.isCollapsedCancelUser[i] = true;
            // this. getOrderDetails(this.userBooking[i].id);
          })

        }
        if (this.agentBooking) {
          this.agentBooking.forEach((data, i) => {
            this.isCollapsedAgent[i] = true;
            this.isCollapsedCancelAgent[i] = true;
            // this. getOrderDetails(this.agentBooking[i].id);
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

  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }

  // getOrderDetails (orderId : string ){
  //   this.packageHistoryService.orderPackageDetail(orderId).subscribe(
  //     (res: HistoryOrderPackageDetailRes) => {
  //       this.orderPackageDetail = res;
  //     }, e => {
  //       console.log(e);
  //     }
  //   );
  // }

  viewDetail(packageDetail: OrderListItem, index: number, type: string) {
    if (type === 'agent') {
      this.isCollapsedAgent[index] = !this.isCollapsedAgent[index];
      this.isCollapsedCancelAgent[index] = true;
    } else {
      this.isCollapsedUser[index] = !this.isCollapsedUser[index];
      this.isCollapsedCancelUser[index] = true;
    }
    // this.packageHistoryService.orderPackageDetail(packageDetail.id).subscribe(
    //   (res: HistoryOrderPackageDetailRes) => {
    //     this.orderPackageDetail = res;
    //   }, e => {
    //     console.log(e);
    //   }
    // );
  }

  viewCancelPopup(packageDetail: OrderListItem, index: number, type: string) {
    if (type === 'user') {
      this.isCollapsedCancelUser[index] = !this.isCollapsedCancelUser[index];
      this.isCollapsedUser[index] = true;
    } else {
      this.isCollapsedCancelAgent[index] = !this.isCollapsedCancelAgent[index];
      this.isCollapsedAgent[index] = true;
    }
    // this.packageHistoryService.orderPackageDetail(packageDetail.id).subscribe(
    //   (res: HistoryOrderPackageDetailRes) => {
    //     this.orderPackageDetail = res;
    //   }, e => {
    //     console.log(e);
    //   }
    // );
  }

  goToCancelBookingPage(item: OrderListItem) {
    sessionStorage.setItem(packagesConstant.PACKAGE_ORDER_BOOKING, JSON.stringify(item));
    this.router.navigate(['/packages/packageCancelBooking', item.id]);
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
        this.userBooking = res.bookingList;
        this.agentBooking = res.agentBookingList;
        if (this.userBooking) {
          this.userBooking.forEach((data, i) => {
            this.isCollapsedUser[i] = true;
            this.isCollapsedCancelUser[i] = true;
            // this. getOrderDetails(this.userBooking[i].id);
          })

        }
        if (this.agentBooking) {
          this.agentBooking.forEach((data, i) => {
            this.isCollapsedAgent[i] = true;
            this.isCollapsedCancelAgent[i] = true;
            // this. getOrderDetails(this.agentBooking[i].id);
          })
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      },
       e => {
        console.log(e);
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    );
  }

  addDays(dateStr: string, days: number): Date {
    let date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date;
  }

  updateBooking(item: OrderListItem) {
    sessionStorage.setItem(packagesConstant.PACKAGES_REFUND_TRACENUMBER, item.traceNumber);
    this.router.navigate(['/packages/history', item.id ,'update']);
  }
}
