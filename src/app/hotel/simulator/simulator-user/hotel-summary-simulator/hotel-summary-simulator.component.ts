import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelShoppingReq } from '../../../../model/dashboard/hotel/hotel-shopping-req';
import { defaultData } from '../../../../app.constant';
import { hotelConstant } from '../../../hotel.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { DatePipe } from '@angular/common';
import { HotelDetailSimulatorResponse } from '../../../../model/hotel/simulator/hotel-detail-simulator-response';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';

@Component({
  selector: 'app-hotel-summary-simulator',
  templateUrl: './hotel-summary-simulator.component.html',
  styleUrls: ['./hotel-summary-simulator.component.css']
})
export class HotelSummarySimulatorComponent implements OnInit {
  filterOpen = true;
  sub: Subscription;
  p: any;
  defaultHotelImage: string;
  hotelDetailRes: HotelDetailSimulatorResponse;
  selectedRoom: HotelRoomSimulator;
  marker: Marker;
  currency: string;
  defaultDiscount: number;
  searchHotelListRequest: HotelShoppingReq;

  selectedHotel: HotelInfoSimulator;
  starRating: number;
  fetchFailed: boolean;
  numberOfNight = 1;
  numberOfRoom = 1;

  formSubmitError: boolean;
  changeLink: string;
  isLoading = false;
  totalPrice: string;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    protected dashboardService: DashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.isLoading = true;
    window.scroll(0, 0);
    this.defaultHotelImage = defaultData.noImage;
    this.changeLink = '/simulator/hotel/hotelList';
    this.searchHotelListRequest = JSON.parse( sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    if (this.searchHotelListRequest == null) {
      this.route.navigate(["/"]);
    }
    this.selectedHotel = JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
    this.selectedRoom =  JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
    this.formSubmitError = false;
    this.numberOfRoom = this.searchHotelListRequest.rooms.length;
    this.getNumberOfNight();
    this.totalPrice = (this.selectedRoom.pricePerNight * this.numberOfNight * this.numberOfRoom * (1 - this.selectedRoom.discount/100)).toString();
    this.loadingSkeleton();
  }

  loadingSkeleton() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  getNumberOfNight() {
    this.numberOfNight = Math.ceil(((new Date(this.searchHotelListRequest.checkoutDate)).getTime()
      - (new Date(this.searchHotelListRequest.checkinDate)).getTime()) / (24 * 3600 * 1000));
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  showFilter() {
    this.filterOpen = !this.filterOpen;
  }

  searchHotel(event?: HotelShoppingReq) {
    sessionStorage.setItem(
      hotelConstant.SEARCH_HOTEL_LIST_REQUEST,
      JSON.stringify(event)
    );
    this.route.navigate(['/simulator/hotel']);
  }

  goToCard() {
    this.route.navigate(["../cart"], { relativeTo: this.activeRoute });
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
