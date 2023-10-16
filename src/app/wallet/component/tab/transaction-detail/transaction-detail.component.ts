import { Component, Input, OnInit } from '@angular/core';
import { TransactionItem } from 'src/app/model/wallet/transaction/transactiono-item';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

  @Input() transactionDetail: TransactionItem;
  constructor() { }

  ngOnInit() {
  }

}
