import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { OrderFlight } from '../../../model/flight/flight-list/order-flight';
import { or } from '@progress/kendo-angular-grid/dist/es2015/utils';
import {defaultData} from '../../../app.constant';

@Component({
  selector: 'app-flight-order-item',
  templateUrl: './flight-order-item.component.html',
  styleUrls: ['./flight-order-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightOrderItemComponent implements OnInit {
  @Input() flight: Flight;
  @Input() returnFlight: Flight;
  @Output() selectFlight = new EventEmitter<OrderFlight>();
  @Output() selectFlightReturn = new EventEmitter<Flight>();
  defaultAirlineLogo: string;
  hourDuration: number;
  minuteDuration: number;
  isCollapsed: boolean;
  country: string;
  constructor() { }

  ngOnInit() {
    this.isCollapsed = true;
    this.defaultAirlineLogo = defaultData.aeroAirlineLogo;
  }

  getArrivalTime(data: Flight): string {
    if(data){
      if (data.flightSegments.length > 1) {
        return data.flightSegments[data.flightSegments.length - 1].arrDateTime;
      } else {
        return data.flightSegments[0].arrDateTime;
      }
    }
  }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if(data){
      if (data.flightSegments.length > 1) {
        data.flightSegments.forEach(segment => {
          let hour = segment.duration.split('H')[0];
          let minute = segment.duration.split('M')[0].split('H')[1];
          this.hourDuration += +hour;
          this.minuteDuration += +minute;
          if (this.minuteDuration >= 60) {
            this.hourDuration += 1;
            this.minuteDuration -= 60;
          }
        })
        return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
      } else {
        return data.flightSegments[0].duration;
      }
    }
  }

  getArrivalCode(data: Flight): string {
    if(data){
      if (data.flightSegments.length > 1) {
        return data.flightSegments[data.flightSegments.length - 1].arrAirportCode;
      } else {
        return data.flightSegments[0].arrAirportCode;
      }
    }
  }


  reserve() {
    let orderFlight = new OrderFlight();
    orderFlight.depatureFlight = this.flight;
    orderFlight.returnFlight = this.returnFlight;
    this.selectFlight.emit(orderFlight);
  }
}
