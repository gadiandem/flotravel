import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  cardPaymentForm: FormGroup;

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
  masks: any;
  constructor( private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
  }

  initForm(){
     this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", Validators.required],
      cvv: ["", Validators.required],
    });
  }

  cancel(){
    this._location.back();
  }

  next(){
    // this.route.navigate(["../verifyCard"], { relativeTo: this.activeRoute });
    if(this.cardPaymentForm.valid){
      // this._location.back();
      this.route.navigate(["../verifyCard"], { relativeTo: this.activeRoute });
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
