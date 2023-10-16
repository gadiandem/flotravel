import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-flotravel-term-condition',
  templateUrl: './flotravel-term-condition.component.html',
  styleUrls: ['./flotravel-term-condition.component.css']
})
export class FlotravelTermConditionComponent implements OnInit {

  constructor( public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  closeModal() {
    this.bsModalRef.hide();
  }
}
