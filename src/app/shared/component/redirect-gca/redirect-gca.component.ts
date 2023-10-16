import { Component, Input, OnInit } from '@angular/core';
import { gcaConstant } from 'src/app/gca/gca.constant';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { Meta } from 'src/app/model/gca/common/meta';
import { PaymentBookingResult } from 'src/app/model/gca/payment-booking-result/payment-booking-result';
import { QuoteCreatedRes } from 'src/app/model/gca/quote/response/quote-created-res';

@Component({
  selector: 'app-redirect-gca',
  templateUrl: './redirect-gca.component.html',
  styleUrls: ['./redirect-gca.component.css']
})
export class RedirectGcaComponent implements OnInit {

  @Input() fetching: boolean;
  @Input() fetchFailed: boolean;
  @Input() errorMes: string;
  @Input() currency: string;
  @Input()gcaPaymentRes: PaymentBookingResult;

  departureAirport: AirportRes;
  arrivalAirport: AirportRes;
  adults: number;
  children: number;
  infants: number;
  metaReq: Meta;
  gcaQuoteResult: QuoteCreatedRes;
  constructor() { }

  ngOnInit() {
    this.departureAirport = JSON.parse(sessionStorage.getItem(gcaConstant.DEPARTURE_AIRPORT));
    this.arrivalAirport = JSON.parse(sessionStorage.getItem(gcaConstant.ARRIVAL_AIRPORT));
    this.metaReq = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER));
    this.gcaQuoteResult = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_QUOTE_RESULT))
    if (this.metaReq) {
      this.adults = this.metaReq.adult;
      this.children = this.metaReq.child;
      this.infants = this.metaReq.infant;
    }
  }

}
