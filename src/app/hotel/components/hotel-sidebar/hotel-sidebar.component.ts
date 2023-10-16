import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Marker } from '@agm/core';
import { HotelInfo } from '../../../model/hotel/hotel-list/hotel-info';
import { AlertifyService } from '../../../service/alertify.service';
import { RatingStarCount } from '../../../model/hotel/hotel-list/rating-star-count';
import { RatingStarFilter } from '../../../model/hotel/hotel-list/rating-star-filter';
import { HotelSort } from '../../../model/enum/hotel-sort';
import { MarkerItem } from '../../../model/common/marker-item';
import { Observable, Observer, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-hotel-sidebar',
  templateUrl: './hotel-sidebar.component.html',
  styleUrls: ['./hotel-sidebar.component.css']
})

export class HotelSidebarComponent implements OnInit {
  @Input() hotelShoppingList: HotelInfo[];
  @Input() isShowFilter: boolean = true;
  @Output() hotelListViewChange = new EventEmitter<HotelInfo[]>();
  hotelListView: HotelInfo[];
  mapType = 'hybrid';

  latitude: number;
  longitude: number;
  marker: Marker;
  markerList: MarkerItem[];
  sortType: HotelSort;

  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;

  suggestions$: Observable<HotelInfo[]>;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  formSubmitError: boolean;

  hotelName: string;
  cityCode: string;

  constructor(
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.formSubmitError = false;

    if (this.hotelShoppingList && this.hotelShoppingList.length > 0) {
      this.updateRatingStar(this.hotelShoppingList);
      this.hotelListView = [...this.hotelShoppingList];
      this.increaseSort(this.hotelListView);
      this.markerList = [];
      console.log(this.hotelListView.length + 'marker');
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
      });
    } else {
      this.hotelListView = [];
    }
    this.updateHotelListView();
    this.searchHotelInfo();
  }

  searchHotelInfo() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
        this.limit = 7;
        observer.next(this.search);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return of(this.hotelShoppingList).pipe(
            map((data: HotelInfo[]) => {
              const result = data.filter(hotel => {
                const isContain = hotel.name.toLocaleUpperCase().indexOf(query.toLocaleUpperCase());
                if (isContain < 0) {
                  return false;
                } else {
                  return true;
                }
              });
              this.searchFailed = false;
              return result || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  select(des: any) {
    this.hotelName = des.name;
    this.cityCode = des.code;
    this.hotelListView = this.hotelShoppingList.filter(hotel => hotel.name === this.hotelName);
    this.updateHotelListView();
  }

  fullScreenMap() {
    sessionStorage.setItem('hotelListView', JSON.stringify(this.hotelListView));
    window.open(`#/hotelMap/fullMap`, '_blank');
  }

  updateHotelListView() {
    this.hotelListViewChange.emit(this.hotelListView);
  }

  updateHotelListViewByFieldSearch() {
    this.search = '';
    this.hotelListView = this.hotelShoppingList;
    this.updateHotelListView();
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
        this.ratingSort(this.hotelListView);
      //  this.alertify.warning(`Popularity currently not support`);
        break;
      case 'new':
        this.alertify.warning(`Newest currently not support`);
        break;
      case 'rating':
        this.ratingSort(this.hotelListView);
        break;
    }
    this.updateHotelListView();
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
    this.updateHotelListView();
  }

  fourStarFilter() {
    this.ratingStarFiler.fourStar = !this.ratingStarFiler.fourStar;
    this.ratingStartFilter();
    this.updateHotelListView();
  }

  threeStarFilter() {
    this.ratingStarFiler.threeStar = !this.ratingStarFiler.threeStar;
    this.ratingStartFilter();
    this.updateHotelListView();
  }

  twoStarFilter() {
    this.ratingStarFiler.twoStar = !this.ratingStarFiler.twoStar;
    this.ratingStartFilter();
    this.updateHotelListView();
  }

  oneStarFilter() {
    this.ratingStarFiler.oneStar = !this.ratingStarFiler.oneStar;
    this.ratingStartFilter();
    this.updateHotelListView();
  }

  ratingStartFilter() {
    if (this.ratingStarFiler.fiveStar || this.ratingStarFiler.fourStar || this.ratingStarFiler.threeStar
      || this.ratingStarFiler.twoStar || this.ratingStarFiler.oneStar) {
      this.hotelListView = this.hotelShoppingList.filter(
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
      this.hotelListView = this.hotelShoppingList.filter(
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
}
