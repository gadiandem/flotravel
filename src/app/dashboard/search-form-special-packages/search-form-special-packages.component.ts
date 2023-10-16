import {Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef} from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, tap, switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import * as SpecialPackageActions from '../../special-packages/store/special-packages.actions';
import * as fromApp from '../../store/app.reducer';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import {RoomGuest} from '../../model/dashboard/hotel/room-guest';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { packagesConstant } from 'src/app/packages/packages.constant';
import { specialPackagesConstant } from '../../special-packages/special-packages.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: 'app-search-form-special-packages',
  templateUrl: './search-form-special-packages.component.html',
  styleUrls: ['./search-form-special-packages.component.css']
})
export class SearchFormSpecialPackagesComponent implements OnInit {
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;
  searchForm: FormGroup;
  destinationName: string;
  cityCode: string;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  minDateStart: Date;
  searching = false;
  searchFailed = false;
  model: any;
  formSubmitError: boolean;

  bsConfig: Partial<BsDatepickerConfig>;
  minDate = new Date();

  minDay = 0;
  maxDay = 100;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  showDropDown: boolean;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  user: UserDetail;
  
  constructor(protected router: Router,
    public datePipe: DatePipe,
    protected dashboardService: DashboardService,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {
    sessionStorage.clear();
    this.minDateStart = new Date();
    this.formSubmitError = false;
    this.initForm();
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    if (this.user) {
      sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.user));
    }
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: this.minDate,
        showWeekNumbers: false,
      }
    );
    this.refreshData();
    this.searchDestination();
  }
  initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      startDate: new FormControl(this.minDate, Validators.required),
     // endDate: new FormControl('', Validators.required),
      rooms: new FormArray([]),
    });

  }
  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      debounceTime(300),
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
  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  getStartDate(data: NgbDate) {
    this.startDate = data;
  }

  getEndDate(data: NgbDate) {
    this.endDate = data;
  }

  selectDayCount(minDay: number, maxDay: number) {
    this.minDay = minDay;
    this.maxDay = maxDay;
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
  searchPackages() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchRequest: PackageShoppingReq = new PackageShoppingReq();
      searchRequest.destination = this.destinationName;
      searchRequest.cityCode = this.cityCode;
      searchRequest.date = this.datePipe.transform(d.startDate, 'yyyy-MM-dd');
     // searchRequest.endDate = this.datePipe.transform(this.convertNgbDateToDate(this.endDate), 'yyyy-MM-dd');
      searchRequest.minDay = this.minDay;
      searchRequest.maxDay = this.maxDay;
      searchRequest.rooms = this.roomGuests;
      this.store.dispatch(new SpecialPackageActions.SearchPackagesListStart(
        { data: searchRequest }));
      sessionStorage.setItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ, JSON.stringify(searchRequest));
      this.router.navigate(['/specialPackages']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  onOpenDatepicker(event: any, datepicker){
    datepicker.toggle(true);
  }
}
