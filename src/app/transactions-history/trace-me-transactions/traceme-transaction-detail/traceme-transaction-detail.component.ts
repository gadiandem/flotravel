import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { Router, ActivatedRoute, Params } from "@angular/router";

import * as fromApp from "../../../store/app.reducer";
import * as TracemeActions from "../../../traceme/store/traceme.actions";
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { appConstant } from 'src/app/app.constant';
import { TracemeService } from 'src/app/service/traceme/traceme.service';
import { TraceMeHistoryListReq } from 'src/app/model/traceme/history/traceme-history-req';
@Component({
  selector: 'app-traceme-transaction-detail',
  templateUrl: './traceme-transaction-detail.component.html',
  styleUrls: ['./traceme-transaction-detail.component.css']
})
export class TracemeTransactionDetailComponent implements OnInit {
  tracemeId: string;
  tracemeDetail: FlocashPaymentTraceMe;
  currency: string;
  user: UserDetail;
  isLoading = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private tracemeService: TracemeService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    // this.tracemeDetail = JSON.parse(
    //   sessionStorage.getItem(insuranceConstant.HISTORY_INSURANCE_SELECTED)
    // );

    this.activeRoute.params.subscribe((params: Params) => {
      this.tracemeId = params["orderId"];
      const userId = this.user.id;
      if (userId != null) {
        const searchData = new TraceMeHistoryListReq();
      searchData.userId = this.user.id;
      this.isLoading = true;
        this.isLoading = true;
        this.tracemeService
          .getTracemetHistoryDetail(this.tracemeId, searchData)
          .subscribe(
            (res: FlocashPaymentTraceMe) => {
              this.tracemeDetail = res;
              // this.currency = res.currency;
              this.isLoading = false;
            },
            (e) => {
              this.isLoading = false;
            }
          );
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

}

