import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HotelPackageDetailRes} from '../../../model/packages/consumer/hotel-package-detail-res';
import {PackageShoppingReq} from '../../../model/packages/consumer/package-shopping-req';
import {PackageShoppingRes} from '../../../model/packages/consumer/package-shopping-res';
import {Observable, Observer, of} from 'rxjs';
import {DestinationRes} from '../../../model/dashboard/desRes.model';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {RoomGuest} from '../../../model/dashboard/hotel/room-guest';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import {DashboardService} from '../../../service/dashboard/dashboard.service';
import {DatePipe} from '@angular/common';
import {packagesConstant} from '../../../packages/packages.constant';
import {HotelPackageDetailReq} from '../../../model/packages/consumer/hotel-package-detail-req';
import {SupplementPackageReq} from '../../../model/packages/consumer/supplement-package-req';
import {map, switchMap, tap} from 'rxjs/operators';
import * as PackageActions from '../../../packages/store/packages.actions';
import { defaultData } from 'src/app/app.constant';

@Component({
  selector: 'app-combine-nct-hotel-detail',
  templateUrl: './combine-nct-hotel-detail.component.html',
  styleUrls: ['./combine-nct-hotel-detail.component.css']
})
export class CombineNctHotelDetailComponent implements OnInit {
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
  showDropDown: boolean;
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    public datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    this.defaultData = defaultData.noImage;
    this.formSubmitError = false;
    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};
    this.showDropDown = false;

    this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.packageShoppingReq = data.searchPackageListReq || JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.packageShoppingReq) {
        this.updateFormValue();
        this.startDate = this.convertDateStrToNgbDate(this.packageShoppingReq.date);
        this.endDate = this.convertDateStrToNgbDate(this.packageShoppingReq.endDate);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
      if (this.selectedPackage) {
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
    if (!this.fetching) {
      if (this.tryFetchData) {
        this.fetchHotelDetail();
      }
      this.tryFetchData = false;
    }
    this.refreshData();
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
    hotelDetailReq.hotelId =  this.selectedPackage.hotelId;
    this.store.dispatch(
      new PackageActions.PackagesHotelDetailStart({
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

  getDayCount() {
    const date1 = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    const date2 = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    const days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);

    if (days < 1) {
      this.minDay = 0;
      this.maxDay = 1;
    } else if (days >= 1 && days <= 7) {
      this.minDay = 1;
      this.maxDay = 7;
    } else if (days <= 14 && days >= 8) {
      this.minDay = 8;
      this.maxDay = 14;
    } else if (days <= 21 && days >= 15) {
      this.minDay = 8;
      this.maxDay = 21;
    } else if (days >= 22) {
      this.minDay = 22;
      this.maxDay = 100;
    }
  }

  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.dashboardService.getDestination(this.search).pipe(
            map((data: DestinationRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => {
              this.searching = false;
            }, err => {
              // in case of http error
              this.limit = 0;
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }

  updateFormValue() {
    (this.searchForm.get('destination') as FormControl).patchValue(this.packageShoppingReq.destination);
    this.destinationName = this.packageShoppingReq.destination;
    this.cityCode = this.packageShoppingReq.cityCode;
    this.minDay = this.packageShoppingReq.minDay;
    this.maxDay = this.packageShoppingReq.maxDay;
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  shoppingPackage() {
    const d: any = this.searchForm.value;
    const searchRequest: PackageShoppingReq = new PackageShoppingReq();
    searchRequest.destination = this.destinationName;
    searchRequest.cityCode = this.cityCode;
    searchRequest.date = this.datePipe.transform(this.convertNgbDateToDate(this.startDate), 'yyyy-MM-dd');
    searchRequest.endDate = this.datePipe.transform(this.convertNgbDateToDate(this.endDate), 'yyyy-MM-dd');
    this.getDayCount();
    searchRequest.minDay = this.minDay;
    searchRequest.maxDay = this.maxDay;
    sessionStorage.setItem(
      packagesConstant.PACKAGE_SHOPPING_REQ,
      JSON.stringify(searchRequest)
    );
    this.store.dispatch(new PackageActions.SearchPackagesListStart(
      { data: searchRequest }));
    // console.log(searchRequest);
    this.route.navigate(['/packages']);
  }

  getStartDate(data: NgbDate) {
    this.startDate = data;
  }

  convertDateStrToNgbDate(data: string): NgbDateStruct {
    const dataDate: Array<string> = data.split('-');
    return {day: +dataDate[2], month: +dataDate[1], year: +dataDate[0]};
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

  getEndDate(data: NgbDate) {
    this.endDate = data;
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  updateRoomGuests(roomGuestsNew: RoomGuest[]) {
    if (roomGuestsNew) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = roomGuestsNew;
      (roomGuestsNew as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    const menuDropClick = btn.className  === this.menuDrop.nativeElement.className;
    const dropDown =  btn.closest('app-room-guests');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }
  }

  refreshData() {
    this.travellerCount = 1;
    this.roomCount = 1;
    this.roomGuests = [];
    const roomGuestInitial: RoomGuest = new RoomGuest();
    roomGuestInitial.adult = 1;
    roomGuestInitial.children = 0;
    this.roomGuests.push(roomGuestInitial);
  }
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
