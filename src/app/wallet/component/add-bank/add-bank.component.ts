import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from '@ngrx/store';

import { CreateBankReq } from "src/app/model/wallet/bank-account/create-bank-req";
import { BankAccountService } from "src/app/service/wallet/bankAccount.service";
import { AlertifyService } from "src/app/service/alertify.service";
import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
import * as fromApp from 'src/app/store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
@Component({
  selector: "app-add-bank",
  templateUrl: "./add-bank.component.html",
  styleUrls: ["./add-bank.component.css"],
})
export class AddBankComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  addBankForm: FormGroup;

  account: UserDetail;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private bankAccountService: BankAccountService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    this.initForm();
  }

  initForm() {
    this.addBankForm = this.fb.group({
      bankName: ["", Validators.required],
      swiftSortcode: ["", Validators.required],
      accountNumber: ["", Validators.required],
      accountName: ["", Validators.required],
    });
  }

  cancel() {
    this._location.back();
  }

  addBank() {
    if (this.addBankForm.valid) {
      const d = this.addBankForm.value;
      const bankInfo = new CreateBankReq();
      bankInfo.accountHolder = d.accountName;
      bankInfo.accountNumber = d.accountNumber;
      bankInfo.swiftCode = d.swiftSortcode;
      bankInfo.bankName = d.bankName;
      this.bankAccountService.addNewBank(bankInfo, this.account.id).subscribe(
        (res: BankModel) => {
          if(res){
            this.alertify.success(`Add new Bank: ${res.bankName}:!!!`);
          } else {
            this.alertify.error(`AddBank Error`);
          }
        }, e => {
          this.alertify.error(`AddBank Error: ${e}`);
        }, () => {
          this._location.back();
        }
      )
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
