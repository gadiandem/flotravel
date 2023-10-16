import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from '../../store/special-packages.actions';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { specialPackagesConstant } from '../../special-packages.constant';
import { HotelPackageDetailReq } from 'src/app/model/packages/consumer/hotel-package-detail-req';
import { RegionPackage } from 'src/app/model/packages/provider/region';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { SpecialPackageSearchDialogComponent } from '../../dialogs/package-search-dialog/package-search-dialog.component';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {RatingStarCount} from '../../../model/hotel/hotel-list/rating-star-count';
import {RatingStarFilter} from '../../../model/hotel/hotel-list/rating-star-filter';

@Component({
  selector: 'app-package-shopping',
  templateUrl: './package-shopping.component.html',
  styleUrls: ['./package-shopping.component.css']
})
export class PackageShoppingComponent implements OnInit {
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  readMore : boolean[];
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
  adultCount = 1;
  childCount = 0;
  tryFetchTour = true;

  regionList: RegionPackage[];
  showFormSearchResponsive = false;
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];
  travellerCount: number;
  roomCount: number;
  destinationName: string;
  cityCode: string;
  minDay = 0;
  maxDay = 100;
  filterOpen = false;
  ratingStarCount: RatingStarCount;
  ratingStarFiler: RatingStarFilter;
  constructor(public datepipe: DatePipe,
    private providerService: PakageProviderService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService,
    private renderer: Renderer2,
              private el: ElementRef) {
  }
  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.regionList = [];
    this.currency = localStorage.getItem(appConstant.CURRENCY);
    this.ratingStarCount = new RatingStarCount();
    this.ratingStarFiler = new RatingStarFilter();
    this.initForm();
    this.store.select('specialPackagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.readMore = [];
      this.packageShoppingReq = data.searchPackageListReq
        || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.packageShoppingReq && this.packageShoppingReq.destination) {
        this.refreshData();
        this.updateFormValue();
      } else {
        this.route.navigate(['/dashboard/specialPackages']);
      }
      if (data.searchPackageListRes) {
        if (data.searchPackageListRes.length > 0) {
          this.readMore =  new Array(data.searchPackageListRes.length).fill(true);
          this.currency = data.searchPackageListRes[0].currency;
          this.packageShoppingRes = data.searchPackageListRes;
          this.packagesListView = [...data.searchPackageListRes];
          sessionStorage.setItem(appConstant.TRANSACTION_ID,data.searchPackageListRes[0].traceId);
        } else {
          this.packageShoppingRes = [];
          this.packagesListView = [];
        }
      }
    });
    this.getPackageRegionList();
    if (!this.fetching && (this.packageShoppingRes.length === 0) && this.tryFetchTour) {
      this.tryFetchTour = false;
      this.fetchPackagesList();
    }
    // this.fetchTourList();
  }
  getPackageRegionList() {
    this.providerService.getPackageRegionList().subscribe((res: RegionPackage[]) => {
      this.regionList = res;
    }, e => {
      console.log(e);
    });
  }

  showText(index: number) {
    this.readMore[index] = !this.readMore[index];
  }

  updateFormValue() {
    (this.packageShoppingForm.get('destination') as FormControl).patchValue(this.packageShoppingReq.destination);
    this.destinationName = this.packageShoppingReq.destination;
    this.cityCode = this.packageShoppingReq.cityCode;
    this.minDay = this.packageShoppingReq.minDay;
    this.maxDay = this.packageShoppingReq.maxDay;
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
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl()
    });
  }
  fetchPackagesList() {
    this.store.dispatch(new PackagesActions.SearchPackagesListStart({ data: this.packageShoppingReq }));
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
  showMap() {
    this.mapOpen = !this.mapOpen;
  }
  openModalWithComponent() {
    console.log(JSON.stringify(this.packageShoppingReq));
    const initialState = {
      searchRequest: Object.assign({}, this.packageShoppingReq),
      title: 'Search Package List'
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(SpecialPackageSearchDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      // this.searchTourForm = res;
      this.packageShoppingReq = Object.assign({}, res);
      this.fetchPackagesList();
    });
  }

  gotoDetail(packages: PackageShoppingRes) {
    this.selectedPackage = this.packageShoppingRes.find(t => t.id === packages.id);
    sessionStorage.setItem(specialPackagesConstant.SELECTED_PACKAGE, JSON.stringify(this.selectedPackage));
    const hotelDetail: HotelPackageDetailReq = new HotelPackageDetailReq();
    hotelDetail.hotelId = packages.hotelId;
    // this.store.dispatch(new PackagesActions.PackagesHotelDetailStart({ data: hotelDetail}));
    // this.route.navigate(['../hotelRoom'], { relativeTo: this.activatedRoute });
    window.open(`#/specialPackages/hotelRoom`, '_blank');
  }

  shoppingPackage(event: PackageShoppingReq) {
    this.store.dispatch(new PackagesActions.SearchPackagesListStart(
      { data: event }));
    // console.log(searchRequest);
    this.route.navigate(['#/specialPackages/hotelRoom', '_blank']);
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
  }
}
