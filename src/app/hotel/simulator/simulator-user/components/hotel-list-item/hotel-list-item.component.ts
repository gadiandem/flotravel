import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { defaultData } from 'src/app/app.constant';
import { HotelInfoSimulator } from '../../../../../model/hotel/simulator/hotel-info-simulator';
import { hotelConstant } from '../../../../hotel.constant';

@Component({
  selector: 'app-hotel-list-item-simulator',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {
  defaultData: string;
  @Input() hotelList: HotelInfoSimulator[];
  @Input() numberOfNight: number;
  @Output() selectedHotel = new EventEmitter<HotelInfoSimulator>();
  @Input() flightMinPrice: string;
  @Input() pageCurrent: any;

  public config: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  constructor() { }

  ngOnInit() {
    this.defaultData = defaultData.noImage;
  }

  selectHotel(hotel: HotelInfoSimulator) {
    sessionStorage.setItem(
      hotelConstant.SELECTED_HOTEL_INFO,
      JSON.stringify(hotel)
    );
    this.selectedHotel.emit(hotel);
  }
}
