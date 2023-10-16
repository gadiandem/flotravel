import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

import { SearchFormThingToDoComponent } from 'src/app/dashboard/search-form-thing-to-do/search-form-thing-to-do.component';
import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import * as fromApp from '../../store/app.reducer';
import { thingToDoConstant } from '../thing-to-do.constant';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
@Component({
  selector: 'app-search-dialogs',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css']
})
export class SearchTourDialogComponent extends SearchFormThingToDoComponent implements OnInit {

  startTime: Date;
  endTime: Date;
  public event: EventEmitter<TourShoppingRQ> = new EventEmitter();

  constructor(protected router: Router,
    protected dashboardService: DashboardService,
     protected datepipe: DatePipe, protected bsModalRef: BsModalRef,
    protected store: Store<fromApp.AppState>) {
    super(router,dashboardService, datepipe, store);
    super.ngOnInit();
  }

  ngOnInit() {
    (this.searchForm.get('destination') as FormControl).setValue(this.searchTourReq.destination);
    this.startTime = new Date(this.searchTourReq.startTime);
    this.endTime = new Date(this.searchTourReq.endTime);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    // console.log('Form Submitted with value: ', this.searchForm.value);
    this.searchTour();
    this.bsModalRef.hide();
  }
  searchTour() {
    const d: any = this.searchForm.value;
    this.searchTourReq.destination = d.destination;
    this.searchTourReq.startTime = this.datepipe.transform(this.startTime, 'yyyy-MM-dd');
    this.searchTourReq.endTime = this.datepipe.transform(this.endTime, 'yyyy-MM-dd');
    sessionStorage.setItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST, JSON.stringify(this.searchTourReq));
    this.event.emit(this.searchTourReq);
  }
}
