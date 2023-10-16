import { Component, Input, OnInit } from '@angular/core';
import { defaultData } from 'src/app/app.constant';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { hotelProvider } from '../../hotel.constant';

@Component({
  selector: 'app-hotel-select-summary',
  templateUrl: './hotel-select-summary.component.html',
  styleUrls: ['./hotel-select-summary.component.css']
})
export class HotelSelectSummaryComponent implements OnInit {
  @Input() selectedHotel: HotelInfo;
  @Input() selectedRoom: RateDetailList;
  @Input() numberOfNight: number;
  @Input() changeLink: string;
  @Input() searchHotelListRequest: HotelShoppingReq;
  @Input() currency: string;
  hotelProvider = hotelProvider;
  defaultData: string;
  constructor() { }

  ngOnInit() {
    this.defaultData = defaultData.noImage;
  }

}
