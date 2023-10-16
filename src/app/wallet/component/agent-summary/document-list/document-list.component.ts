import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from "@angular/common";

import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { STATUS } from '../../../wallet.constant';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import { DocumentList } from 'src/app/model/wallet/kyc/document-list.res';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  isCollapsed: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  account: UserDetail;

  initialLoadData = true;
  documentList: DocumentList;
  constructor(private store: Store<fromApp.AppState>,
    private _location: Location,
    private walletKycService: WalletKycService) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
  //   this.store.select('wallet').subscribe(data => {
  //     this.fetching = data.loading;
  //     this.fetchFailed = data.failure;
  //     this.errorMes = data.errorMessage;
  //     this.fetchNewData();
  //   })
  this.getDocumentList();
  }

  getDocumentList(){
  this.fetching = true;
  this.fetchFailed = false;
    this.walletKycService.fetchListkyc(this.account.id).subscribe(
      (res: DocumentList) => {
        this.documentList = res;
        this.fetching = false;
        this.fetchFailed = false;
      }, e => {
        this.errorMes = e.error;
        this.fetching = false;
        this.fetchFailed = true;
      }
    )
  }

  fetchNewData(){
    if(this.initialLoadData){
     
    }
    this.initialLoadData = false;
  }

  refresh(){
    this.getProfile();
  }

  getProfile(){
    this.store.dispatch( new WalletActions.GetMerchantProfileStart({ userId: this.account.id }));
  }
}
