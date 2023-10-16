import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from '../../store/packages.actions';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { packagesConstant } from '../../packages.constant';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { SupplementPackageRes } from 'src/app/model/packages/consumer/supplement-package-res';
import { TourPackageRes } from 'src/app/model/packages/consumer/tour-package-res';
import { TransferPackageRes } from 'src/app/model/packages/consumer/transfer-pacakge-res';
import { SummaryPackageRes } from 'src/app/model/packages/consumer/summary-package-res';
import { SummaryPackageReq } from 'src/app/model/packages/consumer/summary-package-req';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ItemPrice } from 'src/app/model/packages/consumer/item-price';
import {Observable, Observer, of, Subscription} from 'rxjs';
import { DestinationRes } from '../../../model/dashboard/desRes.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defaultData } from 'src/app/app.constant';
import { DashboardService } from '../../../service/dashboard/dashboard.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomGuest} from '../../../model/dashboard/hotel/room-guest';
import { SearchInsurancePackageReq } from 'src/app/model/insurance/search-insurance-package.req';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { SearchQouteRequest } from 'src/app/model/insurance/search-quote.request';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';

@Component({
  selector: 'app-package-summary',
  templateUrl: './package-summary.component.html',
  styleUrls: ['./package-summary.component.css']
})
export class PackageSummaryComponent implements OnInit, OnDestroy {
  storeSub: Subscription;
  searchPackageList: PackageShoppingReq;
  selectedPackage: PackageShoppingRes;

  bsModalRef: BsModalRef;
  tryFetchData = true;

  packageSummaryRes: SummaryPackageRes;

  selectedRoom: HotelPackageDetailRes;
  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];

  summaryReq: SummaryPackageReq;
  refresh: boolean;
  itemCount: number;
  validRange: boolean;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

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
  searchForm: FormGroup;
  mapOpen = false;
  filterOpen = false;
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
  totalTripPrice: number;
  currency: string;
  defaultHotelImage: string;
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultHotelImage = defaultData.noImage;
    this.refresh = false;
    this.itemCount = 1;
    this.validRange = true;
    this.defaultData = defaultData.noImage;
    this.formSubmitError = false;

    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};
    this.showDropDown = false;
    this.currency = packagesConstant.METADATA_CURRENCY;
    this.storeSub = this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchPackageList = data.searchPackageListReq ||
        JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.searchPackageList && this.searchPackageList.destination) {
        this.refreshData();
        this.startDate = this.convertDateStrToNgbDate(this.searchPackageList.date);
        this.endDate = this.convertDateStrToNgbDate(this.searchPackageList.endDate);
      } else {
        this.route.navigate(['/dashboard/packages']);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
      if (this.selectedPackage && this.selectedPackage.price) {
        this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_ROOM));
        this.packageSummaryRes = data.packageSummaryRes;
        this.totalTripPrice = +this.selectedPackage.price;
        this.summaryReq = Object.assign({}, data.packageSummaryReq);
        this.currency = this.selectedPackage.currency;
        this.getAddonOption(this.searchPackageList);
      } else {
        this.route.navigate(['/dashboard/packages']);
      }
    });

    if (!this.fetching) {
      if (this.tryFetchData) {
         this.tryFetchData = false;
          const summaryReq = new SummaryPackageReq();
          const packageInfo = new ItemPrice();
          packageInfo.id = this.selectedPackage.id;
          packageInfo.count = 1;
          summaryReq.packageInfo = packageInfo;
          summaryReq.hotelId = this.selectedPackage.hotelId;
          const hotelRoom = new ItemPrice();
          hotelRoom.id = this.selectedRoom.id;
          hotelRoom.count = 1;
          summaryReq.hotelRooms = [hotelRoom];
          summaryReq.startDate = this.selectedPackage.startDate;
         this.fetchSummary(summaryReq);
      }
    }
  }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
  getAddonOption(searchFlightForm: PackageShoppingReq) {
    this.getInsuranceList(searchFlightForm, this.totalTripPrice);
  }

  getInsuranceList(searchFlightForm: PackageShoppingReq, totalTripPrice: number) {
    const axaRequest = new SearchInsurancePackageReq();
    axaRequest.countryOfTravel = searchFlightForm.destination;
    axaRequest.startDate = searchFlightForm.date;
    const startDate = new Date(searchFlightForm.date);
    axaRequest.endDate = searchFlightForm.endDate || this.datePipe.transform(startDate.setDate(startDate.getDate() + 1), 'yyyy-MM-dd');
    const travellersInsure = new Travellers();
    travellersInsure.adt = searchFlightForm.rooms[0].adult;
    travellersInsure.chd = searchFlightForm.rooms[0].children;
    travellersInsure.inf = 0;
    axaRequest.travellers = travellersInsure;
    const searchQuoteForm: SearchQouteRequest = new SearchQouteRequest(axaRequest);
    searchQuoteForm.price = +totalTripPrice.toFixed(2);
    searchQuoteForm.currency = this.currency;
    sessionStorage.setItem(insuranceConstant.QUOTE_SEARCH_FORM, JSON.stringify(searchQuoteForm));
    this.store.dispatch(new InsuranceActions.QouteListStart({data: searchQuoteForm}));
  }

  fetchSummary(summaryReq?: SummaryPackageReq) {
    sessionStorage.setItem(packagesConstant.SUMMARY_REQ, JSON.stringify(summaryReq));
    this.store.dispatch(
      new PackagesActions.PackagesSummaryStart({
        data: summaryReq
      })
    );
  }
  continueBooking() {
    if (this.validRange) {
      sessionStorage.setItem(packagesConstant.SUMMARY_RESULT, JSON.stringify(this.packageSummaryRes));
      this.route.navigate(['../cart'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  shoppingPackage(event: PackageShoppingReq) {
    console.log('search from summary page');
    this.fetchSummary();
    // this.store.dispatch(new PackageActions.SearchPackagesListStart(
    //   { data: event }));
    // this.route.navigate(['/packages']);
    this.route.navigate(['../list'], {relativeTo: this.activatedRoute});
  }

  showMap() {
    this.mapOpen = !this.mapOpen;
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
    if (this.searchPackageList) {
      this.travellerCount = 0;
      this.roomCount = 0;
      (this.searchPackageList.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
      this.updateRoomGuests(this.searchPackageList.rooms);
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
