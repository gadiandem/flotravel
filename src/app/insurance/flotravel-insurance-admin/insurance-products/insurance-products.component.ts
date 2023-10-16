import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { appConstant } from 'src/app/app.constant';

import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { InsuranceHistoryListRequest } from 'src/app/model/insurance/history/insurance-history-list-request';
import { InsuranceHistoryListRes } from 'src/app/model/insurance/history/insurance-history-list-res';
import { FlocashPaymentInsurance } from 'src/app/model/insurance/subscription-policy/response/flocash-payment.insurance';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { AlertifyService } from 'src/app/service/alertify.service';
import { InsuranceService } from 'src/app/service/insurance/insurance.service';
import * as fromApp from 'src/app/store/app.reducer';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';
import { UserService } from 'src/app/service/admin/user/user.service';
import { User } from 'src/app/model/auth/user/user';
import { InsurancePackageType } from 'src/app/model/insurance/package-type/insurance.package';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';
import { FloInsuranceProducts } from 'src/app/model/insurance/flo_insurance_products';
import { demoFlightData } from 'src/app/flight/flight.constant';


@Component({
  selector: 'app-insurance-products',
  templateUrl: './insurance-products.component.html',
  styleUrls: ['./insurance-products.component.css']
})
export class InsuranceProductsComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public packageListView: FloInsuranceProducts[];
  public mySelection: string[] = [];
  user: UserDetail;
  searchForm: FormGroup;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  endDate: string;
  fetching = false;
  fetchFailed = false;
  currency:string;
  p: any;


  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private userManage: UserService,
    private alertify: AlertifyService,
    private insuranceService: InsuranceService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    
    this.getProductList();
  }

  private initForm() {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
    });
  }

  getProductList(){
    this.fetching = true;
    this.insuranceService.getInsurancePackageList().subscribe(
      data=>{
        this.packageListView = data;
        this.currency = this.packageListView[0].packageCurrency || 'EUR';
        this.fetching = false;
      }
    );
    
  }

  createProduct(){
    this.router.navigate(['/insurance/create']);
  }
  countryAvailabilityList(){
    this.router.navigate(['/insurance/countries']);
  }

  viewDetail(insuranceDetail: PaymentTour) {
    this.router.navigate(['/insurance/admin/', insuranceDetail.id]);
    sessionStorage.setItem(insuranceConstant.HISTORY_INSURANCE_SELECTED, JSON.stringify(insuranceDetail));
  // console.log(JSON.stringify(insuranceDetail));
  }

  deleteRecord(insuranceItem: PaymentTour) {
    this.alertify.confirm('Are you sure you want to delete this Record?', () => {
      this.insuranceService.deleteInsuranceProduct(insuranceItem.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getProductList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  getFromDate(data: NgbDate) {
    this.fromDate = data;
  }

  getToDate(data: NgbDate) {
    this.toDate = data;
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }
 

}