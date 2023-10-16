import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { CreateBankReq } from "src/app/model/wallet/bank-account/create-bank-req";
import { BankAccountService } from "src/app/service/wallet/bankAccount.service";
import { AlertifyService } from "src/app/service/alertify.service";
import { BankModel } from "src/app/model/wallet/bank-account/bank-model";
@Component({
  selector: 'app-delete-bank',
  templateUrl: './delete-bank.component.html',
  styleUrls: ['./delete-bank.component.css']
})
export class DeleteBankComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  addBankForm: FormGroup;
  
  deleteBankId: string
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private bankAccountService: BankAccountService
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.activeRoute.params.subscribe((params: Params) => {
      this.deleteBankId = params['bankId'];
      console.log('Delete Bank: ' + this.deleteBankId);
        // this.bankAccountService.deleteBank(this.deleteBankId).subscribe(
        //   (res: any) => {
        //     this.alertify.success(`Delete Bank: ${res.bankName} successful:!!!`);
        //   }, e => {
        //     // this.alertify.error(`Delete Bank Error`);
        //     this.alertify.error(`This feature currenctly not support!`);
        //   }
        // );
    });
  }

  cancel() {
    this._location.back();
  }

  deleteBank() {
    this.alertify.confirm('Do you really want to delete this bank?', () => {
      this.bankAccountService.deleteBank(this.deleteBankId).subscribe(
        (res: any) => {
          this.alertify.success(`Delete Bank: ${res.bankName} successful:!!!`);
        }, e => {
          // this.alertify.error(`Delete Bank Error`);
          this.alertify.error(`This feature currenctly not supported!`);
        }
      );
    });
  }
}
