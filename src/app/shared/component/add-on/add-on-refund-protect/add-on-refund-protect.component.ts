import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Store } from '@ngrx/store';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';

import * as fromApp from '../../../../store/app.reducer';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';
import { productType } from 'src/app/hepstar/hepstar.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TermsAndConditionsComponent } from '../../terms-and-conditions/terms-and-conditions.component';
import { FlotravelTermConditionComponent } from '../../../../core/dialogs';

@Component({
  selector: 'app-add-on-refund-protect',
  templateUrl: './add-on-refund-protect.component.html',
  styleUrls: ['./add-on-refund-protect.component.css'],
})
export class AddOnRefundProtectComponent implements OnInit {
  @Input()
  currency: string;
  @Output()
  refundProtectSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  refundProtectPackage: EventEmitter<any> = new EventEmitter<any>();
  refundProtectForm: FormGroup;
  isRefundProtect: boolean;

  searchData: HepstarSearchFormData;
  searchListResult: SearchHepstarRes;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  packages: any[];
  productExist: boolean;

  refundProtect: any;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  constructor(private store: Store<fromApp.AppState>,
    private modalService: BsModalService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.productExist = false;
    this.initForm();
    this.updateRefundChange();
    this.bsConfig = new ModalOptions();
    this.store.select('hepstarList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchHepstarReq;
      this.searchListResult = data.searchHepstarResult;
      if (this.searchListResult) {
      //  console.log(JSON.stringify(this.searchListResult));
        this.packages = this.searchListResult.result.productResponseParameters.packages.packages;
        this.getRefundProtect(this.packages);
      }
    });
  }
  initForm() {
    this.refundProtectForm = this.formBuilder.group({
      refund: '',
    });
  }
  getRefundProtect(packages: any[]) {
    this.refundProtect = packages.find((item) => item.pricedProduct.productInformation.productIdentifier == productType.REFUND_PROTECT);
 //  console.log(JSON.stringify(this.refundProtect));
    this.productExist = this.refundProtect ? true : false;
  }

  updateRefundChange() {
    this.refundProtectForm.controls['refund'].valueChanges.subscribe(value => {
      console.log('refund protect: ' + value);
      this.updateRefundSelection(value);
    });
  }

  updateRefundSelection(event: any) {
    if (this.refundProtect) {
      this.refundProtectPackage.emit(this.refundProtect);
    }
    this.isRefundProtect = event === 'YES';
    this.refundProtectSelected.emit(this.isRefundProtect);
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
