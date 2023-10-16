import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from "@angular/common";
import { AlertifyService } from 'src/app/service/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import { LoginReq } from 'src/app/model/wallet/login/login-req';
import { LoginInfoReq } from 'src/app/model/wallet/login/login-info-req';
import { LoginRes } from 'src/app/model/wallet/login/login-res';
import { WalletCredential } from 'src/app/model/auth/user/wallet-credential';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { Store } from '@ngrx/store';
import { EmailExistValidation } from 'src/app/model/wallet/email-validation';

@Component({
  selector: 'app-wallet-login',
  templateUrl: './wallet-login.component.html',
  styleUrls: ['./wallet-login.component.css']
})
export class WalletLoginComponent implements OnInit {

  loginForm: FormGroup;
  formSubmitError: boolean;
  account: UserDetail;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  constructor(private fb: FormBuilder,
    private _location: Location,
    private alertify: AlertifyService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private walletService: WalletKycService) { }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if(!this.account){
      this.errorMes = "Need login flotravel account before use wallet!";
      this.fetchFailed = true;
    } else if(this.account.walletCredential) {
      this.errorMes = `${this.account.walletCredential.errorId} - ${this.account.walletCredential.errorCode} -${this.account.walletCredential.errorMessage}`
      this.fetchFailed = true;
    }
    console.log('errorMes: ' + this.errorMes);
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ["", Validators.required],
      remmemberMe: [true],
    });
  }

  login(){
    // this.emailValidationService.emailExistValidation(this.loginForm.value.account).subscribe(
    //   (res: EmailExistValidation) => {
    //     this.alertify.success(`Email Exist: ${res.existed}`);
    //   }, e => {
    //     this.alertify.success(`Email Exist: ${e.error}`);
    //   }
    // )
    if (this.loginForm.valid && this.account) {
      this.fetchFailed = false;
      this.fetching = true;
      const d = this.loginForm.value;
      const req = new LoginReq();
      const loginInfo = new LoginInfoReq();
      loginInfo.email = d.email;
      loginInfo.password = d.password;
      req.login = loginInfo;
      this.walletService.loginWallet(req, this.account.id).subscribe(
        (res: LoginRes) => {
          if(res.login){
            this.alertify.success('Login wallet successful!')
            this.fetchFailed = false;
            const walleCredential = new WalletCredential();
            walleCredential.email = loginInfo.email;
            walleCredential.password = loginInfo.password;
            walleCredential.apiUser = res.login.apiUser;
            walleCredential.apiPassword = res.login.apiPassword;
            this.account.walletCredential = walleCredential;
            localStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.account));
            sessionStorage.clear();
            this.store.dispatch( new WalletActions.WalletInitial());
            this.route.navigate(["/wallet"], { relativeTo: this.activeRoute });
          } else {
            this.fetchFailed = true;
            this.errorMes = `${res.errorCode} - ${res.errorMessage}`;
            this.alertify.error(`${res.errorCode} - ${res.errorMessage}`)
          }
        }, e => {
          this.fetchFailed = true;
          this.errorMes = "Login wallet error!";
          this.alertify.error('Login wallet error!')
        }, () => {
          this.fetching = false;
        }
      )
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  fbLogin(){
    this.alertify.warning('This feature currently not support!')
  }

  googleLogin(){
    this.alertify.warning('This feature currently not support!')
  }

  back(){
    if(this.account){
      this._location.back();
    } else {
      this.route.navigate(["/"]);
    }
  }
}
