import { Component, OnInit } from '@angular/core';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';
import { hepstarConstant } from '../hepstar.constant';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Store } from '@ngrx/store';

import * as HepstarActions from '../store/hepstar.actions';
import * as fromApp from '../../store/app.reducer';
import { AlertifyService } from 'src/app/service/alertify.service';
import { QuoteItem } from 'src/app/model/traceme/shopping/quote-item';
import {appConstant, appDefaultData, defaultData} from 'src/app/app.constant';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  searchForm: FormGroup;

  searchData: HepstarSearchFormData;
  searchListResult: SearchHepstarRes;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata: boolean = true;
  currency: string;
  p: any;
  productExist: boolean;
  defaultData: string;

  packages: any[];

  constructor( private hepstarService: HepstarService,
              private route: Router,
              private store: Store<fromApp.AppState>,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.productExist = true;
    this.defaultData = defaultData.noImage;
    this.packages = [];
    this.initForm();
    this.store.select('hepstarList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchHepstarReq;
      if(data.searchHepstarResult){
        this.searchListResult = data.searchHepstarResult;
        if(this.searchListResult){
          this.packages = [...this.searchListResult.result.productResponseParameters.packages.packages];
          console.log(this.packages);
          if(this.packages.length > 0){
            this.packages =this.packages.filter(product => product.pricedProduct.productInformation.productDisplay)
          }
        }
        if(!this.searchListResult.result.productResponseParameters){
          this.productExist = false;
        }
      } else {
        if(this.tryFetchdata){
          this.fetchProductPriceList();
        }
        this.tryFetchdata = false;
      }
    })

  }

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl()
    });
  }

  // openModalWithComponent() {
  //   const initialState = {
  //     searchData: Object.assign({}, this.searchTracemeReq),
  //   };
  //   this.bsConfig.initialState = initialState;
  //   this.bsConfig.class = 'modal-lg';
  //   this.bsConfig.animated = true;
  //   this.bsModalRef = this.modalService.show(TracemeSearchDialogComponent, this.bsConfig);
  //   this.bsModalRef.content.closeBtnName = 'Close';

  //   this.bsModalRef.content.event.subscribe(res => {
  //     this.searchTracemeReq = res;
  //     // this.refeshData();
  //     this.fetchTracemeList();
  //   });
  // }

  fetchProductPriceList() {
    this.store.dispatch(new HepstarActions.SearchHepstarStart({ data: this.searchData }));
  }

  goToCard(product: any){
    sessionStorage.setItem(hepstarConstant.PRODUCT_SELECTED, JSON.stringify(product));
    this.route.navigate(["../payment-info"], {
      relativeTo: this.activatedRoute})
  }
}
