import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight } from 'src/app/model/flight/flight-list/flight';

@Component({
  selector: 'app-flight-list-component',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit {

  @Input()
  flightList: Flight[];

  @Output() selectFlight = new EventEmitter<Flight>();
  constructor() { }

  ngOnInit() {
  }

  selectedFlight(selectedFlight: Flight) {
    this.selectFlight.emit(selectedFlight);
  }

}
