import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { TransactionItem } from 'src/app/model/wallet/transaction/transactiono-item';

@Component({
  selector: 'app-transaction-history-modal',
  templateUrl: './transaction-history-modal.component.html',
  styleUrls: ['./transaction-history-modal.component.css']
})
export class TransactionHistoryModalComponent implements OnInit {

  transactionDetailSeleted: TransactionItem;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
