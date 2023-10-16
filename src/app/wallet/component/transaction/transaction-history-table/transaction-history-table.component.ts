import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Store } from '@ngrx/store';

import { TransactionHistoryModalComponent } from "../transaction-history-modal/transaction-history-modal.component";
import { TransactionItem } from "src/app/model/wallet/transaction/transactiono-item";
import * as fromApp from 'src/app/store/app.reducer';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';
import { TransactionHitoryRes } from "src/app/model/wallet/transaction/transaction-history-res";

@Component({
  selector: 'app-transaction-history-table',
  templateUrl: './transaction-history-table.component.html',
  styleUrls: ['./transaction-history-table.component.css']
})
export class TransactionHistoryTableComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  addBankForm: FormGroup;

  page = 0;
  pageSize = 10;
  collectionSize = 10;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  transactionRes: TransactionHitoryRes;
  transactionListView: TransactionItem[];
  account: UserDetail;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private modalService: BsModalService,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
    this.bsConfig = new ModalOptions();
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
      // this.getTransactionHitsory();
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.transactionRes = data.transactionHistoryRes;
      if(this.transactionRes && this.transactionRes.transactions){
        this.transactionListView = this.transactionRes.transactions;
        this.collectionSize = this.transactionRes.transactions.length;
      }
    })
  }

  initForm() {
    this.addBankForm = this.fb.group({
      page: [1],
      pageSize: [this.pageSize]
    });
  }


 refreshTransactions(event: any) {
  this.page = +event;
    this.transactionListView = this.transactionRes.transactions
      .map((transaction, i) => ({id: i + 1, ...transaction}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  cancel() {
    this._location.back();
  }

  addBank() {
    if (this.addBankForm.valid) {
      this._location.back();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  openModalWithComponent(transactionDetail: TransactionItem) {
    const modelCount = this.modalService.getModalsCount();
      const initialState = {
        transactionDetailSeleted: transactionDetail,
      };
      this.bsConfig.initialState = initialState;
      this.bsConfig.class = "modal-xl";
      this.bsConfig.animated = true;
      this.bsModalRef = this.modalService.show(
        TransactionHistoryModalComponent,
        this.bsConfig
      );
      this.bsModalRef.content.closeBtnName = "Close";
  }

  transactionReport() {  
    var divToPrint = document.getElementById("transactionRecords");  
    var  newWin = window.open(`#/wallet/completeTransaction`, '_blank'); 
    newWin.document.write(divToPrint.outerHTML);  
    newWin.print();  
    newWin.close();   
} 
}
