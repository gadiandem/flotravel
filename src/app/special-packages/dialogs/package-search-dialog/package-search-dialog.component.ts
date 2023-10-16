import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import * as fromApp from '../../../store/app.reducer';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { SearchFormSpecialPackagesComponent } from 'src/app/dashboard/search-form-special-packages/search-form-special-packages.component';

@Component({
  selector: 'app-package-search-dialogs',
  templateUrl: './package-search-dialog.component.html',
  styleUrls: ['./package-search-dialog.component.css']
})
export class SpecialPackageSearchDialogComponent extends SearchFormSpecialPackagesComponent implements OnInit {

  checkin_date: Date;
  checkout_date: Date;

  searchRequest: PackageShoppingReq;
  public event: EventEmitter<PackageShoppingReq> = new EventEmitter();

  constructor(protected router: Router, protected dashboardService: DashboardService,
    public datepipe: DatePipe,
    public bsModalRef: BsModalRef,
    public store: Store<fromApp.AppState>) {
    super(router, datepipe, dashboardService, store);
    super.ngOnInit();
  }

  ngOnInit() {
    this.search = this.searchRequest.destination;
    (this.searchForm.get('destination') as FormControl).patchValue(this.searchRequest.destination);
    (this.searchForm.get('startDate') as FormControl).patchValue(new Date(this.searchRequest.date));
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    this.searchPackages();
    this.bsModalRef.hide();
  }
  searchPackages() {
    super.searchPackages();
  }
}
