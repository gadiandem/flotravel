import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { InsurancePackageType } from "src/app/model/insurance/package-type/insurance.package";

import { SearchQouteRequest } from "src/app/model/insurance/search-quote.request";
import { InsuranceService } from "src/app/service/insurance/insurance.service";
import * as InsuranceActions from "../../insurance/store/insurance.actions";
import * as fromApp from "../../store/app.reducer";
import { insuranceConstant } from "../insurance.constant";
import { QuoteRequestData } from "../mock/quoteRequest";
import {appDefaultData} from '../../app.constant';
@Component({
  selector: "app-insurance-detail",
  templateUrl: "./insurance-detail.component.html",
  styleUrls: ["./insurance-detail.component.css"],
})
export class InsuranceDetailComponent implements OnInit {
  formSubmitError: boolean;
  searchForm: FormGroup;
  searchQuoteForm: SearchQouteRequest;
  selectedInsuranceType: InsurancePackageType;
  checkin_date: Date;
  checkout_date: Date;
  currency: string;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata: boolean = true;
  packageId: string;
  constructor(
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.formSubmitError = false;
    this.checkin_date = new Date();
    this.checkout_date = this.addDays(new Date(), 1);
    this.initForm();
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.packageId = params["packageId"];
    });
    this.store.select("insuranceList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.selectedInsuranceType = data.selectedPackage;
      if (this.selectedInsuranceType == null) {
        this.selectedInsuranceType = JSON.parse(
          sessionStorage.getItem(insuranceConstant.PACKAGE_SELECTED)
        );
        if (this.selectedInsuranceType == null) {
          if (this.tryFetchdata) {
            this.fetchInsuranceDetail();
          }
          this.tryFetchdata = false;
        }
      }
      this.refeshData();
    });
  }

  private initForm() {
    this.searchForm = new FormGroup({
      residenceCountry: new FormControl("", Validators.required),
      countryOfTravel: new FormControl("", Validators.required),
      productCriteriaCode: new FormControl("", Validators.required),
      productCriteriaVersion: new FormControl("", Validators.required),
      productCriteriaCategory: new FormControl("", Validators.required),
      productCriteriaSubCategory: new FormControl("", Validators.required),
      bookingDate: new FormControl("", Validators.required),
      checkin_date: new FormControl(this.checkin_date, Validators.required),
      checkout_date: new FormControl(this.checkout_date, Validators.required),
      adults: new FormControl(1, Validators.required),
      children: new FormControl(0, Validators.required),
      infants: new FormControl(0, Validators.required),
    });
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  refeshData() {
    // this.searchQuoteForm = new QuoteRequestData().initialQuoteRequest();
    if (this.selectedInsuranceType) {
      this.currency = this.selectedInsuranceType.currency;
    }
    this.updateSearchForm();
  }

  fetchInsuranceDetail() {
    this.store.dispatch(
      new InsuranceActions.FetchInsuranceDetailStart({
        packageId: this.packageId, data: this.searchQuoteForm
      })
    );
  }

  updateSearchForm() {
    this.searchForm.patchValue({
      residenceCountry: this.searchQuoteForm.residenceCountry,
      countryOfTravel: this.searchQuoteForm.countryOfTravel,
      // productCriteriaCode: this.searchQuoteForm.productCriteriaCategory,
      // productCriteriaVersion: this.searchQuoteForm.productCriteriaVersion,
      // productCriteriaCategory: this.searchQuoteForm.productCriteriaCategory,
      // productCriteriaSubCategory: this.searchQuoteForm
      //   .productCriteriaSubCategory,
      // bookingDate: this.searchQuoteForm.bookingDate,
      checkin_date: this.searchQuoteForm.startDate,
      checkout_date: this.searchQuoteForm.endDate,
      adults: this.searchQuoteForm.travellers.adt,
      children: this.searchQuoteForm.travellers.chd,
      infants: this.searchQuoteForm.travellers.inf,
    });
  }
  searchQoute() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      this.searchQuoteForm.residenceCountry = d.residenceCountry;
      this.searchQuoteForm.countryOfTravel = d.countryOfTravel;
      this.searchQuoteForm.startDate = this.datepipe.transform(
        this.checkin_date,
        "yyyy-MM-dd"
      );
      this.searchQuoteForm.endDate = this.datepipe.transform(
        this.checkout_date,
        "yyyy-MM-dd"
      );
      this.searchQuoteForm.travellers.adt = +d.adults;
      this.searchQuoteForm.travellers.chd = +d.children;
      this.searchQuoteForm.travellers.inf = +d.infants;
      this.searchQuoteForm.price = this.selectedInsuranceType.price;
      // this.searchQuoteForm.currency = this.selectedInsuranceType.currency;
      sessionStorage.setItem(
        insuranceConstant.QUOTE_SEARCH_FORM,
        JSON.stringify(this.searchQuoteForm)
      );
      if(this.searchQuoteForm.countryOfTravel =='Kenya'){
      const expirationDate = sessionStorage.getItem(insuranceConstant.AXA_TOKEN_EXPIRE_TIME);
      this.store.dispatch(new InsuranceActions.AuthAxaStart({ data: expirationDate }));
    } else{
       // this.insuranceService.delegateGetQuote(this.searchQuoteForm);
       this.searchQuoteForm.packageId = this.selectedInsuranceType.id;
        this.store.dispatch(new InsuranceActions.QouteListStart({ data: this.searchQuoteForm }));
    }
      this.router.navigate(["../../quoteList"], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
