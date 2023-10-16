import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";

import { UserInfo } from "src/app/model/wallet/profile/user-info";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "src/app/service/alertify.service";
import { MerchantSetting } from "src/app/model/wallet/merchant-setting/merchant-setting";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { Store } from "@ngrx/store";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { MerchantSettingCreateReq } from "src/app/model/wallet/merchant-setting/merchant-setting-create.req";
@Component({
  selector: "app-edit-e-commerce-setting",
  templateUrl: "./edit-e-commerce-setting.component.html",
  styleUrls: ["./edit-e-commerce-setting.component.css"],
})
export class EditECommerceSettingComponent implements OnInit {
  isCollapsed: boolean;

  @Output() editMode = new EventEmitter<boolean>();
  @Input() merchantSetting: MerchantSetting;
  @Input() account: UserDetail;

  editEcommerceSettingForm: FormGroup;
  formSubmitError: boolean;
  constructor(private alertify: AlertifyService, private fb: FormBuilder,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if(this.merchantSetting) {
      this.editEcommerceSettingForm = this.fb.group({
        businessName: [this.merchantSetting.merchantName, Validators.required],
        urlReturn: [this.merchantSetting.url_return, Validators.required],
        urlCancel: [this.merchantSetting.url_cancel, Validators.required],
        urlNotify: [this.merchantSetting.url_notify, Validators.required],
        urlLogo: [this.merchantSetting.url_logo, Validators.required],
        secretKey: ["", Validators.required],
        vcnAgent: [true],
        requireOTPVcn: [true],
        autocapture: [this.merchantSetting.autocapture],
        silentReturn: [this.merchantSetting.silentReturn],
        sendMail: [this.merchantSetting.sendMail],
        twoStepMobile: [true],
        subscription: ["ECOM-01", Validators.required],
      });
    } else {
      this.editEcommerceSettingForm = this.fb.group({
        businessName: ['', Validators.required],
        urlReturn: ['', Validators.required],
        urlCancel: ['', Validators.required],
        urlNotify: ['', Validators.required],
        urlLogo: ['', Validators.required],
        secretKey: ["", Validators.required],
        vcnAgent: [true],
        requireOTPVcn: [true],
        autocapture: [false],
        silentReturn: [false],
        sendMail: [false],
        twoStepMobile: [true],
        subscription: ["ECOM-01", Validators.required],
      });
    }
    
  }

  updateSetting() {
    if (this.editEcommerceSettingForm.valid) {
      // this.alertify.warning("This feature currently not available");
      const d = this.editEcommerceSettingForm.value;
      const merchantSettingReq = new MerchantSettingCreateReq();
      const merchantSettingInfo = new MerchantSetting();
      merchantSettingInfo.merchantName = d.businessName;
      merchantSettingInfo.url_return = d.urlReturn;
      merchantSettingInfo.url_cancel = d.urlCancel;
      merchantSettingInfo.url_notify = d.urlNotify;
      merchantSettingInfo.url_logo = d.urlLogo;
      merchantSettingInfo.vcnAgent = d.vcnAgent;
      merchantSettingInfo.requireOTPVcn = d.requireOTPVcn;
      merchantSettingInfo.autocapture = d.autocapture;
      merchantSettingInfo.silentReturn = d.silentReturn;
      merchantSettingInfo.sendMail = d.sendMail;
      merchantSettingReq.merchantSetting = merchantSettingInfo;
      this.store.dispatch( new WalletActions.ChangeMerchantSettingStart({ userId: this.account.id, data: merchantSettingReq }));
      this.closeEditMode();
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  closeEditMode() {
    this.editMode.emit(true);
  }
}
