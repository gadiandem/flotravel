import { Component, OnInit, Renderer2} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Location } from '@angular/common';
import { HotelShoppingReq } from "src/app/model/dashboard/hotel/hotel-shopping-req";
import { hotelConstant } from '../../../hotel.constant';
import { defaultData } from 'src/app/app.constant';
import { HotelShoppingSimulatorResponse } from '../../../../model/hotel/simulator/hotel-shopping-simulator-response';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';

@Component({
  selector: 'app-hotel-list-simulator',
  templateUrl: './hotel-list-simulator.component.html',
  styleUrls: ['./hotel-list-simulator.component.css']
})
export class HotelListSimulatorComponent implements OnInit {
  currency: string;
  defaultData: string;
  mapOpen = false;
  filterOpen = false;

  searchHotelListRequest: HotelShoppingReq;
  searchHotelListResult: HotelShoppingSimulatorResponse;
  hotelShoppingList: HotelInfoSimulator[];
  hotelListView: HotelInfoSimulator[];
  isLoading = false;
  fetchFailed = false;

  discount: number;
  formSubmitError: boolean;
  numberOfNight: number;

  p: any;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private _location: Location,
    private renderer: Renderer2,
    private hotelSimulatorService: HotelSimulatorService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultData = defaultData.noImage;
    this.currency = hotelConstant.METADATA_CURRENCY;
    this.formSubmitError = false;
    this.searchHotelListRequest = JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    this.getNumberOfNight(this.searchHotelListRequest.checkinDate, this.searchHotelListRequest.checkoutDate);
    this.getHotelList();
  }

  getNumberOfNight(checkinDate: string, checkoutDate: string) {
    this.numberOfNight = Math.ceil(((new Date(checkoutDate)).getTime() - (new Date(checkinDate)).getTime()) / (24 * 3600 * 1000));
  }

  getHotelList() {
    this.isLoading = true;
    this.hotelSimulatorService.shoppingHotelSimulator(this.searchHotelListRequest).subscribe(result => {
      this.searchHotelListResult = result;
      if (result) {
        this.hotelShoppingList = this.searchHotelListResult.hotelSimulatorInfoList;
      } else {
        this.hotelShoppingList = [];
      }
      this.isLoading = false;
      this.fetchFailed = false;
    }, error =>  {
      console.log(error);
      this.isLoading = false;
      this.fetchFailed = true;
    })
  }

  updateHotelListView(data?: any) {
    this.hotelListView = [...data];
  }

  showMap() {
    this.mapOpen = !this.mapOpen;
  }

  showFilter() {
    this.filterOpen = !this.filterOpen;
  }

  showFormFilter() {
    if(this.filterOpen) {
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    } else {
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    }
  }

  shoppingHotel(req: HotelShoppingReq) {
    sessionStorage.setItem(
      hotelConstant.SEARCH_HOTEL_LIST_REQUEST,
      JSON.stringify(req)
    );
    this.route.navigate(['/simulator/hotel']);
  }


  gotoDetail(hotel: HotelInfoSimulator) {
    sessionStorage.setItem(hotelConstant.SELECTED_HOTEL_INFO,JSON.stringify(hotel));
    window.open(`#/simulator/hotel/hotelDetail/${hotel.id}`, '_blank');
  }
}
