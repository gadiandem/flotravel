import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery';
import 'rxjs/add/observable/interval';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { defaultData} from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { RoomGuest } from '../../../../model/dashboard/hotel/room-guest';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';
import { HotelInfo } from '../../../../model/hotel/hotel-list/hotel-info';
import { hotelConstant } from '../../../hotel.constant';
import { Flight } from '../../../../model/flight/flight-list/flight';
import { HotelDetailModel } from '../../../../model/hotel/hotel-detail/hotelDetailModel';

@Component({
  selector: 'app-hotel-simulator-detail',
  templateUrl: './hotel-detail-simulator.component.html',
  styleUrls: ['./hotel-detail-simulator.component.css']
})
export class HotelSimulatorDetailsComponent implements OnInit {
  @Input() selectedHotel: HotelInfo;
  @Input() hotelShoppingReq: HotelShoppingReq;
  @Input() hotelDetailRes: HotelDetailModel;
  @Input() fetchFailed: boolean;
  @Input() errorMes: string;
  @Input() showFlight: boolean;
  @Input() flightMin: Flight;
  @Input() flightMinReturn: Flight;
  @Input() totalTripPriceFlight: number;
  @Output() fetchHotelDetailEvent = new EventEmitter<any>();
  @Output() gotoSummaryPage = new EventEmitter<any>();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  isCollapsed: boolean;
  isCollapsedReturn: boolean;
  defaultHotelImage: string;
  mapType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  currency: string;
  starRating: number;
  numberOfNight = 1;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  minPricePerNight = 0;
  numberOfRoom = 1;
  hourDuration: number;
  minuteDuration: number;
  numberOfFlight: number;
  numberOfFlightReturn: number;

  constructor(
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    // this.initialLoadImageGallery();
    window.scroll(0, 0);
    this.isCollapsed = true;
    this.isCollapsedReturn = true;
    this.defaultHotelImage = defaultData.noImage;
    this.currency =  hotelConstant.METADATA_CURRENCY;
    if (this.flightMin) {
      this.numberOfFlight = this.flightMin.flightSegments.length;
    }
    if (this.flightMinReturn) {
      this.numberOfFlightReturn = this.flightMinReturn.flightSegments.length;
    }
    if (this.selectedHotel) {
      this.latitude = this.selectedHotel.coordinate.latitude;
      this.longitude = this.selectedHotel.coordinate.longitude;
      this.marker = {
        lat: +this.latitude,
        lng: +this.longitude,
        label: this.selectedHotel.name,
        draggable: true,
      };
      this.starRating = Math.ceil(this.selectedHotel.starRating);
    }
    if (this.hotelShoppingReq) {
      this.getNumberOfNight();
      this.numberOfRoom = this.hotelShoppingReq.rooms.length;
      this.minPricePerNight = (this.selectedHotel.minPrice / this.numberOfRoom) / this.numberOfNight;
    }
    if (!this.galleryImages && this.selectedHotel.roomImages.length > 0) {
      this.imageSlider(this.selectedHotel.roomImages);
    }
    this.refreshData();
  }

  fetchHotelDetail() {
    this.fetchHotelDetailEvent.emit();
  }

  refreshData() {
    if (this.hotelShoppingReq) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = this.hotelShoppingReq.rooms;
      (this.hotelShoppingReq.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }

  getNumberOfNight() {
    this.numberOfNight = Math.ceil(((new Date(this.hotelShoppingReq.checkoutDate)).getTime()
      - (new Date(this.hotelShoppingReq.checkinDate)).getTime()) / (24 * 3600 * 1000));
  }

  imageSlider(imgColection: string[]) {
    this.galleryOptions = [
      {
        width: '100%',
        height: '500px',
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Fade,
      },
      // max-width 800
      {
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
        breakpoint: 500,
        preview: false,
      },
    ];
    this.galleryImages = [];
    if (imgColection.length > defaultData.hotelRoomImageCount) {
      imgColection.forEach((img) => {
        this.galleryImages.push({
          small: `${img}`,
          medium: `${img}`,
          big: `${img}`,
        });
      });
    } else {
      imgColection.forEach((img) => {
        this.galleryImages.push({
          small: `${img}`,
          medium: `${img}`,
          big: `${img}`,
        });
      });
      for (let i = 0; i <= (defaultData.hotelRoomImageCount - imgColection.length); i++) {
        this.galleryImages.push({
          small: defaultData.noImage,
          medium: defaultData.noImage,
          big: defaultData.noImage,
        });
      }
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

  getArrivalCode(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrAirportCode;
    } else {
      return data.flightSegments[0].arrAirportCode;
    }
  }

  getArrivalTime(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrDateTime;
    } else {
      return data.flightSegments[0].arrDateTime;
    }
  }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if (data.flightSegments.length > 1) {
      data.flightSegments.forEach(segment => {
        const  hour = segment.duration.split('H')[0];
        const  minute  = segment.duration.split('M')[0].split('H')[1];
        this.hourDuration += +hour;
        this.minuteDuration += +minute;
        if (this.minuteDuration >= 60) {
          this.hourDuration += 1;
          this.minuteDuration -= 60;
        }
      });
      return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
    } else {
      return data.flightSegments[0].duration;
    }
  }

  goToSummary(room: HotelRoomSimulator) {
    this.gotoSummaryPage.emit(room);
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
