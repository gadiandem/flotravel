import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap';

import { SearchFormTracemeComponent } from 'src/app/dashboard/search-form-traceme/search-form-traceme.component';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import * as fromApp from '../../store/app.reducer';
import { journeyType, tracemeConstant } from '../traceme.constant';

@Component({
  selector: 'app-traceme-search-dialogs',
  templateUrl: './traceme-search-dialog.component.html',
  styleUrls: ['./traceme-search-dialog.component.css']
})
export class TracemeSearchDialogComponent extends SearchFormTracemeComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();

  constructor(protected datepipe: DatePipe,
    protected router: Router,
    protected store: Store<fromApp.AppState>,
    public bsModalRef: BsModalRef,) {
    super(datepipe, router, store);
    // super.ngOnInit();
  }

  ngOnInit() {
    this.initFormDialog();
    this.journeyLabel = sessionStorage.getItem(tracemeConstant.JOURNEY_LABLE);
    // (this.searchForm.get('journey') as FormControl).setValue(new Date(this.searchData.journey));
    (this.searchForm.get('startDate') as FormControl).setValue(new Date(this.searchData.startDate));
    (this.searchForm.get('endDate') as FormControl).setValue(new Date(this.searchData.endDate));
    (this.searchForm.get('luggageCount') as FormControl).setValue(this.searchData.luggageCount);
  }

  initFormDialog() {
    this.searchForm = new FormGroup({
      startDate: new FormControl("", [Validators.required]),
      endDate: new FormControl("", [Validators.required]),
      luggageCount: new FormControl(1, Validators.required),
    });
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    // console.log('Form Submitted with value: ', this.searchForm.value);
    this.searchTraceme();
    this.bsModalRef.hide();
  }
  searchTraceme() {
    const d: any = this.searchForm.value;
    const  traceMeShopping: TraceMeShoppingReq = new TraceMeShoppingReq();
    traceMeShopping.startDate = this.datepipe.transform(d.startDate, 'yyyy-MM-dd');
    traceMeShopping.endDate = this.datepipe.transform(d.endDate, 'yyyy-MM-dd');
    traceMeShopping.luggageCount = d.luggageCount;
    traceMeShopping.journey = this.journey || journeyType.ONE_WAY;
    sessionStorage.setItem(tracemeConstant.TRACEME_LIST_REQ, JSON.stringify(traceMeShopping));
    sessionStorage.setItem(tracemeConstant.JOURNEY_LABLE, this.journeyLabel);
    this.event.emit(traceMeShopping);
    this.bsModalRef.hide();
  }
}
