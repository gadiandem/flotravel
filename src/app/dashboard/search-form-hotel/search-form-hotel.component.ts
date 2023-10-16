import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, tap, switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { DestinationRes } from '../../model/dashboard/desRes.model';
import * as HotelActions from '../../hotel/store/hotel.actions';
import * as fromApp from '../../store/app.reducer';
import { HotelShoppingReq } from '../../model/dashboard/hotel/hotel-shopping-req';
import { RoomGuest } from '../../model/dashboard/hotel/room-guest';
import { hotelConstant } from '../../hotel/hotel.constant';
import { appConstant, supplierSimulatorOption } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-search-form-component',
  templateUrl: './search-form-hotel.component.html',
  styleUrls: ['./search-form-hotel.component.css']
})
export class SearchFormHotelComponent implements OnInit {

  hotelSupplierSimulator: string;
  checkin_date: Date;
  checkout_date: Date;
  public range = { start: null, end: null };
  searchForm: FormGroup;
  searchHotelListRequest: HotelShoppingReq;
  formSubmitError: boolean;

  destinationName: string;
  cityCode: string;

  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  minDateStart: Date;
  @Output() formValid = new EventEmitter<boolean>();

  model: any;
  searching = false;
  searchFailed = false;
  user: UserDetail;

  constructor(protected router: Router,
    protected dashboardService: DashboardService,
    public datepipe: DatePipe,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {
    sessionStorage.clear();
    this.minDateStart = new Date();
    this.formSubmitError = false;
    this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
      this.user = user;
    });
  if (this.user) {
    sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.user));
  }
    this.searchHotelListRequest = JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    if (this.searchHotelListRequest != null) {
      this.checkin_date = new Date(this.searchHotelListRequest.checkinDate);
      this.checkout_date = new Date(this.searchHotelListRequest.checkoutDate);
      this.search = this.searchHotelListRequest.destination;
    } else {
      this.checkin_date = new Date();
      this.checkout_date = this.addDays(new Date(), 1);
    }
    this.hotelSupplierSimulator = localStorage.getItem(appConstant.HOTEL_SIMULATOR_SUPPLIER) || supplierSimulatorOption.DISABLE;
    this.initForm();
    this.updateValue();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
    this.searchDestination();
  }

  updateValue() {
    if (this.searchHotelListRequest) {
      this.searchHotelListRequest.rooms.forEach(
        (r: RoomGuest) => {
         this.updateRoom(r);
        }
      );
    } else {
      this.onAddRoom();
    }
  }

  updateRoom(item: RoomGuest) {
    (this.searchForm.get('rooms') as FormArray).push(
      new FormGroup({
        adult: new FormControl(item.adult),
        children: new FormControl(item.children)
      })
    );
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

  private onFormValid() {
    this.formValid.emit(this.searchForm.valid);
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      checkin_date: new FormControl(this.checkin_date, Validators.required),
      checkout_date: new FormControl(this.checkout_date, Validators.required),
      rooms: new FormArray([]),
      simulator: new FormControl(false)
    });

  }
  get roomsControls() {
    return (this.searchForm.get('rooms') as FormArray).controls;
  }

  onAddRoom() {
    (this.searchForm.get('rooms') as FormArray).push(
      new FormGroup({
        adult: new FormControl(1),
        children: new FormControl(0)
      })
    );
  }
  public disabledDates = (date: Date): boolean => {
    return date.getDate() % 2 === 0;
  };
  removeItem(index: number) {
    (this.searchForm.get('rooms') as FormArray).removeAt(index);
  }

  onChangeCheckOutDate(e, popup) {
    console.log(e);
    popup.toggle(false);
  }

  searchHotel() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchHotelListData = new HotelShoppingReq();
      searchHotelListData.destination = this.destinationName || this.searchHotelListRequest.destination;
      searchHotelListData.cityCode = this.cityCode || this.searchHotelListRequest.cityCode;
      const demo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
      searchHotelListData.simulator = demo;
      searchHotelListData.rooms = [];
      searchHotelListData.checkinDate = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
      searchHotelListData.checkoutDate = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
      (d.rooms as Array<any>).forEach((r) => {
        const room = new RoomGuest();
        room.adult = +r.adult;
        room.children = +r.children;
        if (+r.children > 0) {
          const childAges = [];
          for (let i = 0; i < +r.children; i++) {
            childAges.push(10);
          }
          room.childAges = childAges;
        }
        searchHotelListData.rooms.push(room);
      });

      if (d.simulator) {
        sessionStorage.setItem(hotelConstant.DEMO, d.simulator);
      }
      if (this.hotelSupplierSimulator === 'enable') {
        sessionStorage.setItem(
          hotelConstant.SEARCH_HOTEL_LIST_REQUEST,
          JSON.stringify(searchHotelListData)
        );
        this.router.navigate(['/simulator/hotel']);
      } else {
       this.store.dispatch(new HotelActions.SearchHotelListStart(
          { data: searchHotelListData }));
        this.router.navigate(['/hotel']);
      }
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
