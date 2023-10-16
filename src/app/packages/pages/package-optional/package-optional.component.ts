import {Component, OnInit, Renderer2} from '@angular/core';
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
import { PackageOptionalReq } from 'src/app/model/packages/consumer/package-optional-req';
import { PackageOptionalRes } from 'src/app/model/packages/consumer/package-optional-res';
import { Observable, Observer, of } from 'rxjs';
import { DestinationRes } from '../../../model/dashboard/desRes.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defaultData } from 'src/app/app.constant';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { map, switchMap, tap } from 'rxjs/operators';
import * as PackageActions from '../../store/packages.actions';
import { DashboardService } from '../../../service/dashboard/dashboard.service';
import { RegionPackage } from '../../../model/packages/provider/region';
import { PakageProviderService } from '../../../service/packages/packages-provider.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-package-optional',
  templateUrl: './package-optional.component.html',
  styleUrls: ['./package-optional.component.css']
})
export class PackageOptionalComponent implements OnInit {
  searchPackageList: PackageShoppingReq;
  selectedPackage: PackageShoppingRes;

  bsModalRef: BsModalRef;
  tryFetchdata = true;

  supplementList: SupplementPackageRes[];
  tourList: TourPackageRes[];
  transferList: TransferPackageRes[];

  selectedRoom: HotelPackageDetailRes;
  packageOptionalRes: PackageOptionalRes;

  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];

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
  searchForm: FormGroup;
  regionList: RegionPackage[];
  mapOpen = false;
  filterOpen = false;
  minDateStart: NgbDateStruct;
  startDate: NgbDateStruct;
  today: Date;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    private renderer: Renderer2,
    private providerService: PakageProviderService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    // this.bsConfig = new ModalOptions();
    this.defaultData = defaultData.noImage;
    this.formSubmitError = false;
    this.regionList = [];

    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};

    this.store.select('packagesList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchPackageList = data.searchPackageListReq || JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_SHOPPING_REQ));
      if (this.searchPackageList) {
        this.updateFormValue();
        this.startDate = this.convertDateStrToNgbDate(this.searchPackageList.date);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_ROOM));
      this.selectedSupplements = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_SUPPLEMENT)) || [];
      this.selectedTours = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TOUR)) || [];
      this.selectedTransfers = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TRANSFER)) || [];
      this.packageOptionalRes = data.packageOptionalRes || JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_OPTIONAL));
      if (this.packageOptionalRes) {
        this.supplementList = this.packageOptionalRes.supplements;
        this.tourList = this.packageOptionalRes.tours;
        this.transferList = this.packageOptionalRes.transfers;
      }
    });
    this.getPackageRegionList();
    if (!this.fetching) {
      if (this.tryFetchdata) {
         this.fetchOptional();
      }
      this.tryFetchdata = false;
    }
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

  getPackageRegionList() {
    this.providerService.getPackageRegionList().subscribe((res: RegionPackage[]) => {
      this.regionList = res;
    }, e => {
      console.log(e);
    });
  }

  addSupplement(index: number) {
    const selectedSupplement = this.supplementList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(selectedSupplement));
    if (this.selectedSupplements.indexOf(selectedSupplement) === -1) {
      this.selectedSupplements.push(selectedSupplement);
      sessionStorage.setItem(packagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(this.selectedSupplements));
    }
  }

  addTour(index: number) {
    const selectedTour = this.tourList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_TOUR,JSON.stringify(selectedTour));
    if (this.selectedTours.indexOf(selectedTour) === -1) {
      this.selectedTours.push(selectedTour);
      sessionStorage.setItem(packagesConstant.SELECTED_TOUR, JSON.stringify(this.selectedTours));
    }
  }

  addTransfer(index: number) {
    const selectedTransfer = this.transferList[index];
    // sessionStorage.setItem(packagesConstant.SELECTED_TRANSFER,JSON.stringify(selectedTransfer));
    // this.selectedTransfers = selectedTransfer;
    if (this.selectedTransfers.indexOf(selectedTransfer) === -1) {
      this.selectedTransfers.push(selectedTransfer);
      sessionStorage.setItem(packagesConstant.SELECTED_TRANSFER, JSON.stringify(this.selectedTransfers));
    }
  }

  removeSupplement(index: number) {
    this.selectedSupplements.splice(index, 1);
    sessionStorage.setItem(packagesConstant.SELECTED_SUPPLEMENT, JSON.stringify(this.selectedSupplements));
  }

  removeTour(index: number) {
    this.selectedTours.splice(index, 1);
    sessionStorage.setItem(packagesConstant.SELECTED_TOUR, JSON.stringify(this.selectedTours));
  }

  removeTransfer(index: number) {
    this.selectedTransfers.splice(index, 1);
    sessionStorage.setItem(packagesConstant.SELECTED_TRANSFER, JSON.stringify(this.selectedTransfers));
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

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      startDate: new FormControl('', Validators.required)
    });
  }

  selectDayCount(dayNumber: number) {
    if (dayNumber === 1) {
      this.minDay = 0;
      this.maxDay = dayNumber;
    } else if (dayNumber === 7) {
      this.minDay = 1;
      this.maxDay = dayNumber;
    } else if (dayNumber === 14) {
      this.minDay = 8;
      this.maxDay = dayNumber;
    } else if (dayNumber === 21) {
      this.minDay = 15;
      this.maxDay = dayNumber;
    } else if (dayNumber === 100) {
      this.minDay = 22;
      this.maxDay = dayNumber;
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
    (this.searchForm.get('destination') as FormControl).patchValue(this.searchPackageList.destination);
    // (this.searchForm.get('startDate') as FormControl).patchValue(new Date(this.searchPackageList.date));
    this.destinationName = this.searchPackageList.destination;
    this.cityCode = this.searchPackageList.cityCode;
    this.minDay = this.searchPackageList.minDay;
    this.maxDay = this.searchPackageList.maxDay;
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  shoppingPackage() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchRequest: PackageShoppingReq = new PackageShoppingReq();
      searchRequest.destination = this.destinationName;
      searchRequest.cityCode = this.cityCode;
      searchRequest.date = this.datePipe.transform(this.convertNgbDateToDate(this.startDate), 'yyyy-MM-dd');
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

  getStartDate(data: NgbDate) {
    this.startDate = data;
  }

  convertDateStrToNgbDate(data: string): NgbDateStruct {
    const dataDate: Array<string> = data.split('-');
    return {day: +dataDate[2], month: +dataDate[1], year: +dataDate[0]};
  }
}
