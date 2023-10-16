import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { MerchantSettingRes } from 'src/app/model/wallet/merchant-setting/merchant-setting-res';

import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
@Component({
  selector: 'app-e-commerce-setting',
  templateUrl: './e-commerce-setting.component.html',
  styleUrls: ['./e-commerce-setting.component.css']
})
export class ECommerceSettingComponent implements OnInit {
  isCollapsed: boolean;

  editMode: boolean;
  account: UserDetail;
  initialLoadData = true;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  merchantSettingRes: MerchantSettingRes;
  needUpdateSetting: boolean;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.editMode = false;
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });

    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.merchantSettingRes = data.merchantSettingRes;
      // console.log(this.merchantSettingRes.merchantSetting);
      // if(this.merchantSettingRes && 
      //   (!this.merchantSettingRes.merchantSetting 
      //   || !this.merchantSettingRes.merchantSetting.merchantName)){
      //   this.needUpdateSetting = true;
      // } else {
      //   this.needUpdateSetting = false;
      // }
      this.refreshData();
    })
  }

  refreshData(){
    if(this.initialLoadData){
      if(!this.merchantSettingRes){
        this.getMerchantSetting();
      }
    }
    this.initialLoadData = false;
  }

  getMerchantSetting(){
    this.store.dispatch( new WalletActions.GetMerchantSettingStart({ userId: this.account.id }));
  }

  gotoEdit(){
    this.editMode = true;
  }

  closeEditMode(){
    this.editMode = false;
  }
}
