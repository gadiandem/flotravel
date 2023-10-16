import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Store } from '@ngrx/store';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';

import * as fromApp from '../../../../store/app.reducer';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';
import { productType } from 'src/app/hepstar/hepstar.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlotravelTermConditionComponent } from '../../../../core/dialogs';

@Component({
  selector: 'app-add-on-smart-delay',
  templateUrl: './add-on-smart-delay.component.html',
  styleUrls: ['./add-on-smart-delay.component.css']
})
export class AddOnSmartDelayComponent implements OnInit {
  @Input()
  currency: string;
  @Output()
  smartDelaySelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  smartDelaySelectedItem: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  quoteId: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  productExistEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  addonSmartDelayForm: FormGroup;

  searchData: HepstarSearchFormData;
  searchListResult: SearchHepstarRes;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  packages: any[];
  productExist: boolean;

  smartDelay: any;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  constructor(private store: Store<fromApp.AppState>, private modalService: BsModalService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.productExist = false;
    this.initForm();
    this.updateSmartDelayChange();
    this.bsConfig = new ModalOptions();
    this.store.select('hepstarList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchHepstarReq;
      this.searchListResult = data.searchHepstarResult;
      if (this.searchListResult && this.searchListResult.result.productResponseParameters) {
        this.packages = this.searchListResult.result.productResponseParameters.packages.packages;
        if (this.packages.length > 0) {
          this.getSmartDelay(this.packages);
        }
      }
      if (!this.searchListResult.result.productResponseParameters) {
        this.productExist = false;
        this.productExistEmit.emit(false);
      }
    });
  }
  initForm() {
    this.addonSmartDelayForm = this.formBuilder.group({
      smartdelay: '',
    });
  }

  getSmartDelay(packages: any[]) {
    this.smartDelay = packages.find((item) => item.pricedProduct.productInformation.productCode === productType.SMART_DELAY_CODE || item.pricedProduct.productInformation.productCode === productType.SMART_DELAY_CODE_24);
    console.log(JSON.stringify(this.smartDelay));
    this.productExist = this.smartDelay ? true : false;
    this.productExistEmit.emit(this.productExist);
  }

  updateSmartDelayChange() {
    this.addonSmartDelayForm.controls['smartdelay'].valueChanges.subscribe(value => {
      console.log('smart delay:' + value);
      this.updateSmartDelaySelection(value);
    });
  }

  updateSmartDelaySelection(event: any) {
    if (this.smartDelay) {
      this.smartDelaySelectedItem.emit(this.smartDelay);
    }
    // this.isRefundProtect = (event === 'YES');
    this.smartDelaySelected.emit(event);
    // this.quoteId.emit(this.searchListResult.quoteId);
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
