import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery';
import {Store} from '@ngrx/store';
import 'rxjs/add/observable/interval';
import {Observable, Subscription} from 'rxjs';

import {HotelDetailModel} from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import {RateDetailList} from 'src/app/model/hotel/hotel-list/rate-detail-list';
import * as fromApp from 'src/app/store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {HotelInfo} from 'src/app/model/hotel/hotel-list/hotel-info';
import {hotelConstant} from 'src/app/hotel/hotel.constant';
import {RoomsList} from 'src/app/model/hotel/hotel-list/rooms-list';
import {appConstant, defaultData} from 'src/app/app.constant';
import {RoomGuest} from 'src/app/model/dashboard/hotel/room-guest';
import {DestinationRes} from 'src/app/model/dashboard/desRes.model';
import {DashboardService} from 'src/app/service/dashboard/dashboard.service';
import {DatePipe} from '@angular/common';
import {HotelImage} from 'src/app/model/hotel/hotel-detail/hotelImage';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css'],
})
export class HotelDetailComponent implements OnInit, OnDestroy {
  @Input() refLink: string;
  @Output() formValid = new EventEmitter<boolean>();
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  sub: Subscription;
  p: any;

  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  defaultHotelImage: string;

  hotelDetailRes: HotelDetailModel;
  mappType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  currency: string;
  defaultDiscount: number;
  searchHotelListRequest: HotelShoppingReq;
  sessionId: string;

  checkin_date: Date;
  checkout_date: Date;
  selectedHotel: HotelInfo;
  starRating: number;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata = true;
  minPricePerNight = 0;
  numberOfNight = 1;

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

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    public datePipe: DatePipe,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.refLink = '../../hotelSummary';
    this.defaultHotelImage = defaultData.noImage;
    this.initialGalleryOptions();
    this.initialLoadImageGallery();
    this.currency = sessionStorage.getItem(hotelConstant.CURRENCY) || hotelConstant.METADATA_CURRENCY;
    this.defaultDiscount = hotelConstant.DISCOUNT;
    this.formSubmitError = false;
    this.showDropDown = false;
    this.store.select('hotel').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchHotelListRequest = data.searchHotelListForm || JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
      this.sessionId = data.sessionId || sessionStorage.getItem(hotelConstant.SESSION_ID);
      if (this.searchHotelListRequest && this.searchHotelListRequest.destination) {
        this.selectedHotel = data.selectedHotel || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
        if (this.selectedHotel && this.selectedHotel.coordinate) {
          this.latitude = this.selectedHotel.coordinate.latitude;
          this.longitude = this.selectedHotel.coordinate.longitude;
          this.marker = {
            lat: +this.selectedHotel.coordinate.latitude,
            lng: +this.selectedHotel.coordinate.longitude,
            label: this.selectedHotel.name,
            draggable: true,
          };
          this.starRating = Math.ceil(this.selectedHotel.starRating);

        } else {
          this.fetchFailed = true;
        }
        if (data.selectedHotelDetail) {
          this.currency = data.selectedHotelDetail.currency;
          this.hotelDetailRes = data.selectedHotelDetail;
          this.hotelDetailRes.rateDetails.rateDetails[0].rooms.rooms.forEach(
            (r: RoomsList) => {
              this.minPricePerNight = +r.roomRate.initialPricePerNight[0];
            }
          );
          this.numberOfNight = this.hotelDetailRes.rateDetails.rateDetails[0].rooms.rooms[0].roomRate.initialPricePerNight.length;
          this.imageSlider2(this.hotelDetailRes.hotelImages);
        }
      } else {
        this.fetchFailed = true;
      }
    });
    if (!this.fetching) {
      if (this.tryFetchdata) {
        this.fetHotelDetail();
      }
      this.tryFetchdata = false;
    }
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

  initialGalleryOptions() {
    this.galleryOptions = [
      {
        lazyLoading: true,
        width: '100%',
        height: '500px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Fade,
      },
      // max-width 800
      {
        lazyLoading: true,
        breakpoint: 500,
        width: '100%',
        height: 'auto',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 5,
        thumbnailMargin: 10,
      },
      // max-width 400
      {
        lazyLoading: true,
        breakpoint: 500,
        preview: false,
      },
    ];
  }

  imageSlider2(imgCollection: HotelImage[]) {
    imgCollection.forEach((img, index) => {
      if (img.thumbnailUrl) {
        if (index == 0) {
          this.galleryImages = [];
        }
        this.galleryImages.push({
          small: `${img.thumbnailUrl}`,
          medium: `${img.thumbnailUrl}`,
          big: `${img.thumbnailUrl}`,
        });
      }
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  initialLoadImageGallery() {
    this.galleryImages = [];
    for (let i = 0; i <= 5; i++) {
      this.galleryImages.push({
        small: defaultData.noImage,
        medium: defaultData.noImage,
        big: defaultData.noImage,
      });
    }
  }

  fetHotelDetail() {
    this.store.dispatch(
      new HotelActions.FetchHotelDetailStart({
        data: this.selectedHotel,
        sessionId: this.sessionId,
      })
    );
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  searchHotel(event: HotelShoppingReq) {
    this.store.dispatch(new HotelActions.SearchHotelListStart({data: event}));
    this.route.navigate(['./../../hotelList'], {relativeTo: this.activeRoute});
  }

  goToSummary(room: RateDetailList) {
    sessionStorage.setItem(
      hotelConstant.SELECTED_ROOM_DETAIL,
      JSON.stringify(room)
    );
    this.store.dispatch(
      new HotelActions.CheckRoomAvailableStart({
        data: room,
        sessionId: this.sessionId,
        hotelCode: +this.selectedHotel.code,
      })
    );
    this.route.navigate([this.refLink], {relativeTo: this.activeRoute});
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
