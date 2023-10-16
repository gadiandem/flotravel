import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {DataBindingDirective} from '@progress/kendo-angular-grid';
import {process} from '@progress/kendo-data-query';
import {appConstant} from 'src/app/app.constant';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {CommissionAgentItem} from 'src/app/model/commission/commission-agent-item';
import {CommissionFlotravelItem} from 'src/app/model/commission/commission-flotravel-item';

import {AlertifyService} from 'src/app/service/alertify.service';
import {CommissionAgentService} from 'src/app/service/commission/commission-agent.service';
import {CommissionFlotravelService} from 'src/app/service/commission/commission-flotravel.service';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  templateUrl: './commission-agent.component.html',
  styleUrls: ['./commission-agent.component.css']
})
export class CommissionAgentComponent implements OnInit {
  @ViewChild(DataBindingDirective, {static: false}) dataBinding: DataBindingDirective;
  public gridData: CommissionFlotravelItem[];
  public gridView: CommissionFlotravelItem[];
  isLoading = false;
  user: UserDetail;
  public mySelection: string[] = [];

  constructor(private alertify: AlertifyService,
              private store: Store<fromApp.AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private commissionAgentService: CommissionAgentService) {
  }

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

  fetchCommissionFlotravelList() {
    this.isLoading = true;
    const agentId = this.user.agentId;
    this.commissionAgentService.getCommissionList(this.user.id, agentId).subscribe(
      (res: CommissionAgentItem[]) => {
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
    this.router.navigate(['/commission/agent', ruleDetail.id]).then(r => {});
  }

  editRule(commissionDetail: CommissionFlotravelItem) {
    this.router.navigate(['/commission/agent/edit', commissionDetail.id]).then(r => {});
  }

  createRule() {
    this.router.navigate(['/commission/agent/create']).then(r => {});
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          // {
          //   field: 'code',
          //   operator: 'contains',
          //   value: inputValue
          // },
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
      this.commissionAgentService.deleteCommission(selectItem.id, this.user.id).subscribe(
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
