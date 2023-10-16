import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import * as fromApp from '../../../store/app.reducer';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { TourHistoryListReq } from 'src/app/model/thing-to-do/tour-history-list-req';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { TourHistoryListRes } from 'src/app/model/thing-to-do/tour-history-list-res';
import { TourHisotyListUI } from 'src/app/model/thing-to-do/tour-payment/tour-history-list.ui';
import { appConstant } from 'src/app/app.constant';
@Component({
  selector: 'app-tour-history',
  templateUrl: './tour-history.component.html',
  styleUrls: ['./tour-history.component.css']
})
export class TourHistoryComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridView: TourHisotyListUI[];
  public agentBooking: TourHisotyListUI[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private tourService: TourListService) { }

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
    if (this.user != null) {
      const searchData = new TourHistoryListReq();
      searchData.userId = this.user.id;
      this.isLoading = true;
      this.tourService.tourlHistoryBookingList(searchData).subscribe(
        (res: TourHistoryListRes) => {
          this.gridView = res.bookingList;
          if (this.gridView) {
            this.processModelUI(this.gridView);
          }
          this.agentBooking = res.agentBookingList;
          if (this.agentBooking) {
            this.processModelUI(this.agentBooking);
          }
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
    } else {
      sessionStorage.setItem('calbackUrl', '/hotel/history');
      this.router.navigate(['../../auth/login']);
    }
  }

  processModelUI(tourList: TourHisotyListUI[]) {
    tourList.map(tour => {
      tour.customer = `${tour.payer.firstName.toUpperCase()} ${tour.payer.lastName.toUpperCase()} / ${tour.payer.email}`;
      tour.tourItem = `${tour.item_name} / ${tour.amount} ${tour.currencyName}`;
      tour.time = `${tour.fromTime} -> ${tour.toTime}`;
      tour.guest = `${tour.adultCount || 0} aduts, ${tour.childCount || 0} childs`;
    });
  }

  viewDetail(tourDetail: PaymentTour) {
    this.router.navigate(['/tour/history', tourDetail.id]);
    sessionStorage.setItem('tourBookingDetail', JSON.stringify(tourDetail));
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
