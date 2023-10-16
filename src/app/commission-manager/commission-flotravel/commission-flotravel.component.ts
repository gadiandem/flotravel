import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { CommissionFlotravelItem } from 'src/app/model/commission/commission-flotravel-item';

import { AlertifyService } from 'src/app/service/alertify.service';
import { CommissionFlotravelService } from 'src/app/service/commission/commission-flotravel.service';
import * as fromApp from 'src/app/store/app.reducer';


@Component({
  templateUrl: './commission-flotravel.component.html',
  styleUrls: ['./commission-flotravel.component.css']
})
export class CommissionFlotravelComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridData: CommissionFlotravelItem[];
  public gridView: CommissionFlotravelItem[];
  isLoading = false;
  user: UserDetail;
  public mySelection: string[] = [];
  constructor(private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private commissionFLotravelService: CommissionFlotravelService) { }

  ngOnInit() {
    this.gridData = [];
    this.gridView = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        } else {
          this.fetchCommissionFlotravelList();
        }
    });
  }

  fetchCommissionFlotravelList(){
    this.isLoading = true;
    this.commissionFLotravelService.getCommissionList(this.user.id).subscribe(
      (res: CommissionFlotravelItem[]) => {
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  viewDetail(ruleDetail: CommissionFlotravelItem) {
    this.router.navigate(['/commission/flotravel', ruleDetail.id]);
  }
  editRule(commissionDetail: CommissionFlotravelItem) {
    this.router.navigate(['/commission/flotravel/edit', commissionDetail.id]);
  }
  createRule(){
    this.router.navigate(["/commission/flotravel/create"]);
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
            field: 'name',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'type',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'margin',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  deleteRecord(selectItem: CommissionFlotravelItem) {
    this.alertify.confirm('Are you sure you want to delete this commission?', () => {
      this.commissionFLotravelService.deleteCommission(selectItem.id, this.user.id).subscribe(
        (res: any) => {
          this.alertify.success(`Delete commission success:!!!`);
          this.fetchCommissionFlotravelList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }
}
