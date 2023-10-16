import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { OrderFlight } from '../../../model/flight/flight-list/order-flight';

@Component({
  selector: 'app-flight-orders',
  templateUrl: './flight-orders.component.html',
  styleUrls: ['./flight-orders.component.css']
})
export class FlightOrdersComponent implements OnInit {

  @Input() flightList: Flight[];
  @Input() returnFlightList: Flight[];

  @Output() selectFlight = new EventEmitter<OrderFlight>();
  constructor() { }

  ngOnInit() {

  }

  selectedFlight(selectedOrderFlight: OrderFlight) {
    this.selectFlight.emit(selectedOrderFlight);
  }

  getReturnFlight(depatureFlight: Flight): Flight {
    const offerId = depatureFlight.offerItemList[0].offerId;
    const chooseReturnFlight = this.returnFlightList.filter(flight => flight.offerItemList[0].offerId === offerId)[0];
    return chooseReturnFlight;
  }

}
