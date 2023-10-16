import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as fromApp from '../../../store/app.reducer';
import * as PackagesActions from '../../store/special-packages.actions';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { specialPackagesConstant } from '../../special-packages.constant';

import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { SupplementPackageRes } from 'src/app/model/packages/consumer/supplement-package-res';
import { TourPackageRes } from 'src/app/model/packages/consumer/tour-package-res';
import { TransferPackageRes } from 'src/app/model/packages/consumer/transfer-pacakge-res';
import { PackageOptionalReq } from 'src/app/model/packages/consumer/package-optional-req';
import { PackageOptionalRes } from 'src/app/model/packages/consumer/package-optional-res';
import {RoomGuest} from '../../../model/dashboard/hotel/room-guest';
import * as PackageActions from '../../../packages/store/packages.actions';
import {appDefaultData} from '../../../app.constant';

@Component({
  selector: 'app-package-optional',
  templateUrl: './package-optional.component.html',
  styleUrls: ['./package-optional.component.css']
})
export class PackageOptionalComponent implements OnInit {
  searchPackageList: PackageShoppingReq;
  selectedPackage: PackageShoppingRes;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  tryFetchdata = true;

  supplementList: SupplementPackageRes[];
  tourList: TourPackageRes[];
  transferList: TransferPackageRes[];
  showFormSearchResponsive = false;
  selectedRoom: HotelPackageDetailRes;
  packageOptionalRes: PackageOptionalRes;

  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  adultCount: number;
  childCount: number;
  travellerCount: number;
  roomCount: number;
  currency: string;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.store.select('specialPackagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchPackageList = data.searchPackageListReq
        || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ));
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_PACKAGE));
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_ROOM));
      this.selectedSupplements = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_SUPPLEMENT)) || [];
      this.selectedTours = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TOUR)) || [];
      this.selectedTransfers = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TRANSFER)) || [];
      this.packageOptionalRes = data.packageOptionalRes || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_OPTIONAL));
      if (this.selectedPackage) {
        this.currency = this.selectedPackage.currency;
      }
      if (this.packageOptionalRes) {
        this.supplementList = this.packageOptionalRes.supplements;
        this.tourList = this.packageOptionalRes.tours;
        this.transferList = this.packageOptionalRes.transfers;
      }
    });
    if (!this.fetching) {
      if (this.tryFetchdata) {
         this.fetchOptional();
      }
      this.tryFetchdata = false;
    }
    this.refreshData();
  }
  fetchOptional() {
    const packageOptionalReq = new PackageOptionalReq();
    packageOptionalReq.packageId =  this.selectedPackage.id;
    this.store.dispatch(
      new PackagesActions.PackagesOptionalStart({
        data: packageOptionalReq
      })
    );
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

  addSupplement(index: number) {
    const selectedSupplement = this.supplementList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(selectedSupplement));
    if (this.selectedSupplements.indexOf(selectedSupplement) === -1) {
      this.selectedSupplements.push(selectedSupplement);
      sessionStorage.setItem(specialPackagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(this.selectedSupplements));
    }
  }

  addTour(index: number) {
    const selectedTour = this.tourList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_TOUR,JSON.stringify(selectedTour));
    if (this.selectedTours.indexOf(selectedTour) === -1) {
      this.selectedTours.push(selectedTour);
      sessionStorage.setItem(specialPackagesConstant.SELECTED_TOUR, JSON.stringify(this.selectedTours));
    }
  }

  addTransfer(index: number) {
    const selectedTransfer = this.transferList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_TRANSFER,JSON.stringify(selectedTransfer));
    // this.selectedTransfers = selectedTransfer;
    if (this.selectedTransfers.indexOf(selectedTransfer) === -1) {
      this.selectedTransfers.push(selectedTransfer);
      sessionStorage.setItem(specialPackagesConstant.SELECTED_TRANSFER, JSON.stringify(this.selectedTransfers));
    }
  }

  removeSupplement(index: number) {
    this.selectedSupplements.splice(index, 1);
    sessionStorage.setItem(specialPackagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(this.selectedSupplements));
  }

  removeTour(index: number) {
    this.selectedTours.splice(index, 1);
    sessionStorage.setItem(specialPackagesConstant.SELECTED_TOUR, JSON.stringify(this.selectedTours));
  }

  removeTransfer(index: number) {
    this.selectedTransfers.splice(index, 1);
    sessionStorage.setItem(specialPackagesConstant.SELECTED_TRANSFER, JSON.stringify(this.selectedTransfers));
  }

  continueBooking() {
    // sessionStorage.removeItem(packagesConstant.SELECTED_SUPPLEMENT);
    // this.store.dispatch(
    //   new PackagesActions.PackagesTourStart({ data: null })
    // );
    this.route.navigate(['../summary'], {
      relativeTo: this.activatedRoute,
    });
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
  shoppingPackage(event: PackageShoppingReq) {
    this.store.dispatch(new PackageActions.SearchPackagesListStart(
      { data: event }));
    // console.log(searchRequest);
    this.route.navigate(['/specialPackages']);
  }
}
