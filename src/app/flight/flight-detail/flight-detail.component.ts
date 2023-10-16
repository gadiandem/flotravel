import { Component, OnInit } from '@angular/core';
import { Flight } from '../../model/flight/flight-list/flight';
import {flightConstant, flightProvider} from '../flight.constant';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit {
  flight: Flight;
  aeroProviderAvailable: boolean;
  floFlightProviderAvailable: boolean;
  hahnAirAvailable: boolean;
  etAvailable: boolean;
  providerSearch: number;
  constructor() { }

  ngOnInit() {
    this.flight = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_DETAIL));
    this.providerSearch = +localStorage.getItem(flightConstant.PROVIDER);
    this.aeroProviderAvailable = (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.ANY) || (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.AERO_CRS);
    this.floFlightProviderAvailable = (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.ANY) || (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.FLO_AIR);
    this.hahnAirAvailable = (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.ANY) || (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.HAHN_AIR);
    this.etAvailable = (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.ANY) || (+localStorage.getItem(flightConstant.PROVIDER) === flightProvider.ET);
  }
}
