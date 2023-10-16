import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from '@ngrx/store';

import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TransactionHistoryModalComponent } from "../../transaction/transaction-history-modal/transaction-history-modal.component";
import { WithdrawDetailModalComponent } from "../withdraw-detail-modal/withdraw-detail-modal.component";
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { WithdrawItem } from "src/app/model/wallet/withdraw/withdraw-item";
@Component({
  selector: 'app-withdraw-list',
  templateUrl: './withdraw-list.component.html',
  styleUrls: ['./withdraw-list.component.css']
})
export class WithdrawListComponent implements OnInit {

  isCollapsed: boolean;
  formSubmitError: boolean;
  addBankForm: FormGroup;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  // countries: Country[];
  
  account: UserDetail;
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  withdrawListData: WithdrawItem[];
  withdrawListView: WithdrawItem[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoadData = true;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private modalService: BsModalService,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
    this.bsConfig = new ModalOptions();
    // this.refreshCountries(null);
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
    });
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.withdrawListData = data.withdrawListRes;
      this.withdrawListView = this.withdrawListData;
      if(this.withdrawListView.length > 0){
        this.collectionSize = this.withdrawListView.length;
      }
      this.fetchNewData();
    })
  }

  fetchNewData(){
    if(this.initialLoadData){
      if(this.withdrawListData.length === 0){
        this.getWithdrawList();
      }
    }
    this.initialLoadData = false;
  }

  getWithdrawList(){
    this.store.dispatch( new WalletActions.WithdrawListStart({ userId: this.account.id }));
  }

  initForm() {
    this.addBankForm = this.fb.group({
      page: [1],
      pageSize: [this.pageSize]
    });
  }
  refreshCountries(event: any) {
  this.page = +event;
    this.withdrawListView = this.withdrawListData
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openModalWithComponent(index: number) {
      const initialState = {
        withdrawDetail: Object.assign({}, this.withdrawListData[index]),
      };
      this.bsConfig.initialState = initialState;
      this.bsConfig.class = "modal-xl";
      this.bsConfig.animated = true;
      this.bsModalRef = this.modalService.show(
        WithdrawDetailModalComponent,
        this.bsConfig
      );
      this.bsModalRef.content.closeBtnName = "Close"; 
  }
}
