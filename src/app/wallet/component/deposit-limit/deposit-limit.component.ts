import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deposit-limit',
  templateUrl: './deposit-limit.component.html',
  styleUrls: ['./deposit-limit.component.css']
})
export class DepositLimitComponent implements OnInit {
  isCollapsed: boolean;

  constructor() { }

  ngOnInit() {
    this.isCollapsed = false;
  }

}
