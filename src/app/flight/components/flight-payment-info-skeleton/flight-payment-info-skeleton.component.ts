import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-flight-payment-info-skeleton',
  templateUrl: './flight-payment-info-skeleton.component.html',
  styleUrls: ['./flight-payment-info-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightPaymentInfoSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
