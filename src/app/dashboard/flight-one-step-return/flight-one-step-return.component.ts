import {Component, OnInit, ElementRef, ViewChild, HostListener} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {SearchFlightForm} from '../../model/flight/search-flight-form';
import {Observable, Observer, of} from 'rxjs';
import {AirportRes} from '../../model/flight/airport/airportRes';
import {UserDetail} from '../../model/auth/user/user-detail';
import {FlightBookingListUI} from '../../model/flight/history/flight-booking-list.ui';
import {Select2OptionData} from 'ng-select2';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {SearchFlightService} from '../../service/flight/search-flight.service';
import {Store} from '@ngrx/store';
import {CookieService} from 'ngx-cookie-service';
import {FlightBookingHistoryService} from '../../service/flight/flight-history.service';
import {FlyFromHistory} from '../../model/flight/fly-from-history';
import {GeoIP} from '../../model/common/GeoIP';
import * as fromApp from '../../store/app.reducer';
import * as FlightListActions from '../../flight/store/flight-list.actions';
import {flightConstant, flightTypeIndex, flightTypeValue, economyData} from '../../flight/flight.constant';
import {appConstant} from '../../app.constant';
import {Utils} from '../../shared/utils/utils';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {FlightHistory} from '../../model/flight/history/flight-history-res';

@Component({
  selector: 'app-flight-one-step-return',
  templateUrl: './flight-one-step-return.component.html',
  styleUrls: ['./flight-one-step-return.component.css']
})
export class FlightOneStepReturnComponent implements OnInit {
  @ViewChild('travellerDropDown', {static: false}) travellerDropDown: ElementRef;
  @ViewChild('travellerDropDown2', {static: false}) travellerDropDown2: ElementRef;
  @ViewChild('historyFlyFrom', {static: false}) historyFlyFrom: ElementRef;
  searchForm: FormGroup;
  searchFlightForm: SearchFlightForm;
  typeFlight: number;
  typeFlightLabel: string;
  sugFlyFrom$: Observable<AirportRes[]>;
  searchFlyFrom: string[] = [];
  sugFlyTo$: Observable<AirportRes[]>;
  searchFlyTo: string[] = [];
  sugDestinationNexts$: Observable<AirportRes[]>[] = [];
  searchDestinationNexts: string[] = [];
  sugArrivalNexts$: Observable<AirportRes[]>[] = [];
  searchArrivalNexts: string[] = [];
  errorMessage: string[] = [];
  formSubmitError: boolean;
  nextCity: number;
  searching: boolean;
  searchFailed: boolean;
  adultNumber: number;
  childrenNumber: number;
  infantsNumber: number;
  showDropDown: boolean;
  departureDate: any;
  returnDate: any;
  departureNextDate: any[];
  cityNameFrom: string;
  cityNameArrival: string;
  user: UserDetail;
  cookie_flyFrom: string[];
  cookie_flyTo: string[];
  showHistoryDropdownFrom: boolean;
  userBooking: FlightBookingListUI[];
  flyFromHistory: FlyFromHistory[];
  currentLocation: GeoIP;
  economyData: Array<Select2OptionData> =  economyData;

  startDate: Date;
  startEnd: Date;
  minDate = new Date();
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private searchAirport: SearchFlightService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private flightHistoryService: FlightBookingHistoryService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    sessionStorage.clear();
    window.scroll(0, 0);
    this.startDate = new Date();
    this.startEnd = this.addDays(new Date(), 1);
    this.formSubmitError = false;
    this.typeFlight = flightTypeIndex.ROUND_TRIP;
    this.searching = false;
    this.searchFailed = false;
    this.searchFlightForm = new SearchFlightForm();
    this.searchFlightForm.flyFromNext = [];
    this.searchFlightForm.destinationNext = [];
    this.adultNumber = 1;
    this.childrenNumber = 0;
    this.infantsNumber = 0;
    this.nextCity = 1;
    this.showDropDown = false;
    this.showHistoryDropdownFrom = false;
    this.currentLocation = JSON.parse(localStorage.getItem(appConstant.CURRENT_LOCATION));

