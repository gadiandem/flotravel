import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WithdrawItem } from 'src/app/model/wallet/withdraw/withdraw-item';


@Component({
  selector: 'app-withdraw-detail-modal',
  templateUrl: './withdraw-detail-modal.component.html',
  styleUrls: ['./withdraw-detail-modal.component.css']
})
export class WithdrawDetailModalComponent implements OnInit {

  withdrawDetail: WithdrawItem;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
