import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import * as fromApp from '../../../store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { HistoryOrderPackageListRes } from 'src/app/model/packages/consumer/history-package-order-list-res';
import { OrderListItem } from 'src/app/model/packages/consumer/order-list-item';
import { AlertifyService } from 'src/app/service/alertify.service';
import { SpecialPackagesHistoryService } from 'src/app/service/packages/special-packages-history.service';

@Component({
  selector: 'app-package-history-list',
  templateUrl: './package-history-list.component.html',
  styleUrls: ['./package-history-list.component.css']
})
export class PackageHistoryListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: OrderListItem[];
  public gridView: OrderListItem[];
  public agentBookingData: OrderListItem[];
  public agentBooking: OrderListItem[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private alertify: AlertifyService,
    private packageHistoryService: SpecialPackagesHistoryService) { }

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
        this.gridData = res.bookingList;
        this.agentBookingData = res.agentBookingList;
        this.gridView = this.gridData;
        this.agentBooking = this.agentBookingData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(packageDetail: OrderListItem) {
    this.router.navigate(['/specialPackages/history', packageDetail.id]);
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
