import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { defaultData } from 'src/app/app.constant';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import {hotelConstant, hotelProvider} from '../../hotel.constant';

@Component({
  selector: 'app-hotel-list-item',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {
  defaultData: string;
  @Input() hotelList: HotelInfo[];
  @Input() currency: string;
  @Input() flightMinPrice: number;
  @Input() numberOfNight: number;
  @Output() selectedHotel = new EventEmitter<HotelInfo>();
  @Input() p: any;
  hotelProvider = hotelProvider;
  @Input() pageCurrent: any;
  readMore : boolean[];
  contentHeights: boolean[] = [];
  constructor() { }

  ngOnInit() {
    this.defaultData = defaultData.noImage;
  }

  selectHotel(hotel: HotelInfo) {
    sessionStorage.setItem(
      hotelConstant.SELECTED_HOTEL_INFO,
      JSON.stringify(hotel)
    );
    this.selectedHotel.emit(hotel);
  }


}
