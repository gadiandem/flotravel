import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-summary-total-price',
  templateUrl: './hotel-summary-total-price.component.html',
  styleUrls: ['./hotel-summary-total-price.component.css']
})
export class HotelSummaryTotalPriceComponent implements OnInit {
  @Input() totalPrice: number;
  @Input() currency: string;
  constructor() { }

  ngOnInit() {
  }

}
