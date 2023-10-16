import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PackageShoppingReq } from '../../../model/packages/consumer/package-shopping-req';
import { CurrencyNewRes } from '../../../model/dashboard/currency/currency-new-res.model';
import { PackageShoppingRes } from '../../../model/packages/consumer/package-shopping-res';
import { PaginationInstance } from 'ngx-pagination';
import { RegionPackage } from '../../../model/packages/provider/region';
import { DatePipe } from '@angular/common';
import { PakageProviderService } from '../../../service/packages/packages-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { AlertifyService } from '../../../service/alertify.service';
import { appConstant, defaultData } from '../../../app.constant';
import { packagesConstant, packagesFilter} from '../../packages.constant';
import * as PackagesActions from '../../store/packages.actions';
import { HotelPackageDetailReq } from '../../../model/packages/consumer/hotel-package-detail-req';
import { Observable, Observer, of} from 'rxjs';
import { DestinationRes } from '../../../model/dashboard/desRes.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { RatingStarCount } from '../../../model/hotel/hotel-list/rating-star-count';
import { RatingStarFilter } from '../../../model/hotel/hotel-list/rating-star-filter';
import { NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { RoomGuest } from '../../../model/dashboard/hotel/room-guest';
import { DashboardService } from '../../../service/dashboard/dashboard.service';
import * as PackageActions from '../../store/packages.actions';
import { map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-package-shopping-image',
  templateUrl: './package-shopping-image.component.html',
  styleUrls: ['./package-shopping-image.component.css']
})
export class PackageShoppingImageComponent implements OnInit {
  bsModalRef: BsModalRef;

  packageShoppingReq: PackageShoppingReq;
  packageShoppingForm: FormGroup;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  currencyModel: CurrencyNewRes[];
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
  showFormSearchResponsive: boolean = false;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  showDropDown: boolean;
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  constructor(public datePipe: DatePipe,
              private providerService: PakageProviderService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private store: Store<fromApp.AppState>,
              private alertify: AlertifyService,
              protected dashboardService: DashboardService,
              private renderer: Renderer2,
              private el: ElementRef) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    this.defaultData = defaultData.noImage;
    this.regionList = []
    this.currencyModel = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.currency = this.currencyModel.find(e => e.code === 'USD').code;
    this.formSubmitError = false;
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};
    this.showDropDown = false;

    this.packageShoppingReq = JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ)) || null;
    if (this.packageShoppingReq) {
      this.updateFormValue();
      this.startDate = this.convertDateStrToNgbDate(this.packageShoppingReq.date)
      const valueDate =  this.addDays(this.convertNgbDateToDate(this.startDate), 1);
      this.endDate = { day: valueDate.getDate(), month: valueDate.getMonth() + 1, year: valueDate.getFullYear()};
    }

    this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if (data.packageListForImageRes) {
        if(data.packageListForImageRes.length > 0){
          this.packageShoppingRes = data.packageListForImageRes;
          this.packagesListView = [...data.packageListForImageRes];
          this.updateRatingStar(this.packagesListView);
        } else {
          this.packageShoppingRes = [];
          this.packagesListView = [];
        }
      }
    });
    this.getPackageRegionList();
    if(!this.fetching && (this.packageShoppingRes.length === 0) && this.tryFetchTour){
      this.tryFetchTour = false;
      this.fetchPackagesList();
    }
    this.searchDestination();
    this.refreshData();
  }

  showFormFilter() {
    if(this.filterOpen) {
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
      case "priceIncrease":
        this.increaseSort(this.packagesListView);
        break;
      case "priceDecrease":
        this.decreaseSort(this.packagesListView);
        break;
      case "popularity":
        // this.ratingStar.threeStar++;
        this.alertify.warning(`Popularity currently not support`);
        break;
      case "new":
        this.alertify.warning(`Newest currently not support`);
        break;
      case "rating":
        this.alertify.warning(`Rating currently not support`);
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
    // this.packagesListView = packageList.sort((a, b) =>
    //   a.rate < b.starRating ? 1 : -1
    // );
  }

  private initForm() {
    this.packageShoppingForm = new FormGroup({
      destination: new FormControl(),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
  }
  fetchPackagesList() {
    this.store.dispatch(new PackageActions.PackageListForImageStart({filter: packagesFilter.COUNTRY_OR_CITY, dataFilter: this.packageShoppingReq.destination}));
  }

  showMap() {
    this.mapOpen = !this.mapOpen;
  }

  gotoDetail(packages: PackageShoppingRes) {
    this.selectedPackage = this.packageShoppingRes.find(t => t.id === packages.id);
    sessionStorage.setItem(packagesConstant.SELECTED_PACKAGE, JSON.stringify(this.selectedPackage));
    const hotelDetail: HotelPackageDetailReq = new HotelPackageDetailReq();
    hotelDetail.hotelId = packages.hotelId;
    this.store.dispatch(new PackagesActions.PackagesHotelDetailStart({ data: hotelDetail}));
    this.route.navigate(['../hotelRoom'], { relativeTo: this.activatedRoute });
  }

  getDayCount() {
    let date1 = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    let date2 = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    let days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);

    if (days < 1) {
      this.minDay = 0;
      this.maxDay = 1;
    } else if (days >= 1 && days <= 7) {
      this.minDay = 1;
      this.maxDay = 7;
    } else if (days <= 14 && days >=8) {
      this.minDay = 8;
      this.maxDay = 14;
    } else if (days <= 21 && days >= 15) {
      this.minDay = 8;
      this.maxDay = 21;
    } else if (days >= 22) {
      this.minDay = 22;
      this.maxDay = 100
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
    // (this.packageShoppingForm.get('startDate') as FormControl).patchValue(new Date(this.packageShoppingReq.date));
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
    if (this.packageShoppingForm.valid) {
      const d: any = this.packageShoppingForm.value;
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
    } else {
      this.formSubmitError = true;
      return;
    }
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

  getStartDate(data: NgbDate) {
    this.startDate = data;
  }

  convertDateStrToNgbDate(data: string): NgbDateStruct {
    let dataDate: Array<string> = data.split('-');
    return {day: +dataDate[2], month: +dataDate[1], year: +dataDate[0]};
  }

  showFormSearch() {
    let myTag = this.el.nativeElement.querySelector("form");
    this.showFormSearchResponsive = true;
    if (this.showFormSearchResponsive) {
      myTag.classList.remove("hotel-search");
    }
  }

  closeFormSearch() {
    let myTag = this.el.nativeElement.querySelector("form");
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add("hotel-search");
    }
  }

  getEndDate(data: NgbDate) {
    this.endDate = data;
  }

  toggleDrop(){
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
    if(!menuDropClick && !dropDown){
      this.showDropDown = false;
    }
  }

  refreshData() {
    this.travellerCount = 1;
    this.roomCount = 1;
    this.roomGuests = [];
    let roomGuestInitial: RoomGuest = new RoomGuest();
    roomGuestInitial.adult = 1;
    roomGuestInitial.children = 0;
    this.roomGuests.push(roomGuestInitial);
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
