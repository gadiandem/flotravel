import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from 'src/app/packages/store/packages.actions';
import { appConstant, defaultData } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { packagesConstant } from '../../packages.constant';
import { HotelPackageDetailReq } from 'src/app/model/packages/consumer/hotel-package-detail-req';
import { RegionPackage } from 'src/app/model/packages/provider/region';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { Observable, Observer, of } from 'rxjs';
import { DestinationRes } from '../../../model/dashboard/desRes.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { map, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import * as PackageActions from '../../store/packages.actions';
import { RatingStarCount } from '../../../model/hotel/hotel-list/rating-star-count';
import { RatingStarFilter } from '../../../model/hotel/hotel-list/rating-star-filter';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomGuest } from '../../../model/dashboard/hotel/room-guest';

@Component({
  selector: 'app-package-shopping',
  templateUrl: './package-shopping.component.html',
  styleUrls: ['./package-shopping.component.css']
})
export class PackageShoppingComponent implements OnInit {
  bsModalRef: BsModalRef;

  packageShoppingForm: FormGroup;
  packageShoppingReq: PackageShoppingReq;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  currency: string;
  mapOpen = false;
  selectedPackage: PackageShoppingRes;
  packageShoppingRes: PackageShoppingRes[];
  packagesListView: PackageShoppingRes[];
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  p = 1;
  readMore : boolean[];
  adultCount = 1;
  childCount = 0;
  tryFetchTour = true;
  regionList: RegionPackage[];
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
  filterOpen = false;
  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;
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

  constructor(public datePipe: DatePipe,
              private providerService: PakageProviderService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private store: Store<fromApp.AppState>,
              private alertify: AlertifyService,
              protected dashboardService: DashboardService,
              private renderer: Renderer2,
              private el: ElementRef
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    this.defaultData = defaultData.noImage;
    this.regionList = [];
    this.packageShoppingRes = [];
    this.packagesListView = [];
    this.formSubmitError = false;
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};
    this.showDropDown = false;
    this.currency = localStorage.getItem(appConstant.CURRENCY);
    this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.readMore = [];
      this.packageShoppingReq = data.searchPackageListReq || JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.packageShoppingReq && this.packageShoppingReq.destination) {
        // this.refreshData();
        // this.updateFormValue();
        this.startDate = this.convertDateStrToNgbDate(this.packageShoppingReq.date);
        this.endDate = this.convertDateStrToNgbDate(this.packageShoppingReq.endDate);
      } else {
        this.route.navigate(['/dashboard/packages']);
      }
      if (data.searchPackageListRes.length > 0) {
          this.readMore =  new Array(data.searchPackageListRes.length).fill(true);
          this.packagesListView = [...data.searchPackageListRes];
          this.currency = data.searchPackageListRes[0].currency;
          this.packageShoppingRes = data.searchPackageListRes;
          this.updateRatingStar(this.packagesListView);
          sessionStorage.setItem(appConstant.TRANSACTION_ID,data.searchPackageListRes[0].traceId);
        } else {
          this.packageShoppingRes = [];
          this.packagesListView = [];
        }
    });
    this.getPackageRegionList();
    if (!this.fetching && (this.packageShoppingRes.length === 0) && this.tryFetchTour) {
      this.tryFetchTour = false;
      this.fetchPackagesList();
    }
    this.searchDestination();
    // this.fetchTourList();
  }


  showText(index: number) {
    this.readMore[index] = !this.readMore[index];
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

  getPackageRegionList() {
    this.providerService.getPackageRegionList().subscribe((res: RegionPackage[]) => {
      this.regionList = res;
    }, e => {
      console.log(e);
    });
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case 'priceIncrease':
        this.increaseSort(this.packagesListView);
        break;
      case 'priceDecrease':
        this.decreaseSort(this.packagesListView);
        break;
      case 'popularity':
        // this.ratingStar.threeStar++;
        this.ratingSort(this.packagesListView);
       // this.alertify.warning(`Popularity currently not support`);
        break;
      case 'new':
        this.alertify.warning(`Newest currently not support`);
        break;
      case 'rating':
        this.ratingSort(this.packagesListView);
      //  this.alertify.warning(`Rating currently not support`);
        break;
    }
  }

  increaseSort(packageList: PackageShoppingRes[]) {
    this.packagesListView = packageList.sort((a, b) =>
      a.price > b.price ? 1 : -1
    );
  }

  decreaseSort(packageList: PackageShoppingRes[]) {
    this.packagesListView = packageList.sort((a, b) =>
      a.price < b.price ? 1 : -1
    );
  }

  ratingSort(packageList: PackageShoppingRes[]) {
     this.packagesListView = packageList.sort((a, b) =>
       a.starRate < b.starRate ? 1 : -1
     );
  }

  private initForm() {
    this.packageShoppingForm = new FormGroup({
      destination: new FormControl(),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
  }
  fetchPackagesList() {
    this.store.dispatch(new PackagesActions.SearchPackagesListStart({ data: this.packageShoppingReq }));
  }

  showMap() {
    this.mapOpen = !this.mapOpen;
  }

  gotoDetail(packages: PackageShoppingRes) {
    this.selectedPackage = this.packageShoppingRes.find(t => t.id === packages.id);
    sessionStorage.setItem(packagesConstant.SELECTED_PACKAGE, JSON.stringify(this.selectedPackage));
    const hotelDetail: HotelPackageDetailReq = new HotelPackageDetailReq();
    hotelDetail.hotelId = packages.hotelId;
    // this.store.dispatch(new PackagesActions.PackagesHotelDetailStart({ data: hotelDetail}));
    // this.route.navigate(['../hotelRoom'], { relativeTo: this.activatedRoute });
    window.open(`#/packages/hotelRoom`, '_blank');
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
    (this.packageShoppingForm.get('destination') as FormControl).patchValue(this.packageShoppingReq.destination);
    this.destinationName = this.packageShoppingReq.destination;
    this.cityCode = this.packageShoppingReq.cityCode;
    this.minDay = this.packageShoppingReq.minDay;
    this.maxDay = this.packageShoppingReq.maxDay;
  }
  shoppingPackage(event: PackageShoppingReq) {
    this.store.dispatch(new PackageActions.SearchPackagesListStart(
      { data: event }));
    // console.log(searchRequest);
    this.route.navigate(['/packages']);
  }

  updateRatingStar(packageShoppingList: PackageShoppingRes[]) {
    packageShoppingList.map((item) => {
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
      this.packagesListView = this.packageShoppingRes.filter(
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
      this.packagesListView = this.packageShoppingRes.filter(
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
  refreshData() {
    console.log('refresh search box');
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
