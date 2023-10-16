import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';
import {PaginationInstance} from 'ngx-pagination';

// import { SearchDialogComponent } from "../search-dialogs/search-dialogs.component";
import * as fromApp from 'src/app/store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {HotelShoppingResponse} from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import {HotelInfo} from 'src/app/model/hotel/hotel-list/hotel-info';
import {RatingStarCount} from 'src/app/model/hotel/hotel-list/rating-star-count';
import {HotelSort} from 'src/app/model/enum/hotel-sort';
import {AlertifyService} from 'src/app/service/alertify.service';
import {RatingStarFilter} from 'src/app/model/hotel/hotel-list/rating-star-filter';
import {defaultData} from 'src/app/app.constant';
import {Marker} from '@agm/core';
import {combineBookingConstant} from '../../combine-booking.constant';
import {CombineBookingService} from 'src/app/service/combine/combine-booking.service';
import {CombineShoppingReq} from 'src/app/model/combine/shopping-req';
import {hotelConstant, hotelProvider} from 'src/app/hotel/hotel.constant';
import {Flight} from 'src/app/model/flight/flight-list/flight';
import {OriginDestination} from 'src/app/model/flight/flight-list/originDestination';
import {HotelCombineShoppingResponse} from '../../../model/combine/hotel-combine-shopping-res';
import {flightListType, flightTypeIndex} from '../../../flight/flight.constant';

