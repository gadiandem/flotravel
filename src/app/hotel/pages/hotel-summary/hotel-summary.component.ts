import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {appConstant, appDefaultData, defaultData} from 'src/app/app.constant';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { DatePipe } from '@angular/common';
import { SearchInsurancePackageReq } from 'src/app/model/insurance/search-insurance-package.req';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { SearchQouteRequest } from 'src/app/model/insurance/search-quote.request';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';
import {HotelShoppingResponse} from '../../../model/hotel/hotel-list/hotel-shopping-sesponse';

@Component({
  selector: 'app-hotel-summary',
  templateUrl: './hotel-summary.component.html',
  styleUrls: ['./hotel-summary.component.css']
})
export class HotelSummaryComponent implements OnInit, OnDestroy {
  @Output() formValid = new EventEmitter<boolean>();
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  filterOpen = true;
  sub: Subscription;
  p: any;

  searchForm: FormGroup;
  travellerCount: number;
  roomGuests: RoomGuest[];
  roomCount: number;
  defaultHotelImage: string;

  selectedRoom: RateDetailList;
  currency: string;
  defaultDiscount: number;
  searchHotelListRequest: HotelShoppingReq;
  searchHotelListResult: HotelShoppingResponse;
  sessionId: string;
  changeLink: string;
  checkin_date: Date;
  checkout_date: Date;
  selectedHotel: HotelInfo;
  hotelShoppingList: HotelInfo[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata = true;
  minPricePerNight = 0;
  numberOfNight = 1;
  numberOfRoom = 1;

  destinationName: string;
  cityCode: string;

  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  formSubmitError: boolean;
  minDateStart: Date = new Date();
  showDropDown: boolean;
  showFormSearchResponsive = false;
  totalTripPrice: number;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    public datePipe: DatePipe,
    private el: ElementRef
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultHotelImage = defaultData.noImage;
    this.changeLink = '/hotel/hotelList';
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.defaultDiscount = hotelConstant.DISCOUNT;
    this.formSubmitError = false;
    this.showDropDown = false;

    this.sub = this.store.select('hotel').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchHotelListRequest = data.searchHotelListForm ||
        JSON.parse( sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
      if (!this.searchHotelListRequest || !this.searchHotelListRequest.destination) {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.searchHotelListResult = data.searchHotelListResult;
      if (this.searchHotelListResult) {
        this.currency = this.searchHotelListResult.currency;
      }
      this.selectedHotel = data.selectedHotel || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
      if (!this.selectedHotel || !this.selectedHotel.coordinate) {
        this.route.navigate(['/dashboard/hotel']);
      } else {
        this.hotelShoppingList = [this.selectedHotel];
      }
      this.sessionId = data.sessionId || sessionStorage.getItem(hotelConstant.SESSION_ID);
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
      if (this.selectedRoom && this.selectedRoom.rooms) {
        this.numberOfRoom = this.selectedRoom.rooms.rooms.length;
        this.totalTripPrice = +this.selectedRoom.totalPrice;
        this.numberOfNight = this.selectedRoom.rooms.rooms[0].roomRate.initialPricePerNight.length;
      } else {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.refeshData();
      this.getAddonOption(this.searchHotelListRequest);
    });
  }

  getAddonOption(searchFlightForm: HotelShoppingReq) {
    this.getInsuranceList(searchFlightForm, this.totalTripPrice);
  }

  getInsuranceList(searchFlightForm: HotelShoppingReq, totalTripPrice: number) {
    const axaRequest = new SearchInsurancePackageReq();
    axaRequest.sessionId = this.sessionId;
    axaRequest.currency = this.currency;
    axaRequest.countryOfTravel = searchFlightForm.destination;
    axaRequest.startDate = searchFlightForm.checkinDate;
    const startDate = new Date(searchFlightForm.checkinDate);
    axaRequest.endDate = searchFlightForm.checkoutDate || this.datePipe.transform(startDate.setDate(startDate.getDate() + 1), 'yyyy-MM-dd');
    const travellersInsure = new Travellers();
    travellersInsure.adt = searchFlightForm.rooms[0].adult;
    travellersInsure.chd = searchFlightForm.rooms[0].children;
    travellersInsure.inf = 0;
    axaRequest.travellers = travellersInsure;
    const searchQuoteForm: SearchQouteRequest = new SearchQouteRequest(axaRequest);
    searchQuoteForm.price = +totalTripPrice.toFixed(2);
    searchQuoteForm.currency = this.currency;
    sessionStorage.setItem(insuranceConstant.QUOTE_SEARCH_FORM, JSON.stringify(searchQuoteForm));
    this.store.dispatch(new InsuranceActions.QouteListStart({data: searchQuoteForm}));
  }

  refeshData() {
    if (this.searchHotelListRequest) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = this.searchHotelListRequest.rooms;
      (this.searchHotelListRequest.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  showFilter() {
    this.filterOpen = !this.filterOpen;
  }

  showFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = true;
    if (this.showFormSearchResponsive) {
      myTag.classList.remove('hotel-search');
    }
  }

  closeFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add('hotel-search');
    }
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }


  searchHotel(event: HotelShoppingReq) {
    this.store.dispatch(new HotelActions.SearchHotelListStart({ data: event }));
    this.route.navigate(['../hotelList'], {relativeTo: this.activeRoute});
  }

  goToCard() {
    this.route.navigate(['../cart'], { relativeTo: this.activeRoute });
  }
}
