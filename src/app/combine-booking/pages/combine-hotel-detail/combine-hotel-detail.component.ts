import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery';
import {Store} from '@ngrx/store';
import {ModalOptions, BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import 'rxjs/add/observable/interval';
import {Observable, Observer, of, Subscription} from 'rxjs';

import {HotelDetailModel} from 'src/app/model/hotel/hotel-detail/hotelDetailModel';
import {RateDetailList} from 'src/app/model/hotel/hotel-list/rate-detail-list';
import * as fromApp from '../../../store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import {FormGroup, FormControl} from '@angular/forms';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {AwsImgUrl} from 'src/app/model/hotel/hotel-list/aws-img-url';
import {HotelInfo} from 'src/app/model/hotel/hotel-list/hotel-info';
import {RoomsList} from 'src/app/model/hotel/hotel-list/rooms-list';
import {defaultData} from 'src/app/app.constant';
import {HotelImage} from 'src/app/model/hotel/hotel-detail/hotelImage';
import {combineBookingConstant} from '../../combine-booking.constant';
import {CombineShoppingReq} from 'src/app/model/combine/shopping-req';
import {CombineBookingService} from 'src/app/service/combine/combine-booking.service';
import {HotelCombineDetailResponse} from '../../../model/combine/hotel-combine-detail-res';
import {hotelConstant, hotelProvider} from '../../../hotel/hotel.constant';
import {packagesConstant} from '../../../packages/packages.constant';

@Component({
  selector: 'app-combine-hotel-detail',
  templateUrl: './combine-hotel-detail.component.html',
  styleUrls: ['./combine-hotel-detail.component.css']
})
export class CombineHotelDetailComponent implements OnInit, OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  defaultImages: NgxGalleryImage[];

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  sub: Subscription;
  p: any;
  showFormSearchResponsive = false;
  searchForm: FormGroup;
  travellerCount: number;
  roomCount: number;
  defaultHotelImage: string;

  hotelDetailRes: HotelDetailModel;
  mappType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  currency: string;
  defaultDiscount: number;
  searchHotelListRequest: CombineShoppingReq;
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
  selectedHotelProvider: string;
  hotelProvider = hotelProvider;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private combineService: CombineBookingService,
    private store: Store<fromApp.AppState>,
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
    this.selectedHotelProvider = sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL_PROVIDER) || hotelProvider.NUITEE;
    if (this.selectedHotelProvider === hotelProvider.NUITEE) {
      this.updateNuiteeHotelDetail();
    } else {
      this.updateNctHotelDetail();
    }
    this.currency = sessionStorage.getItem(combineBookingConstant.METADATA_CURRENCY) || 'USD';
  }

  imageSlider2(imgColection: HotelImage[]) {
    imgColection.forEach((img, index) => {
      if (index == 0) {
        this.galleryImages = [];
      }
      this.galleryImages.push({
        small: `${img.thumbnailUrl}`,
        medium: `${img.thumbnailUrl}`,
        big: `${img.thumbnailUrl}`,
      });
    });
  }

  refeshData() {
    if (this.searchHotelListRequest) {
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

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl(),
    });
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

  imageSlider(imgColection: AwsImgUrl[]) {
    // this.galleryImages = [];
    imgColection.forEach((img, index) => {
      if (index == 0) {
        this.galleryImages = [];
      }
      this.galleryImages.push({
        small: `${img.baseUrl}/${img.name}`,
        medium: `${img.baseUrl}/${img.name}`,
        big: `${img.baseUrl}/${img.name}`,
      });
    });
  }

  imageExists(image_url): boolean {

    const http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status !== 404;

  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  initialloadImageGallery() {
    this.galleryImages = [];
    for (let i = 0; i <= 5; i++) {
      this.galleryImages.push({
        small: defaultData.noImage,
        medium: defaultData.noImage,
        big: defaultData.noImage,
      });
    }
  }


  processData(res: HotelCombineDetailResponse) {
    if (res) {
      this.hotelDetailRes = res.hotelNuitee;
      this.hotelDetailRes.rateDetails.rateDetails[0].rooms.rooms.forEach(
        (r: RoomsList) => {
          this.minPricePerNight += +r.roomRate.initialPricePerNight[0];
        }
      );
      this.numberOfNight = this.hotelDetailRes.rateDetails.rateDetails[0].rooms.rooms[0].roomRate.initialPricePerNight.length;
      // if(!this.galleryImages){
      this.imageSlider(this.hotelDetailRes.awsImageList);
    }
  }

  goFlightList(room: RateDetailList) {
    sessionStorage.setItem(
      combineBookingConstant.SELECTED_ROOM_DETAIL,
      JSON.stringify(room)
    );
    this.route.navigate(['../../flightList'], {relativeTo: this.activeRoute});
  }

  private updateNuiteeHotelDetail() {
    sessionStorage.setItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST,
      sessionStorage.getItem(combineBookingConstant.SEARCH_HOTEL_LIST_REQUEST));
    sessionStorage.setItem(hotelConstant.SELECTED_HOTEL_INFO, sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL));
    sessionStorage.setItem(hotelConstant.SESSION_ID, sessionStorage.getItem(combineBookingConstant.SESSION_ID));
  }

  private updateNctHotelDetail() {
    // packagesConstant.PACKAGE_SHOPPING_REQ
    // sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE)
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
