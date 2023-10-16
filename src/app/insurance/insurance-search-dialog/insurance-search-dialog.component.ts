import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { SearchFormInsuranceComponent } from 'src/app/dashboard/search-form-insurance/search-form-insurance.component';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { SearchCountryService } from 'src/app/service/search-country.service';
import * as fromApp from '../../store/app.reducer';
import { insuranceConstant } from '../insurance.constant';

@Component({
  selector: 'app-insurance-search-dialogs',
  templateUrl: './insurance-search-dialog.component.html',
  styleUrls: ['./insurance-search-dialog.component.css']
})
export class InsuranceSearchDialogComponent extends SearchFormInsuranceComponent implements OnInit {
  checkin_date: Date;
  checkout_date: Date;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(protected router: Router,
    protected dashboardService: DashboardService,
    public searchCountry: SearchCountryService,
    public datepipe: DatePipe,
    public bsModalRef: BsModalRef,
    public store: Store<fromApp.AppState>) {
    super(router, datepipe,searchCountry, store);
    super.ngOnInit();
  }

  ngOnInit() {
    (this.searchForm.get('residenceCountry') as FormControl).setValue(this.searchData.residenceCountry);
    (this.searchForm.get('countryOfTravel') as FormControl).setValue(this.searchData.countryOfTravel);
    (this.searchForm.get('checkin_date') as FormControl).setValue(new Date(this.searchData.startDate));
    (this.searchForm.get('checkout_date') as FormControl).setValue(new Date(this.searchData.endDate));
    this.checkin_date = new Date(this.searchData.startDate);
    this.checkout_date = new Date(this.searchData.endDate);
  }

  // get roomsControls() {
  //   return (this.searchForm.get('rooms') as FormArray).controls;
  // }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    // console.log('Form Submitted with value: ', this.searchForm.value);
    this.searchInsurance();
    this.bsModalRef.hide();
  }
  searchInsurance() {
    const d: any = this.searchForm.value;
    this.searchData.startDate = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
    this.searchData.endDate = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
    this.searchData.travellers.adt = +d.adults;
    this.searchData.travellers.chd = +d.children;
    this.searchData.travellers.inf = +d.infants;
    this.event.emit(this.searchData);
    sessionStorage.setItem(insuranceConstant.SEARCH_PACKAGE_FORM, JSON.stringify(this.searchData));
    this.bsModalRef.hide();
  }
}
