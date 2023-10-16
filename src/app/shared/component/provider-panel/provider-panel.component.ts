import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AlertifyService } from 'src/app/service/alertify.service';
import { FlotravelProvider } from "src/app/model/auth/provider/flotravel-provider";
import { CardInfo } from 'src/app/model/flocash/card-info';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: "app-provider-panel",
  templateUrl: "./provider-panel.component.html",
  styleUrls: ["./provider-panel.component.css"],
})
export class ProviderPanelComponent implements OnInit {
  messages: any = {
    validDate: "valid\ndate",
    monthYear: "mm/yyyy",
  };
  placeholders: any = {
    number: "•••• •••• •••• ••••",
    name: "Full Name",
    expiry: "••/••",
    cvc: "•••",
  };
  currencies: CurrencyNewRes[];

  masks: any;
  cardPaymentForm: FormGroup;
  providerForm: FormGroup;
  formSubmitError;
  editProvider: FlotravelProvider;
  event: EventEmitter<FlotravelProvider> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public bsModalRef: BsModalRef,) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    if (this.editProvider) {
      this.updateProviderEditForm(this.editProvider);
    } else {
      this.editProvider = new FlotravelProvider();
    }
  }
  initForm() {
    this.providerForm = this.fb.group({
      code: ["", [Validators.required]],
      type: ["", Validators.required],
      name: ["", Validators.required],
      transactionType: ["", Validators.required],
      currency: ["", Validators.required]
    });

    this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", Validators.required],
      cvv: ["", Validators.required],
    });
  }

  updateProviderEditForm(provider: FlotravelProvider) {
    this.providerForm.patchValue({
      code: provider.code,
      type: provider.type,
      name: provider.name,
      transactionType: provider.transactionType,
      currency: provider.currency
    });
    if(provider.cardInfo){
      this.cardPaymentForm.patchValue({
        cardNo: provider.cardInfo.cardNumber,
        cardName: provider.cardInfo.cardHolder,
        expiry: `${provider.cardInfo.expireMonth} / ${provider.cardInfo.expireYear}`,
        cvv: provider.cardInfo.cvv
      });
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    this.saveProvider();
  }

  saveProvider() {
    if (this.providerForm.valid && this.cardPaymentForm.valid) {
      const d = this.providerForm.value;
      const provider: FlotravelProvider = new FlotravelProvider();
      if(this.editProvider){
        provider.id = this.editProvider.id;
      }
      provider.code = d.code;
      provider.type = d.type;
      provider.name = d.name;
      provider.transactionType = +d.transactionType;
      provider.currency = d.currency;
      const card = this.cardPaymentForm.value;
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = card.cardName;
      cardInfo.cardNumber = card.cardNo.replace(/ /g, "");
      const month_year: string[] = card.expiry.split(" / ");
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = card.cvv;
      provider.cardInfo = cardInfo;
      this.event.emit(provider);
      this.bsModalRef.hide();
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
