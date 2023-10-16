import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

import * as TracemeActions from '../store/traceme.actions';
import * as fromApp from '../../store/app.reducer';
import { AlertifyService } from 'src/app/service/alertify.service';
import { QuoteItem } from 'src/app/model/traceme/shopping/quote-item';
import {appConstant, appDefaultData, defaultData} from 'src/app/app.constant';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { tracemeConstant } from '../traceme.constant';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { TracemeSearchDialogComponent } from '../traceme-search-dialog/traceme-search-dialog.component';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';

@Component({
  selector: 'app-traceme-list',
  templateUrl: './traceme-list.component.html',
  styleUrls: ['./traceme-list.component.css']
})
export class TracemeListComponent implements OnInit {
  searchForm: FormGroup;

  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  currency: string;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata = true;

  journeyLabel: string;
  searchTracemeReq: TraceMeShoppingReq;
  searchTracemeResult: TraceMeShoppingRes;
  quoteListResult: QuoteItem[];
  quoteListView: QuoteItem[];
  p: any;

  defaultData: string;
  constructor(private route: Router,
              private activatedRoute: ActivatedRoute,
              public datepipe: DatePipe,
              private store: Store<fromApp.AppState>,
              private modalService: BsModalService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initForm();
    this.bsConfig = new ModalOptions();
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.journeyLabel =  sessionStorage.getItem(tracemeConstant.JOURNEY_LABLE);
    this.store.select('tracemeList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchTracemeReq = data.searchTracemeReq || JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_LIST_REQ));
      if (data.searchTracemeResult) {
        this.searchTracemeResult = data.searchTracemeResult;
        this.quoteListResult = data.searchTracemeResult.quotes;
        this.quoteListView = [...data.searchTracemeResult.quotes];
        this.currency = this.quoteListResult[0].currency;
        this.increaseSort(this.quoteListView);
      } else {
        if (this.tryFetchdata) {
          this.fetchTracemeList();
        }
        this.tryFetchdata = false;
      }
    });
  }

  private initForm() {
    this.defaultData = defaultData.noImage;
    this.searchForm = new FormGroup({
      journey: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      luggageCount: new FormControl()
    });
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case 'priceIncrease':
        this.increaseSort(this.quoteListView);
        break;
      case 'priceDecrease':
        this.decreaseSort(this.quoteListView);
        break;
      case 'new':
        this.alertify.warning(`Newest currently not support`);
        break;
    }
  }
  increaseSort(quoteList: QuoteItem[]) {
    this.quoteListView = quoteList.sort((a, b) =>
      +a.premium > +b.premium ? 1 : -1
    );
  }

  decreaseSort(insuranceList: QuoteItem[]) {
    this.quoteListView = insuranceList.sort((a, b) =>
      +a.premium < +b.premium ? 1 : -1
    );
  }

  openModalWithComponent() {
    const initialState = {
      searchData: Object.assign({}, this.searchTracemeReq),
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(TracemeSearchDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      this.searchTracemeReq = res;
      // this.refeshData();
      this.fetchTracemeList();
    });
  }

  fetchTracemeList() {
    this.store.dispatch(new TracemeActions.SearchTracemeStart({ data: this.searchTracemeReq }));
  }

  goToDetail(schemeId: string) {
    const selectedQuote: TraceMeData = new TraceMeData();
    selectedQuote.quote = this.searchTracemeResult.quotes.find(item => item.schemeId === schemeId);
    selectedQuote.quoteId = this.searchTracemeResult.quoteId.toString();
    sessionStorage.setItem(tracemeConstant.SELECTED_QUOTE, JSON.stringify(selectedQuote));
    this.route.navigate(['../cart'], {
      relativeTo: this.activatedRoute});
    // this.route.navigate(["../flightSummary"], {
    //   relativeTo: this.activatedRoute,
    // })
  }
}
