import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { SearchFormHotelComponent } from 'src/app/dashboard/search-form-hotel/search-form-hotel.component';
import * as fromApp from '../../../store/app.reducer';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
@Component({
  selector: 'app-search-dialogs',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent extends SearchFormHotelComponent implements OnInit {

  checkin_date: Date;
  checkout_date: Date;
  public event: EventEmitter<HotelShoppingReq> = new EventEmitter();

  constructor(protected router: Router, protected dashboardService: DashboardService,
    public datepipe: DatePipe,
    public bsModalRef: BsModalRef,
    public store: Store<fromApp.AppState>) {
    super(router, dashboardService, datepipe, store);
    super.ngOnInit();
  }

  ngOnInit() {
  }
  get roomsControls() {
    return (this.searchForm.get('rooms') as FormArray).controls;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    this.searchHotel();
    this.bsModalRef.hide();
  }
  searchHotel() {
    super.searchHotel();
  }
}
