import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Store } from '@ngrx/store';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';

import * as fromApp from '../../../../store/app.reducer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { TraceMeShoppingRes } from 'src/app/model/traceme/shopping/traceme-shopping-res';
import { QuoteItem } from 'src/app/model/traceme/shopping/quote-item';
import { tracemeConstant } from 'src/app/traceme/traceme.constant';
import * as TracemeActions from '../../../../traceme/store/traceme.actions';
import { FlotravelTermConditionComponent } from '../../../../core/dialogs';

@Component({
  selector: 'app-add-on-traceme',
  templateUrl: './add-on-traceme.component.html',
  styleUrls: ['./add-on-traceme.component.css']
})
export class AddOnTracemeComponent implements OnInit {
  @Input()
  currency: string;
  @Output()
  tracemeSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  tracemeSelectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  quoteId: EventEmitter<number> = new EventEmitter<number>();
  addonTracemeForm: FormGroup;
  isTraceMe: boolean;

  searchData: TraceMeShoppingReq;
  searchListResult: TraceMeShoppingRes;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  quotes: QuoteItem[];
  productExist: boolean;

  quoteSelect: QuoteItem;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  constructor(private store: Store<fromApp.AppState>, private modalService: BsModalService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.updateTraceMeChange();
    this.bsConfig = new ModalOptions();
    this.store.select('tracemeList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchTracemeReq;
      this.searchListResult = data.searchTracemeResult || JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_LIST_RES));
      if (this.searchListResult) {
        this.quotes = [...this.searchListResult.quotes];
        console.log(this.quotes);
        if (this.quotes.length > 0) {
          this.getTracemeList(this.quotes);
        }
      if (!this.searchListResult.error) {
        this.productExist = false;
      }
      }
    });
  }

  fetchTraceMeList() {
    this.store.dispatch(new TracemeActions.SearchTracemeStart({data: this.searchData}));
  }

  initForm() {
    this.addonTracemeForm = this.formBuilder.group({
      quote: '',
    });
  }
  getTracemeList(quotes: any[]) {
    this.quotes = quotes.sort((a, b) => {
      if (a.schemeId < b.schemeId) {
        return -1;
      }
      if (a.schemeId > b.schemeId) {
        return 1;
      }
      return 0;
    });
    this.quoteSelect = quotes[0];
    this.productExist = this.quoteSelect ? true : false;
  }

  updateTraceMeChange() {
    this.addonTracemeForm.controls['quote'].valueChanges.subscribe(value => {
      console.log(value);
      this.updateTraceMeSelection(value);
    });
  }

  updateTraceMeSelection(event: any) {
    if (this.quoteSelect) {
      this.tracemeSelectedItem.emit(this.quoteSelect);
    }
    this.isTraceMe = (event === 'YES');
    this.tracemeSelected.emit(this.isTraceMe);
    this.quoteId.emit(this.searchListResult.quoteId);
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

