import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { InsuranceHistoryListRequest } from 'src/app/model/insurance/history/insurance-history-list-request';
import { InsuranceHistoryListRes } from 'src/app/model/insurance/history/insurance-history-list-res';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { TourHistoryListReq } from 'src/app/model/thing-to-do/tour-history-list-req';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { AlertifyService } from 'src/app/service/alertify.service';
import { InsuranceService } from 'src/app/service/insurance/insurance.service';
import * as fromApp from '../../../store/app.reducer';
import { insuranceConstant } from '../../../insurance/insurance.constant';
import * as InsuranceActions from '../../../insurance/store/insurance.actions';

@Component({
  selector: 'app-insurance-booking-history-list',
  templateUrl: './insurance-booking-history-list.component.html',
  styleUrls: ['./insurance-booking-history-list.component.css']
})
export class InsuranceBookingHistoryListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridView: FlocashPaymentInsurance[];
  public agentBooking: FlocashPaymentInsurance[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;

  private initialTryGetToken = true;
  private initialTryGetQuote = true;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private alertify: AlertifyService,
    private insuranceService: InsuranceService) { }

  ngOnInit() {
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    // this.store.select("insuranceList").subscribe((data) => {
    //   if (data.axaAuth) {

    //   } else {
    //     if (this.initialTryGetToken) {
    //       this.store.dispatch(
    //         new InsuranceActions.AuthAxaStart({ data: null })
    //       );
    //     }
    //     this.initialTryGetToken = false;
    //   }
    // })

    if (this.user != null) {
      this.getHistoryList(this.user.id);
    } else {
      sessionStorage.setItem('calbackUrl', '/hotel/history');
      this.router.navigate(['../../auth/login']);
    }
  }

  getHistoryList(userId: string){
    this.isLoading = true;
    const request = new InsuranceHistoryListRequest(userId, );
    this.insuranceService.getInsurancePaymentHistoryList(request).subscribe(
      (res: InsuranceHistoryListRes) => {
        this.gridView = res.bookingList;
        this.agentBooking =res.agentBookingList;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  processModelUI(insuranceList: FlocashPaymentInsurance[]) {
    insuranceList.map(item => {
      // item.customer = `${tour.payer.firstName.toUpperCase()} ${tour.payer.lastName.toUpperCase()} / ${tour.payer.email}`;
      // item.tourItem = `${tour.item_name} / ${tour.amount} ${tour.currencyName}`;
      // item.time = `${tour.fromTime} -> ${tour.toTime}`;
      // item.guest = `${tour.adultCount || 0} aduts, ${tour.childCount || 0} childs`;
    });
  }

  viewDetail(insuranceDetail: PaymentTour) {
    const expirationDate = sessionStorage.getItem(insuranceConstant.AXA_TOKEN_EXPIRE_TIME);
    this.store.dispatch(new InsuranceActions.AuthAxaStart({ data: expirationDate }));
    this.router.navigate(['/insurance/history', insuranceDetail.id]);
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
