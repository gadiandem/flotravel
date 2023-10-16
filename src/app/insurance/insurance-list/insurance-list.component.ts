import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Store } from '@ngrx/store';

import { SearchInsurancePackageReq } from 'src/app/model/insurance/search-insurance-package.req';
import { InsuranceSearchDialogComponent } from '../insurance-search-dialog/insurance-search-dialog.component';
import * as InsuranceActions from '../store/insurance.actions';
import * as fromApp from '../../store/app.reducer';
import { InsurancePackageType } from 'src/app/model/insurance/package-type/insurance.package';
import { insuranceConstant } from '../insurance.constant';
import { appConstant } from 'src/app/app.constant';
import { SearchQouteRequest } from 'src/app/model/insurance/search-quote.request';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.css']
})
export class InsuranceListComponent implements OnInit {
  searchForm: FormGroup;

  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  city: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  currency: string;
  searchInsuranceForm: SearchInsurancePackageReq;
  searchListResult: InsurancePackageType[];
  packageListView: InsurancePackageType[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata: boolean = true;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  p: any;

  constructor(private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService,
    private alertify: AlertifyService) { }

    ngOnInit() {
      this.initForm();
      this.bsConfig = new ModalOptions();
      this.searchListResult = [];
      this.currency = localStorage.getItem(appConstant.CURRENCY) || 'USD',
      // this.refeshData();
      this.store.select('insuranceList').subscribe((data) => {
        JSON.parse(JSON.stringify(data));
        this.packageListView = JSON.parse(sessionStorage.getItem(insuranceConstant.PACKAGE_LIST));
        this.searchInsuranceForm = data.searchInsuranceForm || JSON.parse(sessionStorage.getItem(insuranceConstant.SEARCH_PACKAGE_FORM));
        if (!this.searchInsuranceForm) {
          this.route.navigate(['/']);
        }
        this.fetching = data.loading;
        this.fetchFailed = data.failure;
        this.errorMes = data.errorMessage;
        JSON.parse(JSON.stringify(data.searchInsurancePackageListResult));
        if (data.searchInsurancePackageListResult.length > 0) {
          this.searchListResult = data.searchInsurancePackageListResult;
          this.packageListView = [...data.searchInsurancePackageListResult];
          this.currency = this.searchListResult[0].currency;
        } else {
          if(this.tryFetchdata){
            this.fetchInsuranceList();
          }
          this.tryFetchdata = false;
        }
        // this.refeshData();
      });
      // this.fetchInsuranceList();
    }
  

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl()
    });
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case "priceIncrease":
        this.increaseSort(this.packageListView);
        break;
      case "priceDecrease":
        this.decreaseSort(this.packageListView);
        break;
      case "popularity":
        // this.ratingStar.threeStar++;
        this.alertify.warning(`Popularity currently not support`);
        break;
      case "new":
        this.alertify.warning(`Newest currently not support`);
        break;
      case "rating":
        this.ratingSort(this.packageListView);
        break;
    }
  }
  increaseSort(insuranceList: InsurancePackageType[]) {
    this.packageListView = insuranceList.sort((a, b) =>
      a.price > b.price ? 1 : -1
    );
  }

  decreaseSort(insuranceList: InsurancePackageType[]) {
    this.packageListView = insuranceList.sort((a, b) =>
      a.price < b.price ? 1 : -1
    );
  }

  ratingSort(insuranceList: InsurancePackageType[]) {
    this.packageListView = insuranceList.sort((a, b) =>
      a.rating < b.rating ? 1 : -1
    );
  }
  // refeshData() {
  //   if (!this.searchInsuranceForm) {
  //     this.adultCount = this.searchInsuranceForm.adults;
  //     this.childCount = this.searchInsuranceForm.children;
  //     this.infantCount = this.searchInsuranceForm.infants;
  //   } else {
  //     this.adultCount = 1;
  //     this.childCount = 0;
  //     this.infantCount = 0;
  //   }
  // }

  openModalWithComponent() {
    const initialState = {
      searchData: Object.assign({}, this.searchInsuranceForm),
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(InsuranceSearchDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      this.searchInsuranceForm = res;
      // this.refeshData();
      this.fetchInsuranceList();
    });
  }

  fetchInsuranceList() {
    this.store.dispatch(new InsuranceActions.SearchInsurancePackageListStart({ data: this.searchInsuranceForm }));
  }

  goToDetail(selectedTypeId: string) {
    let selectedType: InsurancePackageType = this.searchListResult.find((item) => item.id === selectedTypeId);
    sessionStorage.setItem(insuranceConstant.PACKAGE_SELECTED, JSON.stringify(selectedType));
    const searchQuoteForm: SearchQouteRequest = new SearchQouteRequest(this.searchInsuranceForm);
    searchQuoteForm.price = selectedType.price;
    searchQuoteForm.currency = this.currency;
    searchQuoteForm.packageId = selectedTypeId;
    sessionStorage.setItem(insuranceConstant.QUOTE_SEARCH_FORM, JSON.stringify(searchQuoteForm));
    if(searchQuoteForm.countryOfTravel =='KE'){
     const expirationDate = sessionStorage.getItem(insuranceConstant.AXA_TOKEN_EXPIRE_TIME);
      this.store.dispatch(new InsuranceActions.AuthAxaStart({ data: expirationDate }));
    }else{
      this.store.dispatch(new InsuranceActions.FetchInsuranceDetailStart({ packageId: selectedTypeId,data: searchQuoteForm })); 
    }
    this.route.navigate(['../quoteList'], { relativeTo: this.activatedRoute });
  }
}
