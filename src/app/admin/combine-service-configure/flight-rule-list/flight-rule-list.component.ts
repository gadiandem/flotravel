import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlightRuleConfigure } from 'src/app/model/combine-service/flight-configure-rule';

import { FlightRuleConfigureService } from 'src/app/service/admin/combine-service/flight-rule-configure.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';


@Component({
  selector: 'app-flight-rule-list',
  templateUrl: './flight-rule-list.component.html',
  styleUrls: ['./flight-rule-list.component.css']
})
export class FlightRuleListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: FlightRuleConfigure[];
  public gridView: FlightRuleConfigure[];
  isLoading = false;
  user: UserDetail;
  public mySelection: string[] = [];
  constructor(private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private flightRuleConfigureService: FlightRuleConfigureService) { }

  ngOnInit() {
    this.gridData = [];
    this.gridView = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        } else {
          this.fetchFlightRuleConfigureList();
        }
    });
  }

  fetchFlightRuleConfigureList(){
    this.isLoading = true;
    this.flightRuleConfigureService.getFlightRuleList(this.user.id).subscribe(
      (res: FlightRuleConfigure[]) => {
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(ruleDetail: FlightRuleConfigure) {
    this.router.navigate(['./flight/detail', ruleDetail.id], { relativeTo: this.activeRoute });
  }
  editRule(ruleDetail: FlightRuleConfigure) {
    this.router.navigate(['./flight/edit', ruleDetail.id], { relativeTo: this.activeRoute });
  }
  createRule(){
    this.router.navigate(["./flight/create"], { relativeTo: this.activeRoute });
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
  deleteRecord(packageItem: FlightRuleConfigure) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.flightRuleConfigureService.deleteFlightRule(packageItem.id, this.user.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.fetchFlightRuleConfigureList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }
}
