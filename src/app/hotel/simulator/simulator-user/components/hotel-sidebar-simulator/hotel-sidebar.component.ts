import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Marker } from '@agm/core';
import { HotelInfoSimulator } from '../../../../../model/hotel/simulator/hotel-info-simulator';
import { AlertifyService } from '../../../../../service/alertify.service';
import { RatingStarCount } from '../../../../../model/hotel/hotel-list/rating-star-count';
import { RatingStarFilter } from '../../../../../model/hotel/hotel-list/rating-star-filter';
import { MarkerItem } from '../../../../../model/common/marker-item';
import { Observable, Observer, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-hotel-sidebar-simulator',
  templateUrl: './hotel-sidebar.component.html',
  styleUrls: ['./hotel-sidebar.component.css']
})

export class HotelSidebarComponent implements OnInit {
  @Input() hotelShoppingList: HotelInfoSimulator[];
  @Output() hotelListViewChange = new EventEmitter<HotelInfoSimulator[]>();
  hotelListView: HotelInfoSimulator[];
  mapType = "hybrid";

  latitude: number;
  longitude: number;
  marker: Marker;
  markerList: MarkerItem[];

  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;

  suggestions$: Observable<HotelInfoSimulator[]>;
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
      this.hotelListView.forEach((hotel, index) => {
        if(index === 0){
          this.latitude = +hotel.latitude;
          this.longitude = +hotel.longitude;
        }
        if (index < 10) {
          const markerItem = new MarkerItem();
          markerItem.lat = +hotel.latitude;
          markerItem.lng = +hotel.longitude;
          markerItem.label = hotel.name;
          markerItem.draggable = true;
          this.markerList.push(markerItem);
        }
      })
    } else {
      this.hotelListView = [];
    }
    this.updateHotelListView();
    this.searchHotelInfo();
  }

  searchHotelInfo() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length >= 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return of(this.hotelShoppingList).pipe(
            map((data: HotelInfoSimulator[]) => {
              let result = data.filter(hotel => {
                const isContain = hotel.name.toLocaleUpperCase().indexOf(query.toLocaleUpperCase());
                if (isContain < 0) {
                  return false;
                } else {
                  return true;
                }
              })
              this.searchFailed = false;
              return result || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
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
    sessionStorage.setItem("hotelListView", JSON.stringify(this.hotelListView));
    window.open(`#/hotelMap/fullMap`, '_blank');
  }

  updateHotelListView(){
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
      case "priceIncrease":
        this.increaseSort(this.hotelListView);
        break;
      case "priceDecrease":
        this.decreaseSort(this.hotelListView);
        break;
      case "popularity":
        // this.ratingStar.threeStar++;
        this.alertify.warning(`Popularity currently not support`);
        break;
      case "new":
        this.alertify.warning(`Newest currently not support`);
        break;
      case "rating":
        this.ratingSort(this.hotelListView);
        break;
    }
    this.updateHotelListView();
  }

  increaseSort(hotelListView: HotelInfoSimulator[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.minPrice > b.minPrice ? 1 : -1
    );
  }

  decreaseSort(hotelListView: HotelInfoSimulator[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.minPrice < b.minPrice ? 1 : -1
    );
  }

  ratingSort(hotelListView: HotelInfoSimulator[]) {
    this.hotelListView = hotelListView.sort((a, b) =>
      a.starRate < b.starRate ? 1 : -1
    );
  }

  updateRatingStar(hotelList: HotelInfoSimulator[]) {
    hotelList.map((item) => {
      const star = item.starRate;
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
              item.starRate <= 5 &&
              item.starRate > 4) ||
            (this.ratingStarFiler.fourStar &&
              item.starRate <= 4 &&
              item.starRate > 3) ||
            (this.ratingStarFiler.threeStar &&
              item.starRate <= 3 &&
              item.starRate > 2) ||
            (this.ratingStarFiler.twoStar &&
              item.starRate <= 2 &&
              item.starRate > 1) ||
            (this.ratingStarFiler.oneStar &&
              item.starRate <= 1 &&
              item.starRate > 0);
        }
      );
    } else {
      this.hotelListView = this.hotelShoppingList.filter(
        (item) => {
          return (item.starRate <= 5 && item.starRate > 4) ||
            (item.starRate <= 4 && item.starRate > 3) ||
            (item.starRate <= 3 && item.starRate > 2) ||
            (item.starRate <= 2 && item.starRate > 1) ||
            (item.starRate <= 1 && item.starRate > 0);
        }
      );
    }
  }
}
