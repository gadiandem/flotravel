import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-withdraw-choose-card',
  templateUrl: './withdraw-choose-card.component.html',
  styleUrls: ['./withdraw-choose-card.component.css']
})
export class WithdrawChooseCardComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  withdrawForm: FormGroup;
  constructor( private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
  }

  initForm(){
    this.withdrawForm = this.fb.group({
      withdrawType: ["BANK", Validators.required],
    });
  }

  cancel(){
    this._location.back();
  }

  next(){
    const d = this.withdrawForm.value;
    if(d.withdrawType === WithDrawType.BANK){
      this.route.navigate(["../addBank"], { relativeTo: this.activeRoute });
    } else {
      this.route.navigate(["../addCard"], { relativeTo: this.activeRoute });
    }
  }
}

enum WithDrawType {
  BANK = 'BANK',
  CARD = 'CARD'
}
