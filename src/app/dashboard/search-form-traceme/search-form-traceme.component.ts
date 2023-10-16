import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap';

import * as TracemeActions from '../../traceme/store/traceme.actions';
import * as fromApp from '../../store/app.reducer';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { journeyType, tracemeConstant } from 'src/app/traceme/traceme.constant';

@Component({
  selector: 'app-search-form-traceme',
  templateUrl: './search-form-traceme.component.html',
  styleUrls: ['./search-form-traceme.component.css']
})
export class SearchFormTracemeComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;

  searchForm: FormGroup;
  journey: string;
  journeyIndex: number;
  journeyLabel: string;
  searchData: TraceMeShoppingReq;
  minDate = new Date();
  formSubmitError: boolean;
  constructor(protected datepipe: DatePipe,
    protected router: Router,
    protected store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.journeyIndex = 1;
    this.journey = journeyType.ONE_WAY;
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: this.minDate,
        showWeekNumbers: false,
      }
    );
    this.initForm();
    this.journeyChange();
  }

  private initForm() {
    this.searchForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      luggageCount: new FormControl(1, Validators.required),
    });
  }

  journeyChange(type?: number) {
    switch (type) {
      case 1:
        this.journey = journeyType.ONE_WAY;
        this.journeyLabel = 'ONE_WAY';
        this.journeyIndex = 1;
        break; // one way
      case 2:
        this.journey = journeyType.ROUND_TRIP;
        this.journeyLabel = 'ROUND_TRIP';
        this.journeyIndex = 2;
        break; // roundtrip
      case 3:
        this.journey = journeyType.MULTI_CITY;
        this.journeyLabel = 'MULTI_CITY';
        this.journeyIndex = 3;
        break; // multi city
      default:
        this.journey = journeyType.ONE_WAY;
        this.journeyLabel = 'ONE_WAY';
        this.journeyIndex = 1;
    }
  }

  onValueChange(value: Date): void {
    (this.searchForm.get('startDate') as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
    this.bsConfig = Object.assign({}, {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }
  searchTraceme() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const  traceMeShopping: TraceMeShoppingReq = new TraceMeShoppingReq();
      traceMeShopping.journey = this.journey;
      traceMeShopping.startDate = this.datepipe.transform(d.startDate, 'yyyy-MM-dd');
      traceMeShopping.endDate = this.datepipe.transform(d.endDate, 'yyyy-MM-dd');
      traceMeShopping.luggageCount = +d.luggageCount;
      sessionStorage.setItem(tracemeConstant.TRACEME_LIST_REQ, JSON.stringify(traceMeShopping));
      sessionStorage.setItem(tracemeConstant.JOURNEY_LABLE, this.journeyLabel);

      this.store.dispatch(new TracemeActions.SearchTracemeStart(
        { data: traceMeShopping }));
      this.router.navigate(['/traceme']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
