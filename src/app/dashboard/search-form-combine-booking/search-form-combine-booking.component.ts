import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, tap, switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import * as fromApp from '../../store/app.reducer';
import { RoomGuest } from '../../model/dashboard/hotel/room-guest';
import { hotelConstant } from '../../hotel/hotel.constant';
import { appConstant } from 'src/app/app.constant';
import { CombineDestination } from 'src/app/model/combine/combine-destination';
import { CombineShoppingReq } from 'src/app/model/combine/shopping-req';
import { CombineBookingService } from 'src/app/service/combine/combine-booking.service';
import { classType, combineBookingConstant, flightTypeValue } from 'src/app/combine-booking/combine-booking.constant';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { CountryRes } from 'src/app/model/common/country/country-res';


@Component({
  selector: 'app-search-form-combine-booking',
  templateUrl: './search-form-combine-booking.component.html',
  styleUrls: ['./search-form-combine-booking.component.css']
})
export class SearchFormCombineBookingComponent implements OnInit {
  checkin_date: Date;
  checkout_date: Date;

  searchForm: FormGroup;
  searchDestinationListRequest: CombineShoppingReq;
  formSubmitError: boolean;

  destinationName: string;
  destinationCode: string;

  leaveFromName: string;
  leaveFromCode: string;

  selectedDestination: CombineDestination;
  selectedLeaveFrom: CombineDestination;


  suggestions$: Observable<CombineDestination[]>;
  suggestions2$: Observable<CombineDestination[]>;
  search = '';
  leaveFrom = '';
  errorMessage: string;
  limit: number;
  minDateStart: Date;
  @Output() formValid = new EventEmitter<boolean>();

  model: any;
  searching = false;
  searchFailed = false;

  constructor(protected router: Router,
    protected combineService: CombineBookingService,
    public datepipe: DatePipe,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {
    sessionStorage.clear();
    this.minDateStart = new Date();
    this.formSubmitError = false;
    this.searchDestinationListRequest = JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    if (this.searchDestinationListRequest != null) {
      this.checkin_date = new Date(this.searchDestinationListRequest.checkinDate);
      this.checkout_date = new Date(this.searchDestinationListRequest.checkoutDate);
      this.search = this.searchDestinationListRequest.destination ? this.searchDestinationListRequest.destination.displayName : '';
      this.leaveFrom = this.searchDestinationListRequest.leaveFrom ? this.searchDestinationListRequest.leaveFrom.displayName : '';
    } else {
      this.checkin_date = new Date();
      this.checkout_date = this.addDays(new Date(), 1);
    }

    this.initForm();
    this.updateValue();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
    this.searchDestination();
    this.searchLeaveFrom();
  }

  updateValue() {
    if (this.searchDestinationListRequest) {
      this.searchDestinationListRequest.rooms.forEach(
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
      // if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      // }
    })
    .pipe(
      debounceTime(1000),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.combineService.searchDestination(this.search).pipe(
            map((data: CombineDestination[]) => {
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

  searchLeaveFrom() {
    this.suggestions2$ = new Observable((observer: Observer<string>) => {
      // if (this.leaveFrom.length > 3) {
        this.limit = 7;
        observer.next(this.leaveFrom);
      // }
    })
    .pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.combineService.searchDestination(this.leaveFrom).pipe(
            map((data: CombineDestination[]) => {
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
  select(des: CombineDestination) {
    this.selectedDestination = des;
  }

  selectLeaveFrom(leaveFrom: CombineDestination) {
    this.selectedLeaveFrom = leaveFrom;
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
      leaveFrom: new FormControl('', [Validators.required, Validators.minLength(3)]),
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

  removeItem(index: number) {
    (this.searchForm.get('rooms') as FormArray).removeAt(index);
  }

  searchCombineSerivce() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchCombineService = new CombineShoppingReq();
      // searchHoteListData.destination = this.destinationName || this.searchDestinationListRequest.destination;
      // searchHoteListData.cityCode = this.destinationCode || this.searchDestinationListRequest.cityCode;
      searchCombineService.destination = this.selectedDestination;
      searchCombineService.leaveFrom = this.selectedLeaveFrom;
      const demo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
      searchCombineService.simulator = demo;
      searchCombineService.rooms = [];
      searchCombineService.checkinDate = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
      searchCombineService.checkoutDate = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
      let aduls = 0;
      let children = 0;
      (d.rooms as Array<any>).forEach((r) => {
        const room = new RoomGuest();
        room.adult = +r.adult;
        room.children = +r.children;
        aduls += r.adult;
        children += r.children;
        if (+r.children > 0) {
          const childAges = [];
          for (let i = 0; i < +r.children; i++) {
            childAges.push(10);
          }
          room.childAges = childAges;
        }
        searchCombineService.rooms.push(room);
      });
      this.saveSearchFormFlight(d, aduls, children);
      sessionStorage.setItem(combineBookingConstant.SEARCH_REQUEST, JSON.stringify(searchCombineService));
      this.router.navigate(['/combine']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
  saveSearchFormFlight(d: any, aduls: number, child: number) {
    const searchFlightForm: SearchFlightForm = new SearchFlightForm();
    searchFlightForm.destination = this.convertDestinationToAirport(this.selectedDestination);
    searchFlightForm.flyFrom = this.convertDestinationToAirport(this.selectedLeaveFrom);
    searchFlightForm.departuring = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
    searchFlightForm.returning = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
    searchFlightForm.adults = aduls;
    searchFlightForm.children = child;
    // searchFlightForm.infants = child;
    searchFlightForm.simulator = false;
    searchFlightForm.bspBooking = d.bspBooking;
    searchFlightForm.typeFlight = flightTypeValue.ONE_WAY;
    searchFlightForm.classType = classType.AnyCabin;
    sessionStorage.setItem(combineBookingConstant.SEARCH_FLIGHTS, JSON.stringify(searchFlightForm));
    // this.store.dispatch(new FlightListActions.SearchFlightStart(searchFlightForm));
  }

  convertDestinationToAirport(destination: CombineDestination): AirportRes {
    if (destination.type === 'AIRPORT') {
      const response = new AirportRes();
      response.cityCode = destination.cityId;
      response.cityName = destination.city;
      response.code = destination.airportCode;
      const country = new CountryRes();
      country.code = destination.country;
      country.name = '';
      response.country = country;
      response.displayName = destination.displayName;
      return response;
    } else {
      return null;
    }
  }
  onChangeCheckOutDate(e, popup) {
    console.log(e);
    popup.toggle(false);
  }

}
