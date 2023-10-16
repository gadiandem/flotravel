import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { PaginationInstance } from "ngx-pagination";

import { SearchInsurancePackageReq } from "src/app/model/insurance/search-insurance-package.req";
import { InsuranceSearchDialogComponent } from "../insurance-search-dialog/insurance-search-dialog.component";
import * as InsuranceActions from "../store/insurance.actions";
import * as fromApp from "../../store/app.reducer";
import { QuoteResponse } from "src/app/model/insurance/quote/quote.response";
import { Product } from "src/app/model/insurance/quote/product";
import { insuranceConstant } from "../insurance.constant";
import { SearchQouteRequest } from "src/app/model/insurance/search-quote.request";
import { defaultData } from "src/app/app.constant";

@Component({
  selector: "app-quote-list",
  templateUrl: "./quote-list.component.html",
  styleUrls: ["./quote-list.component.css"],
})
export class QuoteListComponent implements OnInit {
  searchForm: FormGroup;

  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  city: string;
  // adultCount: number;
  // childCount: number;
  // infantCount: number;
  currency: string;
  searchQuoteListForm: SearchQouteRequest;
  quoteResponse: QuoteResponse;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  private initialTryGetToken = true;
  private initialTryGetQuote = true;
  public config: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;

  defaultData: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.defaultData = defaultData.noImage;
    this.initForm();
    this.bsConfig = new ModalOptions();
    this.quoteResponse = new QuoteResponse();
    this.currency = "USD",
      // this.refeshData();
      this.store.select("insuranceList").subscribe((data) => {
        // console.log('data subcribe: ' + JSON.stringify(data));
        this.searchQuoteListForm = data.searchQuoteForm ||JSON.parse(
          sessionStorage.getItem(insuranceConstant.QUOTE_SEARCH_FORM));
        this.fetching = data.loading;
        this.fetchFailed = data.failure;
        this.errorMes = data.errorMessage;
        if(this.searchQuoteListForm.countryOfTravel =='KE'){
        if (data.axaAuth) {
          if (data.qouteResponse) {
            this.quoteResponse = data.qouteResponse;
            if(data.qouteResponse){
              this.currency = data.qouteResponse.context.currency;
              sessionStorage.setItem(insuranceConstant.INSURANCE_CURRENCY, this.currency);
            }
          } else {
            if (this.initialTryGetQuote) {
              this.fetchQuote();
            }
            this.initialTryGetQuote = false;
          }
        } else {
          if (this.initialTryGetToken) {
            this.store.dispatch(
              new InsuranceActions.AuthAxaStart({ data: null })
            );
          }
          this.initialTryGetToken = false;
        }
        } else{
          if (data.qouteResponse) {
            this.quoteResponse = data.qouteResponse;
            if(data.qouteResponse){
              this.currency = data.qouteResponse.context.currency;
              sessionStorage.setItem(insuranceConstant.INSURANCE_CURRENCY, this.currency);
            }
          } else {
            if (this.initialTryGetQuote) {
              this.fetchQuote();
            }
            this.initialTryGetQuote = false;
          }
        }
      });
  }

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl(),
    });
  }

  // refeshData() {
  //   if (this.searchQouteListForm != null) {
  //     this.adultCount = this.searchQouteListForm.adults;
  //     this.childCount = this.searchQouteListForm.children;
  //     this.infantCount = this.searchQouteListForm.infants;
  //   } else {
  //     this.adultCount = 1;
  //     this.childCount = 0;
  //     this.infantCount = 0;
  //   }
  // }

  openModalWithComponent() {
    const initialState = {
      searchData: Object.assign({}, this.searchQuoteListForm),
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = "modal-lg";
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      InsuranceSearchDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = "Close";

    this.bsModalRef.content.event.subscribe((res) => {
      this.searchQuoteListForm = res;
      // this.refeshData();
      // this.store.dispatch(new InsuranceActions.SearchInsuranceListStart(
      //   { data: this.searchInsuranceForm }));
      this.fetchQuote();
    });
  }

  fetchQuote() {
    this.store.dispatch(
      new InsuranceActions.QouteListStart({ data: this.searchQuoteListForm })
    );
  }

  goToCart(productIndex: number) {
    let selectedProduct: Product = this.quoteResponse.products[productIndex];
    sessionStorage.setItem(
      insuranceConstant.PRODUCT_SELECTED,
      JSON.stringify(selectedProduct)
    );
    // this.store.dispatch(new InsuranceActions.QouteListStart({ data: selectedType }));
    this.route.navigate(["../cart"], {
      relativeTo: this.activatedRoute,
    });
  }
}
