import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Observer, of } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { Marker } from '@agm/core';

import * as fromApp from 'src/app/store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { HotelShoppingResponse } from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { RatingStarCount } from 'src/app/model/hotel/hotel-list/rating-star-count';
import { HotelSort } from 'src/app/model/enum/hotel-sort';
import { AlertifyService } from 'src/app/service/alertify.service';
import { RatingStarFilter } from 'src/app/model/hotel/hotel-list/rating-star-filter';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';
import { Router } from '@angular/router';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { map } from 'rxjs/internal/operators/map';

class MarkerItem {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
}

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
})
export class HotelListComponent implements OnInit {
  currency: string;
  mapOpen = false;
  filterOpen = true;

  defaultData: string;

  numberOfNight : number;
  travellerCount: number;
  searchHotelListRequest: HotelShoppingReq;
  searchHotelListResult: HotelShoppingResponse;
  hotelShoppingList: HotelInfo[];
  hotelListView: HotelInfo[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchData = true;
  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;
  sortType: HotelSort;
  sessionId: string;

  mapType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  markerList: MarkerItem[];
  discount: number;

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
  checkin_date: Date;
  checkout_date: Date;
  @Output() formValid = new EventEmitter<boolean>();
  bsConfig: Partial<BsDatepickerConfig>;
  showFormSearchResponsive = false;
  user: UserDetail;

  p: any;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  constructor(
    public datePipe: DatePipe,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    protected dashboardService: DashboardService,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: Router,
  ) {}

  ngOnInit() {
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.currency = hotelConstant.METADATA_CURRENCY;
    this.formSubmitError = false;
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    if (this.user) {
      sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.user));
    }
    this.store.select('hotel').subscribe((data) => {
      this.searchHotelListRequest = data.searchHotelListForm || JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
      if (this.searchHotelListRequest && this.searchHotelListRequest.destination) {
        this.searchHotelListResult = data.searchHotelListResult;
        if (this.searchHotelListResult) {
          this.currency = this.searchHotelListResult.currency;
          this.hotelShoppingList = this.searchHotelListResult.hotelInfoList;
          this.sessionId = data.sessionId || sessionStorage.getItem(hotelConstant.SESSION_ID);
          if(data.searchHotelListResult){
            sessionStorage.setItem(appConstant.TRANSACTION_ID,data.searchHotelListResult.traceId);
      
         }
          this.numberOfNight = (new Date(this.searchHotelListRequest.checkoutDate).getTime() -
            new Date(this.searchHotelListRequest.checkinDate).getTime()) / (1000 * 3600 * 24) ;
          this.updateRatingStar(this.searchHotelListResult.hotelInfoList);
          this.hotelListView = [...this.searchHotelListResult.hotelInfoList];
          this.increaseSort(this.hotelListView);
          this.markerList = [];
          this.hotelListView.forEach((hotel, index) => {
            if (index === 0) {
              this.latitude = +hotel.coordinate.latitude;
              this.longitude = +hotel.coordinate.longitude;
            }
            if (index < 10) {
              const markerItem = new MarkerItem();
              markerItem.lat = +hotel.coordinate.latitude;
              markerItem.lng = +hotel.coordinate.longitude;
              markerItem.label = hotel.name;
              markerItem.draggable = true;
              this.markerList.push(markerItem);
            }
          //  console.log(hotel);
          });
        } else {
          this.hotelShoppingList = [];
        }
      } else {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
    });
    // if (!this.fetching) {
    //   if (this.tryFetchData) {
    //     this.fetchHotelList();
    //   }
    //   this.tryFetchData = false;
    // }
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
        this.ratingSort(this.hotelListView);
       // this.alertify.warning(`Popularity currently not support`);
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
  updateHotelListView(data?: any) {
    this.hotelListView = [...data];
   // this.increaseSort(this.hotelListView);
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
    if (this.ratingStarFiler.fiveStar || this.ratingStarFiler.fourStar || this.ratingStarFiler.threeStar
      || this.ratingStarFiler.twoStar || this.ratingStarFiler.oneStar) {
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
    } else {
      this.hotelListView = this.searchHotelListResult.hotelInfoList.filter(
        (item) => {
          return (item.starRating <= 5 && item.starRating > 4) ||
            (item.starRating <= 4 && item.starRating > 3) ||
            (item.starRating <= 3 && item.starRating > 2) ||
            (item.starRating <= 2 && item.starRating > 1) ||
            (item.starRating <= 1 && item.starRating > 0);
        }
      );
    }
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

  closeFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add('hotel-search');
    }
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

  fetchHotelList(event?: HotelShoppingReq) {
    this.store.dispatch(
      new HotelActions.SearchHotelListStart({
        data: event ? event : this.searchHotelListRequest,
      })
    );
  }

  gotoDetail(hotel: HotelInfo) {
    sessionStorage.setItem(hotelConstant.SELECTED_HOTEL_INFO, JSON.stringify(hotel));
    window.open(`#/hotel/hotelDetail/${hotel.code}`, '_blank');
  }

  update(page: any) {
    this.p = page;
  }

  searchHotel(event: HotelShoppingReq) {
    this.store.dispatch(new HotelActions.SearchHotelListStart({ data: event }));
  }
}
