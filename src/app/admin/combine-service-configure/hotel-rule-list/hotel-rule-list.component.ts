import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { HotelRuleConfigure } from 'src/app/model/combine-service/hotel-configure-rule';

import { HotelRuleConfigureService } from 'src/app/service/admin/combine-service/hotel-rule-configure.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-hotel-rule-list',
  templateUrl: './hotel-rule-list.component.html',
  styleUrls: ['./hotel-rule-list.component.css']
})
export class HotelRuleListComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: HotelRuleConfigure[];
  public gridView: HotelRuleConfigure[];
  isLoading = false;
  user: UserDetail;
  public mySelection: string[] = [];
  constructor(
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private hotelRuleConfigureService: HotelRuleConfigureService) { }

  ngOnInit() {
    this.gridData = [];
    this.gridView = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        } else {
          this.fetchHotelRuleConfigureList();
        }
    });
  }

  fetchHotelRuleConfigureList(){
    this.isLoading = true;
    this.hotelRuleConfigureService.getHotelRuleList(this.user.id).subscribe(
      (res: HotelRuleConfigure[]) => {
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(ruleDetail: HotelRuleConfigure) {
    this.router.navigate(['./hotel/detail', ruleDetail.id], { relativeTo: this.activeRoute });
  }
  editRule(ruleDetail: HotelRuleConfigure) {
    this.router.navigate(['./hotel/edit', ruleDetail.id], { relativeTo: this.activeRoute });
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'code',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'cityName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'countryName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'providers',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'hotelPreferenceIncludes',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'hotelPreferenceExcludes',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'starPreferences',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  createRule(){
    this.router.navigate(["./hotel/create"], { relativeTo: this.activeRoute });
  }

  deleteRecord(rule: HotelRuleConfigure) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.hotelRuleConfigureService.deleteHotelRule(rule.id, this.user.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.fetchHotelRuleConfigureList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }
}
