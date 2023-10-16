import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { AccountSummary } from 'src/app/model/wallet/summary/account-summary';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { STATUS } from '../../../wallet.constant';

import { AlertifyService } from 'src/app/service/alertify.service';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import { UploadKycReq } from 'src/app/model/wallet/kyc/upload-kyc-req';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-verify-address',
  templateUrl: './verify-address.component.html',
  styleUrls: ['./verify-address.component.css']
})
export class VerifyAddressComponent implements OnInit {
  isCollapsed: boolean;

  account: UserDetail;
  initialLoadData = true;
  
  formSubmitError: boolean;
  uploadDocumentForm: FormGroup;
  constructor(private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private _location: Location,
    private walletKycService: WalletKycService,
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
  }
  
  upload() {
    this.route.navigate(["../uploadDocument"], { relativeTo: this.activeRoute });
  }
  cancel(){
    this._location.back();
  }
}