class MarkerItem {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
}
@Component({
  selector: 'app-combine-hotel-list',
  templateUrl: './combine-hotel-list.component.html',
  styleUrls: ['./combine-hotel-list.component.css']
})
export class CombineHotelListComponent implements OnInit {
  searchForm: FormGroup;
  currency: string;
  // defaultDiscount: number;
  mapOpen = false;
  filterOpen = true;
  showFormSearchResponsive = false;
  defaultData: string;

  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  travellerCount: number;
  roomCount: number;
  searchHotelListRequest: CombineShoppingReq;
  searchHotelListResult: HotelShoppingResponse;
  hotelListView: HotelInfo[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata = true;
  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;
  sortType: HotelSort;
  numberOfNight: number;

  mappType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  markerList: MarkerItem[];
  discount: number;
  flightListSource: Flight[] = [];
  originDestination: OriginDestination[] = [];
  flightMinPrice: number;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  p: any;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private combineService: CombineBookingService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.searchHotelListRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_REQUEST));
    if (!this.fetching) {
      if (this.tryFetchdata) {
        this.fetchHotelList();
      }
      this.tryFetchdata = false;
    }
    this.initForm();
    this.defaultData = defaultData.noImage;
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.bsConfig = new ModalOptions();
    this.currency = combineBookingConstant.METADATA_CURRENCY;
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case 'priceIncrease':
        this.increaseSort(this.hotelListView);
        break;
      case 'priceDecrease':
        this.decreaseSort(this.hotelListView);
        break;
      case 'popularity':
        // this.ratingStar.threeStar++;
        this.alertify.warning(`Popularity currently not support`);
        break;
      case 'new':
        this.alertify.warning(`Newest currently not support`);
        break;
      case 'rating':
        this.ratingSort(this.hotelListView);
        break;
    }
  }

  increaseSort(hotelListView: HotelInfo[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.minPrice > b.minPrice ? 1 : -1
    );
  }

  decreaseSort(hotelListView: HotelInfo[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.minPrice < b.minPrice ? 1 : -1
    );
  }

  ratingSort(hotelListView: HotelInfo[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.starRating < b.starRating ? 1 : -1
    );
  }

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl(),
    });
  }

  updateRatingStar(hotelList: HotelInfo[]) {
    hotelList.map((item) => {
      const star = item.starRating;
      switch (true) {
        case star <= 1:
          this.ratingStarCount.oneStar++;
          break;
        case star <= 2:
          this.ratingStarCount.twoStar++;
          break;
        case star <= 3:
          this.ratingStarCount.threeStar++;
          break;
        case star <= 4:
          this.ratingStarCount.fourStar++;
          break;
        case star <= 5:
          this.ratingStarCount.fiveStar++;
          break;
      }
    });
  }

  showFormFilter() {
    if (this.filterOpen) {
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    } else {
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    }
  }

  fiveStarFilter() {
    this.ratingStarFiler.fiveStar = !this.ratingStarFiler.fiveStar;
    this.ratingStartFilter();
  }

  fourStarFilter() {
    this.ratingStarFiler.fourStar = !this.ratingStarFiler.fourStar;
    this.ratingStartFilter();
  }

  threeStarFilter() {
    this.ratingStarFiler.threeStar = !this.ratingStarFiler.threeStar;
    this.ratingStartFilter();
  }

  twoStarFilter() {
    this.ratingStarFiler.twoStar = !this.ratingStarFiler.twoStar;
    this.ratingStartFilter();
  }

  oneStarFilter() {
    this.ratingStarFiler.oneStar = !this.ratingStarFiler.oneStar;
    this.ratingStartFilter();
  }

  ratingStartFilter() {
    this.hotelListView = this.searchHotelListResult.hotelInfoList.filter(
      (item) => {
        return (this.ratingStarFiler.fiveStar &&
            item.starRating <= 5 &&
            item.starRating > 4) ||
          (this.ratingStarFiler.fourStar &&
            item.starRating <= 4 &&
            item.starRating > 3) ||
          (this.ratingStarFiler.threeStar &&
            item.starRating <= 3 &&
            item.starRating > 2) ||
          (this.ratingStarFiler.twoStar &&
            item.starRating <= 2 &&
            item.starRating > 1) ||
          (this.ratingStarFiler.oneStar &&
            item.starRating <= 1 &&
            item.starRating > 0);
      }
    );
  }

  searchHotel(event: HotelShoppingReq) {
    // this.store.dispatch(new HotelActions.SearchHotelListStart({data: event}));
    this.fetchHotelList();
    this.route.navigate(['../hotelList'], {relativeTo: this.activatedRoute});
  }

  refreshData() {
    this.searchHotelListRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_HOTEL_LIST_REQUEST));
    if (this.searchHotelListRequest) {
      this.roomCount = this.searchHotelListRequest.rooms.length;
      this.searchHotelListRequest.rooms.forEach(r => this.travellerCount += (r.adult + r.children));
      this.numberOfNight = (new Date(this.searchHotelListRequest.checkoutDate).getTime() -
        new Date(this.searchHotelListRequest.checkinDate).getTime()) / (1000 * 3600 * 24);
      this.travellerCount = 0;
      this.roomCount = 0;
      (this.searchHotelListRequest.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }

  getMinFlightPrice() {
    this.originDestination = JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_LIST_RESULT));
    this.originDestination.forEach(o => {
      if (o.type === flightListType.DEPARTURE) {
        this.flightListSource.push(...o.flightList);
      }
    });
    this.flightMinPrice = this.flightListSource[0].offerItemList[0].totalAmount;
    this.flightListSource.map(flight => flight.offerItemList
      .map(offer => {
        if (offer.totalAmount < this.flightMinPrice) {
          this.flightMinPrice = offer.totalAmount;
        }
      }));

  }

  showMap() {
    this.mapOpen = !this.mapOpen;
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

  fetchHotelList() {
    this.fetching = true;
    this.combineService.shoppingCombineService(this.searchHotelListRequest).subscribe(
      (res) => {
        this.fetching = false;
        this.processData(res);
        this.getMinFlightPrice();
        this.refreshData();
      },
      e => {
        this.fetchFailed = true;
        this.fetching = false;
        this.errorMes = e.message;
      }
    );
  }

  processData(res: HotelCombineShoppingResponse) {
    this.hotelListView = [];
    this.currency = combineBookingConstant.METADATA_CURRENCY;
    if (res) {
      const hotelList = [];
      if (res.hotelNuitee) {
        sessionStorage.setItem(combineBookingConstant.SESSION_ID, res.hotelNuitee.sessionId);
        this.currency = res.hotelNuitee.currency;
      }
      hotelList.push(...res.hotelNuitee.hotelInfoList);
      if (res.hotelNCT) {
        hotelList.push(...res.hotelNCT.hotelInfoList);
      }
      if (res.hotelSimulator) {
        hotelList.push(...res.hotelSimulator.hotelInfoList);
      }
      this.updateRatingStar(hotelList);
      this.hotelListView = [...hotelList.sort((a, b) =>
        (a.minPrice > b.minPrice ? 1 : -1)), ...this.hotelListView];
    }
    this.markerList = [];
    this.hotelListView.forEach((hotel, index) => {
      if (index === 0) {
        this.latitude = +hotel.coordinate.latitude;
        this.longitude = +hotel.coordinate.longitude;
      }
      const markerItem = new MarkerItem();
      markerItem.lat = +hotel.coordinate.latitude;
      markerItem.lng = +hotel.coordinate.longitude;
      markerItem.label = hotel.name;
      markerItem.draggable = true;
      if (this.markerList.length <= 10) {
        this.markerList.push(markerItem);
      }
    });
    sessionStorage.setItem(combineBookingConstant.CURRENCY, this.currency);
    this.refreshData();
  }

  gotoDetail(hotel: HotelInfo) {
    sessionStorage.setItem(combineBookingConstant.SELECTED_HOTEL, JSON.stringify(hotel));
    sessionStorage.setItem(combineBookingConstant.SELECTED_HOTEL_PROVIDER, hotel.provider);
    // window.open(`#/combine/hotelDetail/${hotel.code}`, '_blank');
    window.open(`#/combine/packageSummary`, '_blank');
  }

  update(page: any) {
    this.p = page;
  }
}
