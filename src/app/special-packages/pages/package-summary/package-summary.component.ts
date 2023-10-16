import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Store} from '@ngrx/store';
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ModalOptions, BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from '../../store/special-packages.actions';
import {PackageShoppingReq} from 'src/app/model/packages/consumer/package-shopping-req';
import {HotelPackageDetailRes} from 'src/app/model/packages/consumer/hotel-package-detail-res';
import {specialPackagesConstant} from '../../special-packages.constant';
import {PackageShoppingRes} from 'src/app/model/packages/consumer/package-shopping-res';
import {SupplementPackageRes} from 'src/app/model/packages/consumer/supplement-package-res';
import {TourPackageRes} from 'src/app/model/packages/consumer/tour-package-res';
import {TransferPackageRes} from 'src/app/model/packages/consumer/transfer-pacakge-res';
import {SummaryPackageRes} from 'src/app/model/packages/consumer/summary-package-res';
import {SummaryPackageReq} from 'src/app/model/packages/consumer/summary-package-req';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemPrice} from 'src/app/model/packages/consumer/item-price';
import {RoomGuest} from '../../../model/dashboard/hotel/room-guest';
import {appDefaultData} from '../../../app.constant';

@Component({
  selector: 'app-package-summary',
  templateUrl: './package-summary.component.html',
  styleUrls: ['./package-summary.component.css']
})
export class PackageSummaryComponent implements OnInit {
  searchPackageList: PackageShoppingReq;
  selectedPackage: PackageShoppingRes;
  packageForm: FormGroup;
  supplementsForm: FormGroup;
  toursForm: FormGroup;
  transfersForm: FormGroup;
  currency: string;
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  tryFetchdata = true;

  packageSummaryRes: SummaryPackageRes;

