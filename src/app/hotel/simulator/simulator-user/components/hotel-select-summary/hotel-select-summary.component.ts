import { Component, Input, OnInit } from '@angular/core';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { HotelInfoSimulator } from '../../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelRoomSimulator } from '../../../../../model/hotel/simulator/hotel-room-simulator';

@Component({
  selector: 'app-hotel-select-summary-simulator',
  templateUrl: './hotel-select-summary.component.html',
  styleUrls: ['./hotel-select-summary.component.css']
})
export class HotelSelectSummaryComponent implements OnInit {
  @Input() selectedHotel: HotelInfoSimulator;
  @Input() selectedRoom: HotelRoomSimulator;
  @Input() numberOfNight: number;
  @Input() changeLink: string;
  @Input() searchHotelListRequest: HotelShoppingReq;
  @Input() currency: string;
  @Input() totalPrice: string;
  constructor() { }

  ngOnInit() {
  }

}
