import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { defaultData } from 'src/app/app.constant';

import { FlightSegments } from '../../../model/flight/flight-list/flightSegments';

@Component({
  selector: 'app-flight-list-item',
  templateUrl: './flight-list-item.component.html',
  styleUrls: ['./flight-list-item.component.css']
})
export class FlightListItemComponent implements OnInit {
  @Input() flight: Flight;
  @Output() selectFlight = new EventEmitter<Flight>();

  hourDuration: number;
  minuteDuration: number;
  isCollapsed: boolean;
  country : string;
  defaultAirlineLogo: string;
  constructor() { }

  ngOnInit() {
    this.isCollapsed = true;
    this.defaultAirlineLogo = defaultData.aeroAirlineLogo;
  }

  getArrivalTime(data: Flight): string {

    if (data.provider == 4) {
      return data.flightSegments[0].arrDateTime;
    } else {
      if (data.flightSegments.length > 1) {
        return data.flightSegments[data.flightSegments.length - 1].arrDateTime;
      } else {
        return data.flightSegments[0].arrDateTime;
      }
    }
  }

  totalDuration(segment: FlightSegments): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    const hour = segment.duration.split('H')[0];
    const minute = segment.duration.split('M')[0].split('H')[1];
    this.hourDuration += +hour;
    this.minuteDuration += +minute;
    if (this.minuteDuration >= 60) {
      this.hourDuration += 1;
      this.minuteDuration -= 60;
    }
    return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
  }
  getArrivalCode(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrAirportCode;
    } else {
      return data.flightSegments[0].arrAirportCode;
    }
  }
  reserve(flight: Flight) {
    flight.flightSegments.forEach(
      response => {
        // console.log(JSON.stringify(response.airline));
      });
    this.selectFlight.emit(flight);
  }
}
