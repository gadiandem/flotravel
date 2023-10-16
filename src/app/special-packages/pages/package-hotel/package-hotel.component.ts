import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery';
import { Store } from '@ngrx/store';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from '../../store/special-packages.actions';
import { specialPackagesConstant } from '../../special-packages.constant';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { HotelPackageDetailReq } from 'src/app/model/packages/consumer/hotel-package-detail-req';
import { defaultData } from 'src/app/app.constant';
import { SupplementPackageReq } from 'src/app/model/packages/consumer/supplement-package-req';
import { SpecialPackageSearchDialogComponent } from '../../dialogs/package-search-dialog/package-search-dialog.component';
import { RoomGuest } from '../../../model/dashboard/hotel/room-guest';
import * as PackageActions from '../../../packages/store/packages.actions';

@Component({
  selector: 'app-package-hotel',
  templateUrl: './package-hotel.component.html',
  styleUrls: ['./package-hotel.component.css']
})
export class PackageHotelComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  searchForm: FormGroup;
  adultCount: number;
  childCount: number;
  travellerCount: number;
  roomCount: number;

  packageHotelDetailRes: HotelPackageDetailRes[];
  mappType = 'roadmap';
  latitude: number;
  longitude: number;
  marker: Marker;
  currency: string;
  defaultDiscount: number;
  packageShoppingReq: PackageShoppingReq;
  showFormSearchResponsive = false;
  checkin_date: Date;
  checkout_date: Date;
  selectedPackage: PackageShoppingRes;
  starRating: number;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  tryFetchdata = true;
  minPricePerNight = 0;
  numberOfNight = 1;
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.initForm();
    this.bsConfig = new ModalOptions();
    this.travellerCount = 1;
    this.adultCount = 1;
    this.childCount = 0;
    this.roomCount = 1;
    this.store.select('specialPackagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.packageShoppingReq = data.searchPackageListReq || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ));
      if (!this.packageShoppingReq || !this.packageShoppingReq.destination) {
        this.route.navigate(['/dashboard/specialPackages']);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_PACKAGE));
      if (this.selectedPackage) {
        this.refreshData();
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
      }
    });
    this.fetchHotelDetail();
  }
  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl(),
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

  openModalWithComponent() {
    const initialState = {
      searchData: this.packageShoppingReq,
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      SpecialPackageSearchDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  goToSupplement(room: HotelPackageDetailRes) {
    sessionStorage.setItem(specialPackagesConstant.SELECTED_ROOM, JSON.stringify(room));
    const packageSupplementReq = new SupplementPackageReq();
    // packageSupplementReq.hotelId =  this.selectedPackage.hotelId;
    // this.store.dispatch(
    //   new PackagesActions.PackagesSupplementStart({
    //     data: packageSupplementReq
    //   })
    // );
    this.route.navigate(['../optional'], { relativeTo: this.activeRoute });
  }

  shoppingPackage(event: PackageShoppingReq) {
    this.store.dispatch(new PackageActions.SearchPackagesListStart(
      { data: event }));
    // console.log(searchRequest);
    // this.route.navigate(['/specialPackages']);
    this.route.navigate(["../list"], {relativeTo: this.activeRoute});
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
