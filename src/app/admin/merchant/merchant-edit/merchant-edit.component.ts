import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { appConstant } from 'src/app/app.constant';
import { MerchantModel } from 'src/app/model/auth/merchant/merchant-model';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { MerchantService } from 'src/app/service/admin/merchant/merchant.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-merchant-edit',
  templateUrl: './merchant-edit.component.html',
  styleUrls: ['./merchant-edit.component.css']
})
export class MerchantEditComponent implements OnInit {
  merchantForm: FormGroup;
  merchant: MerchantModel;
  account: UserDetail;
  merchantId: string;
  isLoading: boolean;
  subscription: Subscription;
  formSubmitError: boolean;

  constructor(private route: Router,
    private activeRoute: ActivatedRoute,
    private merchantService: MerchantService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.merchant = new MerchantModel();
    this.activeRoute.params.subscribe((params: Params) => {
      this.merchantId = params['merchantId'];
      // if(this.merchantId){
      //   this.getMerchant();
      // }
    });
    this.store.select('auth').subscribe(authState => {
      // this.isLoading = authState.loading;
      // this.error = authState.authError;
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
      this.getMerchant();
    });
    this.initForm();
  }
  private initForm() {
    this.merchantForm = this.fb.group({
      merchantAccount: ['', Validators.required],
      profileImg: ['', Validators.required],
      currency: ['', Validators.required],
      vcnAgentAccount: ['', Validators.required],
      vcnAgentPassword: ['', [Validators.required]],
      apiAccount: ['', Validators.required],
      apiPassword: ['', Validators.required],
      generateCard: [true, Validators.required],
      demo: [true, Validators.required],
    });
  }

  getMerchant(){
    this.subscription = this.merchantService.getMerchantDetail(this.account.id, this.merchantId).subscribe(
      (res: MerchantModel) => {
        this.merchant = res;
        if (res.id != null) {
          sessionStorage.setItem('userDetail', JSON.stringify(res));
          // this.alertify.success(`Fetch User ${res.name} detail succeeful:`);
          this.updateFormWithData();
        }
      }, e => {
        console.log(e);
      }
    );
  }
  private updateFormWithData() {
    this.merchantForm.patchValue({
      merchantAccount: this.merchant.merchantAccount,
      profileImg: this.merchant.profileImg,
      currency: this.merchant.currency,
      vcnAgentAccount: this.merchant.vcnAgentAccount,
      vcnAgentPassword: this.merchant.vcnAgentPassword,
      apiAccount: this.merchant.apiAccount,
      apiPassword: this.merchant.apiPassword,
      generateCard: this.merchant.generateCard,
      demo: this.merchant.demo,
    });
  }
  updateMerchant() {
    if (this.merchantForm.valid) {
      const d = this.merchantForm.value;
      const merchantCreate: MerchantModel = new MerchantModel();
      merchantCreate.id = this.merchantId;
      merchantCreate.merchantAccount = d.merchantAccount;
      merchantCreate.profileImg = d.profileImg;
      merchantCreate.currency = d.currency;
      merchantCreate.vcnAgentAccount = d.vcnAgentAccount;
      merchantCreate.vcnAgentPassword = d.vcnAgentPassword;
      merchantCreate.apiAccount = d.apiAccount;
      merchantCreate.apiPassword = d.apiPassword;
      merchantCreate.generateCard = d.generateCard;
      merchantCreate.demo = d.demo;

      this.merchantService.editMerchant(merchantCreate, this.account.id).subscribe(
        (res: MerchantModel) => {
          this.alertify.success(`Create ${res.merchantAccount} user succeeful!`);
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }, () => {
          this.route.navigate(['/admin/merchants']);
        }
      );

    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
