import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';

import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { InsuranceHistoryListRequest } from 'src/app/model/insurance/history/insurance-history-list-request';
import { InsuranceHistoryListRes } from 'src/app/model/insurance/history/insurance-history-list-res';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { TourHistoryListReq } from 'src/app/model/thing-to-do/tour-history-list-req';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { AlertifyService } from 'src/app/service/alertify.service';
import { InsuranceService } from 'src/app/service/insurance/insurance.service';
import * as fromApp from '../../store/app.reducer';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';
import { UserService } from 'src/app/service/admin/user/user.service';
import { User } from 'src/app/model/auth/user/user';


@Component({
  selector: 'app-insurance-transactions',
  templateUrl: './insurance-transactions.component.html',
  styleUrls: ['./insurance-transactions.component.css']
})
export class InsuranceTransactionsComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridView: FlocashPaymentInsurance[];
  public agentBooking: FlocashPaymentInsurance[];
  public mySelection: string[] = [];

  user: UserDetail;
  searchForm: FormGroup;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  endDate: string;
  isLoading = false;

  private initialTryGetToken = true;
  private initialTryGetQuote = true;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private userManage: UserService,
    private alertify: AlertifyService,
    private insuranceService: InsuranceService,
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
      this.getHistoryList(this.user.id);
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

  getHistoryList(userId: string){
    this.isLoading = true;
    const request = new InsuranceHistoryListRequest(userId, );
    this.insuranceService.getInsurancePaymentHistoryList(request).subscribe(
      (res: InsuranceHistoryListRes) => {
        this.gridView = res.bookingList;
        if (this.gridView) {
         // console.log(this.gridView)
          this.processModelUI(this.gridView);
        }
        this.agentBooking =res.agentBookingList;
        if (this.agentBooking) {
          this.processModelUI(this.agentBooking);
        }
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  processModelUI(insuranceList: FlocashPaymentInsurance[]) {
    insuranceList.map(item => {
      this.userManage.getUserById(this.user.id , item.accountBooking ).subscribe(
        (res: User) => {
          item.user = res;
          item.agent = `${item.user.firstName} ${item.user.lastName}, ${item.user.email}`;
          item.guaranteeDetails = ` Code: ${item.guarantees[0].code}, Excess: ${item.guarantees[0].excess}, Limit: ${item.guarantees[0].limit}`;
          item.amount = +`${item.price.priceAfterDiscountIncTax} `;
          item.status = `${item.subscriptionStatus.value} `;
          //console.log("user: " + item.user.email);

        }, e => {
          console.log(e);
        }
     );
      // item.customer = `${tour.payer.firstName.toUpperCase()} ${tour.payer.lastName.toUpperCase()} / ${tour.payer.email}`;
      // item.tourItem = `${tour.item_name} / ${tour.amount} ${tour.currencyName}`;
      // item.time = `${tour.fromTime} -> ${tour.toTime}`;
      // item.guest = `${tour.adultCount || 0} aduts, ${tour.childCount || 0} childs`;
    });
  }

  viewDetail(insuranceDetail: PaymentTour) {
    const expirationDate = sessionStorage.getItem(insuranceConstant.AXA_TOKEN_EXPIRE_TIME);
    this.store.dispatch(new InsuranceActions.AuthAxaStart({ data: expirationDate }));
    this.router.navigate(['/transactions/insurance-transactions', insuranceDetail.id]);
    sessionStorage.setItem(insuranceConstant.HISTORY_INSURANCE_SELECTED, JSON.stringify(insuranceDetail));
  }

  deleteRecord(insuranceItem: PaymentTour) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.insuranceService.deleteInsuranceRecord(insuranceItem.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getHistoryList(this.user.id);
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
  searchInsurance() {
    this.isLoading = true;
    const d: any = this.searchForm.value;
    let startDate = this.datePipe.transform(this.convertNgbDateToDate(this.fromDate), "yyyy-MM-dd");
    let toDate = this.datePipe.transform(this.convertNgbDateToDate(this.toDate), "yyyy-MM-dd");
    const searchInsuranceBookingReq = new InsuranceHistoryListRequest(this.user.id,startDate,toDate);
    this.insuranceService.getInsurancePaymentHistoryListbyDate(searchInsuranceBookingReq).subscribe(
      (res: InsuranceHistoryListRes) => {
        this.gridView = res.bookingList;
        if (this.gridView) {
          //console.log(this.gridView)
          this.processModelUI(this.gridView);
        }
        this.agentBooking =res.agentBookingList;
        if (this.agentBooking) {
          this.processModelUI(this.agentBooking);
        }
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
          },{
            field: 'createDate',
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