  selectedRoom: HotelPackageDetailRes;
  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];

  summaryReq: SummaryPackageReq;
  refresh: boolean;
  itemCount: number;
  validRange: boolean;
  showFormSearchResponsive = false;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.initForm();
    this.refresh = false;
    this.itemCount = 1;
    this.validRange = true;
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.store.select('specialPackagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchPackageList = data.searchPackageListReq
        || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ));
      if (!this.searchPackageList || !this.searchPackageList.destination) {
        this.route.navigate(['/dashboard/specialPackages']);
      }
      this.selectedPackage = data.selectedPackages ||
        JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_PACKAGE));
      if (this.selectedPackage) {
        this.currency = this.selectedPackage.currency;
      }
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_ROOM));
      this.packageSummaryRes = data.packageSummaryRes;
      this.summaryReq = Object.assign({}, data.packageSummaryReq);
    });
    this.refreshData();
    if (!this.fetching) {
      if (this.tryFetchdata) {
        this.selectedSupplements = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_SUPPLEMENT)) || [];
        this.selectedTours = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TOUR)) || [];
        this.selectedTransfers = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TRANSFER)) || [];
        this.tryFetchdata = false;
        const summaryReq = new SummaryPackageReq();
        const packgeInfo = new ItemPrice();
        packgeInfo.id = this.selectedPackage.id;
        packgeInfo.count = 1;
        summaryReq.packageInfo = packgeInfo;
        summaryReq.hotelId = this.selectedPackage.hotelId;
        const hotelRoom = new ItemPrice();
        hotelRoom.id = this.selectedRoom.id;
        hotelRoom.count = 1;
        summaryReq.hotelRooms = [hotelRoom];
        summaryReq.startDate = this.selectedPackage.startDate;
        if (this.selectedSupplements && this.selectedSupplements.length > 0) {
          this.initSupplementForm();
          const supplements = [];
          this.selectedSupplements.forEach((sup, index) => {
            const supplement = new ItemPrice();
            supplement.id = sup.id;
            supplement.count = 1;
            supplements.push(supplement);
            if (index > 0) {
              this.addSupplement();
            }
          });
          summaryReq.supplements = supplements;
        }
        if (this.selectedTours && this.selectedTours.length > 0) {
          this.initTourForm();
          const tours = [];
          this.selectedTours.forEach((t, index) => {
            const tour = new ItemPrice();
            tour.id = t.id;
            tour.count = 1;
            tours.push(tour);
            if (index > 0) {
              this.addTour();
            }
          });
          summaryReq.tours = tours;
        }
        if (this.selectedTransfers && this.selectedTransfers.length > 0) {
          this.initTransferForm();
          const transfers = [];
          this.selectedTransfers.forEach((t, index) => {
            const transfer = new ItemPrice();
            transfer.id = t.id;
            transfer.count = 1;
            transfers.push(transfer);
            if (index > 0) {
              this.addTransfer();
            }
          });
          summaryReq.transfers = transfers;
        }
        // this.summaryReq = summaryReq;
        this.updateFormWithValue();
        this.fetchSummary(summaryReq);
      }
    }
  }

  fetchSummary(summaryReq?: SummaryPackageReq) {
    sessionStorage.setItem(specialPackagesConstant.SUMMARY_REQ, JSON.stringify(summaryReq));
    this.store.dispatch(
      new PackagesActions.PackagesSummaryStart({
        data: summaryReq
      })
    );
  }

  initForm() {
    this.packageForm = this.fb.group({
      itemCount: [1, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  initSupplementForm(): FormGroup {
    return this.supplementsForm = this.fb.group({
      supplement: this.fb.array([this.buildItemPrice()]),
    });
  }

  initTourForm(): FormGroup {
    return this.toursForm = this.fb.group({
      tour: this.fb.array([this.buildItemPrice()]),
    });
  }

  initTransferForm(): FormGroup {
    return this.transfersForm = this.fb.group({
      transfer: this.fb.array([this.buildItemPrice()]),
    });
  }

  buildItemPrice(): FormGroup {
    return this.fb.group({
      itemCount: [1, [Validators.required, Validators.min(1), Validators.max(50)]]
    });
  }

  addSupplement(): void {
    this.supplement.push(this.buildItemPrice());
  }

  addTour(): void {
    this.tour.push(this.buildItemPrice());
  }

  addTransfer(): void {
    this.transfer.push(this.buildItemPrice());
  }

  get supplement(): FormArray {
    return this.supplementsForm.get('supplement') as FormArray;
  }

  get tour(): FormArray {
    return this.toursForm.get('tour') as FormArray;
  }

  get transfer(): FormArray {
    return this.transfersForm.get('transfer') as FormArray;
  }

  updateFormWithValue() {
    this.packageForm.patchValue({
      // itemCount: this.summaryReq.itemCount || 1
    });
  }

  updateItemCount(event: any) {
    // this.itemCount = +event.target.value;
    // this.validRange = this.itemCount >= 1 && this.itemCount <=50;
    this.refresh = this.validRange;
  }

  updateSummaryPrice() {
    if (this.validRange) {
      const summaryReq: SummaryPackageReq = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SUMMARY_REQ));
      summaryReq.packageInfo.count = +this.packageForm.value.itemCount;
      if (this.supplementsForm) {
        const s: Array<any> = this.supplementsForm.value.supplement;
        if (s.length > 0) {
          s.forEach((sup, index) => {
            summaryReq.supplements[index].count = +sup.itemCount;
          });
        }
      }
      if (this.toursForm) {
        const t: Array<any> = this.toursForm.value.tour;
        if (t.length > 0) {
          t.forEach((tour, index) => {
            summaryReq.tours[index].count = +tour.itemCount;
          });
        }
      }
      if (this.transfersForm) {
        const tr: Array<any> = this.transfersForm.value.transfer;
        if (tr.length > 0) {
          tr.forEach((tr, index) => {
            summaryReq.transfers[index].count = +tr.itemCount;
          });
        }
      }
      this.fetchSummary(summaryReq);
      this.refresh = false;
    }
  }

  openModalWithComponent() {
    const initialState = {
      searchFlightForm: this.searchPackageList,
      // typeFlight: this.typeFlight
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    // this.bsModalRef = this.modalService.show(
    //   FlightSearchDialogComponent,
    //   this.bsConfig
    // );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res) => {
      this.searchPackageList = res;
    });
  }

  shoppingPackage(event: PackageShoppingReq) {
    console.log('search from summary page');
    this.fetchSummary();
    // this.store.dispatch(new PackageActions.SearchPackagesListStart(
    //   { data: event }));
    // this.route.navigate(['/packages']);
    this.route.navigate(['../list'], {relativeTo: this.activatedRoute});
  }

  continueBooking() {
    if (this.validRange) {
      sessionStorage.setItem(specialPackagesConstant.SUMMARY_RESULT, JSON.stringify(this.packageSummaryRes));
      this.route.navigate(['../cart'], {
        relativeTo: this.activatedRoute,
      });
    }
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
