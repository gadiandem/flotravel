import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { OfferPriceRes } from 'src/app/model/flight/offer-price/offer-price-res';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { FlightSegments } from '../../../model/flight/flight-list/flightSegments';
import {defaultData} from '../../../app.constant';

@Component({
  selector: 'app-flight-depature-selected',
  templateUrl: './flight-depature-selected.component.html',
  styleUrls: ['./flight-depature-selected.component.css']
})
export class FlightDepatureSelectedComponent implements OnInit {
  @Input() departureFlight: SelectedFlight;
  @Input() currency: string;
  @Input() offerPrices: OfferPriceRes;

  hourDuration: number;
  minuteDuration: number;
  isCollapsed: boolean;
  aeroProvider : string;
  isDirect: boolean;
  baggageRules: string = '';
  baggageInfoView: string[];
  defaultAirlineLogo: string;
  constructor() { }

  ngOnInit() {
    this.defaultAirlineLogo = defaultData.aeroAirlineLogo;
    this.isCollapsed = true;
    this.isDirect = false;
    this.baggageInfoView = [];
    if(this.departureFlight.flight.flightSegments.length === 1){
      this.isDirect = true;
    }
    if(this.offerPrices){
      if(this.offerPrices.baggageInfo && this.offerPrices.baggageInfo.length > 0){
        this.baggageInfoView = this.offerPrices.baggageInfo;
        this.baggageRules += this.offerPrices.baggageInfo.join().replace(',', ' ');
     }
    }
  }

  getArrivalTime(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrDateTime;
    } else {
      return data.flightSegments[0].arrDateTime;
    }
  }

  getArrivalCode(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrAirportCode;
    } else {
      return data.flightSegments[0].arrAirportCode;
    }
  }

  totalDuration(segment: FlightSegments): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    // if (data.flightSegments.length > 1) {
      // data.flightSegments.forEach(segment => {
        const hour = segment.duration.split('H')[0];
        const minute  = segment.duration.split('M')[0].split('H')[1];
        this.hourDuration += +hour;
        this.minuteDuration += +minute;
        if (this.minuteDuration >= 60) {
          this.hourDuration += 1;
          this.minuteDuration -= 60;
        }
      // });
      return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
    // } else {
    //   return data.flightSegments[0].duration;
    // }
  }

}