    this.departureNextDate = [];

    this.initForm();
    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext();
    this.searchArrivalNext();
    this.store.select('auth').subscribe(data => {
      this.user = data.user || Utils.getAccountInfoInSession();
    });
    if (this.user) {
      this.flyFromHistory = [];
      this.getBookingList();
    }
    this.cookie_flyFrom = [];
    this.cookie_flyTo = [];
    if (this.cookieService.get(flightConstant.COOKIES_FLY_FROM)) {
      this.cookie_flyFrom = JSON.parse(this.cookieService.get(flightConstant.COOKIES_FLY_FROM));
    }
  }

  onValueChange(value: Date): void {
    (this.searchForm.get('returning') as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
  }

  searchDestination() {
    this.sugFlyFrom$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchFlyFrom[0]);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(this.searchFlyFrom[0]).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationWithCity(city: string) {
    this.sugFlyFrom$ = new Observable((observer: Observer<string>) => {
      observer.next(city);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(city).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchArrival() {
    this.sugFlyTo$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchFlyTo[0]);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(this.searchFlyTo[0]).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(
              () => (this.searching = false),
              (err) => {
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationNext(index = 0) {
    this.sugDestinationNexts$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.searchDestinationNexts[0]);
      }
    ).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport
            .searchAirport(this.searchDestinationNexts[index])
            .pipe(
              map((data: AirportRes[]) => {
                this.searchFailed = false;
                return data || [];
              }),
              tap(
                () => (this.searching = false),
                (err) => {
                  this.searchFailed = true;
                  this.errorMessage =
                    (err && err.message) || 'Something goes wrong';
                }
              )
            );
        }
        return of([]);
      })
    );
  }
  searchArrivalNext(index = 0) {
    this.sugArrivalNexts$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.searchArrivalNexts[0]);
      }
    ).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport
            .searchAirport(this.searchArrivalNexts[index])
            .pipe(
              map((data: AirportRes[]) => {
                this.searchFailed = false;
                return data || [];
              }),
              tap(
                () => (this.searching = false),
                (err) => {
                  this.searchFailed = true;
                  this.errorMessage =
                    (err && err.message) || 'Something goes wrong';
                }
              )
            );
        }
        return of([]);
      })
    );
  }

  getCityName(data: string) : string {
    return data.split(',')[1].trim();
  }

  toggleHistoryFlyFrom() {
    this.showHistoryDropdownFrom = !this.showHistoryDropdownFrom;
  }

  selectAirport(index: number, type: string) {
    if (type === 'historySearch') {
      this.searchFlyFrom[0] = this.cookie_flyFrom[index];
      this.searchDestination();
      this.sugFlyFrom$.subscribe(data => {
        this.searchFlightForm.flyFrom = data[0];
        this.cityNameFrom = this.getCityName(this.searchFlightForm.flyFrom.displayName);
      });
    } else if (type === 'historyBooking') {
      this.searchFlyFrom[0] = this.flyFromHistory[index].airportName;
      this.searchDestination();
      this.sugFlyFrom$.subscribe(data => {
        this.searchFlightForm.flyFrom = data[0];
        this.cityNameFrom = this.getCityName(this.searchFlightForm.flyFrom.displayName);
      });
    } else {
      this.searchDestinationWithCity(this.currentLocation.city);
      this.sugFlyFrom$.subscribe(data => {
        this.searchFlightForm.flyFrom = data[0];
        this.cityNameFrom = this.getCityName(this.searchFlightForm.flyFrom.displayName);
        this.searchFlyFrom[0] = this.searchFlightForm.flyFrom.name;
      });
      this.searchDestination();
    }
    this.showHistoryDropdownFrom  = !this.showHistoryDropdownFrom;
  }

  getBookingList() {
    this.flightHistoryService.allFlightHistoryBookingList(this.user.id).subscribe(
      (res: FlightHistory) => {
        this.userBooking = res.bookingList;
        if (this.userBooking) {
          let airportCode = '';
          const iStart = this.userBooking.length - 1;
          let numberResult = 0;
          for (let i = iStart; i >= 0; --i) {
            const flyFrom : FlyFromHistory = new FlyFromHistory();
            if (!(this.userBooking[i].departureFlight) || (airportCode === this.userBooking[i].departureFlight.depAirportCode)) {
              continue;
            }
            airportCode = this.userBooking[i].departureFlight.depAirportCode;
            flyFrom.airportCode = this.userBooking[i].departureFlight.depAirportCode;
            this.searchAirport.getAirportByIata(airportCode).subscribe(data => {
              flyFrom.airportName = data.name;
            });
            flyFrom.createDate = this.userBooking[i].createDate;
            this.flyFromHistory.push(flyFrom);
            numberResult += 1;
            if (numberResult === 5) {
              break;
            }
          }
        }
      }, e => {
        console.log(e);
      }
    );
  }

  selectFlyFrom(flyFrom: any) {
    this.showHistoryDropdownFrom = false;
    this.searchFlightForm.flyFrom = flyFrom;
    this.cityNameFrom = this.getCityName(this.searchFlightForm.flyFrom.displayName);
    const index = this.cookie_flyFrom.indexOf(flyFrom.name);
    if (index === -1) {
      const cookie_fly_from_record = this.cookie_flyFrom;
      if (this.cookie_flyFrom && this.cookie_flyFrom.length > 4) {
        cookie_fly_from_record.splice(0, 1);
        cookie_fly_from_record.push(flyFrom.name);
      } else {
        cookie_fly_from_record.push(flyFrom.name);
      }
      this.cookieService.delete(flightConstant.COOKIES_FLY_FROM);
      this.cookieService.set(flightConstant.COOKIES_FLY_FROM, JSON.stringify(cookie_fly_from_record));
    }
  }

  selectDestination(destination: any) {
    this.searchFlightForm.destination = destination;
    this.cityNameArrival = this.getCityName(this.searchFlightForm.destination.displayName);
  }

  selectFlyFromNext(flyFromNext: any) {
    this.searchFlightForm.flyFromNext.push(flyFromNext);
  }

  selectDestinationNext(destinationNext: any) {
    this.searchFlightForm.destinationNext.push(destinationNext);
  }

  private initForm() {
    this.searchForm = this.fb.group({
      flyFrom: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [ Validators.required, Validators.minLength(3)]],
      departing: [this.startDate, Validators.required],
      returning: [this.startEnd, this.conditionalValidator(() => this.typeFlight === 2, Validators.required)],
      classType : [3 , Validators.required],
      anotherCities: new FormArray([
        this.fb.group({
          flyFromNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
          destinationNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
          departingNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
        }),
      ]),
    });
  }

  conditionalValidator(condition: () => boolean, validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  get flightsControls() {
    return (this.searchForm.get('anotherCities') as FormArray).controls;
  }

  onAddCity() {
    (this.searchForm.get('anotherCities') as FormArray).push(
      this.fb.group({
        flyFromNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
        destinationNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
        departingNext: ['', this.conditionalValidator(() => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)],
      })
    );

    this.searchDestinationNext(this.nextCity);
    this.searchArrivalNext(this.nextCity);
    this.nextCity++;
  }

  removeItem(index: number) {
    (this.searchForm.get('anotherCities') as FormArray).removeAt(index);
    this.departureNextDate.splice(this.nextCity - 1, 1);
    this.nextCity--;
  }

  removeAllItem() {
    (this.searchForm.get('anotherCities') as FormArray).reset();
    this.departureNextDate = [];
    this.nextCity = 1;
  }

  closeSearchForm() {
    this.el.nativeElement.querySelector('.full-search-canvas').classList.remove('show-full');
  }

  closeSearchFormDestination() {
    this.el.nativeElement.querySelector('.full-search-canvas-destination').classList.remove('show-full');
  }

  flightTypeChange(type: number) {
    switch (type) {
      case 1:
        this.typeFlight = flightTypeIndex.ONE_WAY;
        this.typeFlightLabel = flightTypeValue.ONE_WAY;
        this.removeAllItem();
        break; // one way
      case 2:
        this.typeFlight = flightTypeIndex.ROUND_TRIP;
        this.typeFlightLabel = flightTypeValue.ROUND_TRIP;
        this.removeAllItem();
        break; // round-trip
      case 3:
        this.typeFlight = flightTypeIndex.MULTI_CITY;
        this.typeFlightLabel = flightTypeValue.MULTI_CITY;
        break; // multi city
    }
  }

  searchFlight() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      this.searchFlightForm.departuring = this.datePipe.transform(d.departing, 'yyyy-MM-dd');
      this.searchFlightForm.adults = this.adultNumber;
      this.searchFlightForm.children = this.childrenNumber;
      this.searchFlightForm.infants = this.infantsNumber;
      this.searchFlightForm.simulator = false;
      this.searchFlightForm.classType = d.classType;
      if (this.typeFlight === flightTypeIndex.ROUND_TRIP) {
        this.searchFlightForm.returning = this.datePipe.transform(d.returning, 'yyyy-MM-dd' );
      }
      // if (this.typeFlight === flightTypeIndex.MULTI_CITY) {
      //   this.searchFlightForm.departuringNext = [];
      //   (this.departureNextDate as Array<any>).forEach((date) => {
      //     this.searchFlightForm.departuringNext.push(this.datePipe.transform(this.createDate(date), 'yyyy-MM-dd'));
      //   });
      // }
      this.flightTypeChange(this.typeFlight);
      this.searchFlightForm.typeFlight = this.typeFlightLabel;
      sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(this.searchFlightForm));
      sessionStorage.setItem(flightConstant.CITY_FROM, this.cityNameFrom);
      sessionStorage.setItem(flightConstant.CITY_ARRIVAL, this.cityNameArrival);
      this.store.dispatch(new FlightListActions.SearchFlightStart(this.searchFlightForm));
      this.router.navigate(['/flight/flight-order']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  updateAdultNumber(value: number) {
    this.adultNumber = value;
  }

  updateChildrenNumber(value: number) {
    this.childrenNumber = value;
  }

  updateInfantNumber(value: number) {
    this.infantsNumber = value;
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    let menuDropClick: boolean;
    if (this.typeFlight === 3) {
      menuDropClick = btn.className  === this.travellerDropDown2.nativeElement.className;
    } else {
      menuDropClick = btn.className === this.travellerDropDown.nativeElement.className;
    }
    const dropDown =  btn.closest('app-room-guests-flight');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }

    if (this.typeFlight === 1 || this.typeFlight === 2) {
      const historyFlyFrom = btn.className === this.historyFlyFrom.nativeElement.className;
      const dropDown2 = btn.closest('#historyFlyFrom');
      if (!historyFlyFrom && !dropDown2) {
        this.showHistoryDropdownFrom = false;
      }
    }
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  getDate(receiveDate: any) {
    this.departureDate = this.el.nativeElement.querySelector('.js-checkin').value;
    console.log(this.departureDate);
    if (this.typeFlight === 2) {
      this.returnDate = this.el.nativeElement.querySelector('.js-checkout').value;
    }
    console.log(this.returnDate);
    if (this.departureDate) {
      this.searchForm.controls['departing'].setValue(this.departureDate);
    } else {
      this.searchForm.controls['departing'].reset();
    }
    if (this.returnDate) {
      this.searchForm.controls['returning'].setValue(this.returnDate);
    } else {
      this.searchForm.controls['returning'].reset();
    }
  }

  getDepartureNextDate(data: any) {
    this.departureNextDate.push(data);
  }

  onChangeCheckOutDate(e, popup) {
    popup.toggle(false);
  }
}
