import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Store } from "@ngrx/store";
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';

import * as fromApp from "../../../../store/app.reducer";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SearchInsurancePackageReq } from "src/app/model/insurance/search-insurance-package.req";
import { QuoteResponse } from "src/app/model/insurance/quote/quote.response";
import { Product } from "src/app/model/insurance/quote/product";
import { FlotravelTermConditionComponent } from "../../../../core/dialogs";
import {hotelConstant} from '../../../../hotel/hotel.constant';
import {appConstant, appDefaultData} from '../../../../app.constant';

@Component({
  selector: 'app-add-on-insurance',
  templateUrl: './add-on-insurance.component.html',
  styleUrls: ['./add-on-insurance.component.css']
})
export class AddOnInsuranceComponent implements OnInit {
  @Output()
  axaInsuranceSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  axaInsurancePackage: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  currency = appDefaultData.DEFAULT_CURRENCY;
  axaInsuranceForm: FormGroup;
  isInsurance: boolean;
  searchData: SearchInsurancePackageReq;
  searchListResult: QuoteResponse;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  packages: any[];
  productExist: boolean;

  quoteSelect: Product;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  constructor(private store: Store<fromApp.AppState>,private modalService: BsModalService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.productExist = false;
    this.updateAxaInsuranceChange();
    this.bsConfig = new ModalOptions();
    this.store.select("insuranceList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchQuoteForm;
      this.searchListResult = data.qouteResponse;
      if (this.searchListResult && this.searchListResult.products.length > 0) {
        this.productExist = true;
        this.getQuoteItem(this.searchListResult.products, this.searchListResult.packagePrice);
      }
    });
  }

  initForm() {
    this.axaInsuranceForm = this.formBuilder.group({
      quote: "",
    });
  }

  getQuoteItem(quotes: Product[], packagePrice: number) {
    const insuranceProduct = Object.assign({selected: false}, quotes[0]);
    insuranceProduct.packagePrice = packagePrice;
    this.quoteSelect = insuranceProduct;
  }

  updateAxaInsuranceChange(){
    this.axaInsuranceForm.controls['quote'].valueChanges.subscribe(value => {
      console.log(value);
      this.updateAxaInsuranceSelection(value);
    })
  }

  updateAxaInsuranceSelection(event: any) {
    if(this.quoteSelect){
      this.axaInsurancePackage.emit(this.quoteSelect);
    }
    this.isInsurance = event === 'YES';
    this.axaInsuranceSelected.emit(this.isInsurance);
  }

  openTermsAndConditionComponent() {
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      FlotravelTermConditionComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
