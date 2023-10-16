 import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as fromApp from 'src/app/store/app.reducer';
import * as PackagesActions from 'src/app/packages/store/packages.actions';
import { packagesConstant } from 'src/app/packages/packages.constant';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { HotelPackageDetailReq } from 'src/app/model/packages/consumer/hotel-package-detail-req';
import { defaultData } from 'src/app/app.constant';
import { SupplementPackageReq } from 'src/app/model/packages/consumer/supplement-package-req';
import { Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import * as PackageActions from 'src/app/packages/store/packages.actions';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';

@Component({
  selector: 'app-package-hotel',
  templateUrl: './package-hotel.component.html',
  styleUrls: ['./package-hotel.component.css']
})
export class PackageHotelComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  bsModalRef: BsModalRef;
  searchForm: FormGroup;
  packageHotelDetailRes: HotelPackageDetailRes[];
  mapType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  currency: string;
  defaultDiscount: number;
  packageShoppingReq: PackageShoppingReq;

  checkin_date: Date;
  checkout_date: Date;
  selectedPackage: PackageShoppingRes;
  starRating: number;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchData = true;
  minPricePerNight = 0;
  numberOfNight = 1;

  defaultData: string;
  minDay = 0;
  maxDay = 100;

  destinationName: string;
  cityCode: string;

  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  formSubmitError: boolean;
  bsConfig: Partial<BsDatepickerConfig>;
  minDateStart: NgbDateStruct;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  today: Date;
  showFormSearchResponsive = false;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];
  showDropDown: boolean;
  @ViewChild('menuDrop', { static: false }) menuDrop: ElementRef;
  defaultHotelImage: string;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    public datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    this.defaultHotelImage = defaultData.noImage;
    this.defaultData = defaultData.noImage;
    this.formSubmitError = false;
    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear() };
    this.showDropDown = false;
    this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.packageShoppingReq = data.searchPackageListReq || JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.packageShoppingReq && this.packageShoppingReq.destination) {
        this.updateFormValue();
        this.refreshData();
        this.startDate = this.convertDateStrToNgbDate(this.packageShoppingReq.date);
        this.endDate = this.convertDateStrToNgbDate(this.packageShoppingReq.endDate);
      } else {
        this.route.navigate(['/dashboard/packages']);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
      if (this.selectedPackage && this.selectedPackage.id) {
        this.numberOfNight = this.selectedPackage.dayCount - 1;
        this.currency = this.selectedPackage.currency;
        this.defaultDiscount = this.selectedPackage.discount;
        this.latitude = this.selectedPackage.latitude || defaultData.lat;
        this.longitude = this.selectedPackage.longitude || defaultData.lng;
        this.marker = {
          lat: this.latitude,
          lng: +this.longitude,
          label: this.selectedPackage.name,
          draggable: true,
        };
        this.starRating = Math.ceil(this.selectedPackage.starRate || defaultData.rate);
        this.packageHotelDetailRes = data.packageHotelDetailRes;
        if (!this.galleryImages && this.selectedPackage.roomImages.length > 0) {
          this.imageSlider(this.selectedPackage.roomImages);
        }
      } else {
        this.route.navigate(['/dashboard/packages']);
      }
    });
    this.fetchHotelDetail();
  }

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
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

  fetchHotelDetail() {
    const hotelDetailReq = new HotelPackageDetailReq();
    hotelDetailReq.hotelId = this.selectedPackage.hotelId;
    this.store.dispatch(
      new PackagesActions.PackagesHotelDetailStart({
        data: hotelDetailReq
      })
    );
  }

  goToSupplement(room: HotelPackageDetailRes) {
    sessionStorage.setItem(packagesConstant.SELECTED_ROOM, JSON.stringify(room));
    const packageSupplementReq = new SupplementPackageReq();
    // packageSupplementReq.hotelId =  this.selectedPackage.hotelId;
    // this.store.dispatch(
    //   new PackagesActions.PackagesSupplementStart({
    //     data: packageSupplementReq
    //   })
    // );
    this.route.navigate(['../summary'], { relativeTo: this.activeRoute });
  }
  updateFormValue() {
    (this.searchForm.get('destination') as FormControl).patchValue(this.packageShoppingReq.destination);
    this.destinationName = this.packageShoppingReq.destination;
    this.cityCode = this.packageShoppingReq.cityCode;
    this.minDay = this.packageShoppingReq.minDay;
    this.maxDay = this.packageShoppingReq.maxDay;
  }
  shoppingPackage(event: PackageShoppingReq) {
    this.store.dispatch(new PackageActions.SearchPackagesListStart(
      { data: event }));
    // console.log(searchRequest);
    // this.route.navigate(['#/specialPackages']);
    this.route.navigate(["../list"], {relativeTo: this.activeRoute});
  }


  convertDateStrToNgbDate(data: string): NgbDateStruct {
    const dataDate: Array<string> = data.split('-');
    return { day: +dataDate[2], month: +dataDate[1], year: +dataDate[0] };
  }

  showFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = true;
    if (this.showFormSearchResponsive) {
      myTag.classList.remove('hotel-search');
    }
  }

  refreshData() {
    if (this.packageShoppingReq) {
      this.travellerCount = 0;
      this.roomCount = 0;
      (this.packageShoppingReq.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
      this.updateRoomGuests(this.packageShoppingReq.rooms);
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }

  updateRoomGuests(roomGuestsNew: RoomGuest[]) {
    if (roomGuestsNew) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = roomGuestsNew;
      this.roomGuestsNew = roomGuestsNew;
      (roomGuestsNew as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
    // this.roomGuestsNew = roomGuestsNew;
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
