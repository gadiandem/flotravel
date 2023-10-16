import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { tap, switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SearchFlightService } from '../../service/flight/search-flight.service';
import { AirportRes } from '../../model/flight/airport/airportRes';
import { SearchFlightForm } from '../../model/flight/search-flight-form';
import * as FlightListActions from '../../flight/store/flight-list.actions';
import * as fromApp from '../../store/app.reducer';
import {
  classType,
  flightConstant,
  flightTypeIndex,
  flightTypeValue,
} from '../../flight/flight.constant';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: 'app-search-form-flight',
  templateUrl: './search-form-flight.component.html',
  styleUrls: ['./search-form-flight.component.css'],
})
export class SearchFormFlightComponent implements OnInit {
  searchForm: FormGroup;
  searchFlightForm: SearchFlightForm;
  typeFlight: number;
  typeFlightLabel: string;
  minDate = new Date();

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
  nextCity : number;
  user: UserDetail;

  searching: boolean;
  searchFailed: boolean;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private searchAirport: SearchFlightService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    sessionStorage.clear();
    this.nextCity  = 0;
    this.formSubmitError = false;
    this.typeFlight = flightTypeIndex.ROUND_TRIP;
    this.searching = false;
    this.searchFailed = false;
    this.searchFlightForm = new SearchFlightForm();
    this.searchFlightForm.flyFromNext = [];
    this.searchFlightForm.destinationNext = [];
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    if (this.user) {
      sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.user));
    }
    this.initForm();
    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext(0);
    this.searchArrivalNext();
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
      debounceTime(300),
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
                  (err && err.message) || 'Something went wrong';
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
      debounceTime(300),
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
                  (err && err.message) || 'Something went wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationNext( index : any) {
    this.sugDestinationNexts$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.searchDestinationNexts[index]);
      }
    ).pipe(
      debounceTime(300),
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
                    (err && err.message) || 'Something went wrong';
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
      debounceTime(300),
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
                    (err && err.message) || 'Something went wrong';
                }
              )
            );
        }
        return of([]);
      })
    );
  }

  selectFlyFrom(flyFrom: any) {
    this.searchFlightForm.flyFrom = flyFrom;
  }

  selectDestination(destination: any) {
    this.searchFlightForm.destination = destination;
  }

  selectFlyFromNext(flyFromNext: any) {
    this.searchFlightForm.flyFromNext.push(flyFromNext);
  }

  selectDestinationNext(destinationNextValue: any) {
    this.searchFlightForm.destinationNext.push(destinationNextValue);
  }

  private initForm() {
    const startDate = new Date();
    const endDate = this.addDays(new Date(), 1);
    this.searchForm = new FormGroup({
      flyFrom: new FormControl('', [Validators.required, Validators.minLength(3)]),
      destination: new FormControl('', [ Validators.required, Validators.minLength(3)]),
      departuring: new FormControl(startDate, Validators.required),
      departuringRoundtrip: new FormControl(startDate),
      classType : new FormControl(3, Validators.required),
      returning: new FormControl(endDate, this.conditionalValidator(() => this.typeFlight === 2, Validators.required)),
      adults: new FormControl(1),
      children: new FormControl(0),
      infants: new FormControl(0),
      anotherCities: new FormArray([
        new FormGroup({
          flyFromNext: new FormControl('', this.conditionalValidator(() => this.typeFlight === 3, Validators.required)),
          destinationNext: new FormControl('', this.conditionalValidator(() => this.typeFlight === 3, Validators.required)),
          departuringNext: new FormControl('', this.conditionalValidator(() => this.typeFlight === 3, Validators.required)),
        }),
      ]),
      // provider: new FormControl(0),
      bspBooking: new FormControl(false),
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

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  get flightsControls() {
    return (this.searchForm.get('anotherCities') as FormArray).controls;
  }

  onOpenDatepicker(event: any, datepicker: any) {
    datepicker.toggle(true);
  }
  onAddCity() {
    if (this.nextCity == -1) {
      this.nextCity = 1;
    } else {
      this.nextCity++;
    }
    const index = this.nextCity;
    (this.searchForm.get('anotherCities') as FormArray).push(
      new FormGroup({
        flyFromNext: new FormControl('', this.conditionalValidator(
          () => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)),
        destinationNext: new FormControl( '', this.conditionalValidator(
          () => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)),
        departuringNext: new FormControl('', this.conditionalValidator(
          () => this.typeFlight === flightTypeIndex.MULTI_CITY, Validators.required)),
      })
    );
    this.searchDestinationNext(index);
    this.searchArrivalNext(index);

  }

  removeitem(index: number) {
    (this.searchForm.get('anotherCities') as FormArray).removeAt(index);
    this.nextCity--;
  }

  removeAllitem() {
    (this.searchForm.get('anotherCities') as FormArray).reset();
    this.nextCity--;
  }

  flightTypeChange(type: number) {
    switch (type) {
      case 1:
        this.typeFlight = flightTypeIndex.ONE_WAY;
        this.typeFlightLabel = flightTypeValue.ONE_WAY;
        this.removeAllitem();
        break; // one way
      case 2:
        this.typeFlight = flightTypeIndex.ROUND_TRIP;
        this.typeFlightLabel = flightTypeValue.ROUND_TRIP;
        this.removeAllitem();
        break; // roundtrip
      case 3:
        this.typeFlight = flightTypeIndex.MULTI_CITY;
        this.typeFlightLabel = flightTypeValue.MULTI_CITY;
        this.removeAllitem();
        break; // multi city
    }
  }

  searchFlight() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      // sessionStorage.setItem(flightConstant.PROVIDER, d.provider);
      if (d.departuring) {
        this.searchFlightForm.departuring = this.datePipe.transform(d.departuring, 'yyyy-MM-dd');
      }
      this.searchFlightForm.adults = +d.adults;
      this.searchFlightForm.children = +d.children;
      this.searchFlightForm.infants = +d.infants;
      this.searchFlightForm.simulator = false;
      this.searchFlightForm.bspBooking = d.bspBooking;
      this.searchFlightForm.classType = d.classType;
      if (this.typeFlight === flightTypeIndex.ROUND_TRIP) {
        this.searchFlightForm.departuring = this.datePipe.transform(d.departuringRoundtrip, 'yyyy-MM-dd');
        this.searchFlightForm.returning = this.datePipe.transform(d.returning, 'yyyy-MM-dd' );
      }
      if (this.typeFlight === flightTypeIndex.MULTI_CITY) {
        this.searchFlightForm.departuringNext = [];
        (d.anotherCities as Array<any>).forEach((city) => {
          this.searchFlightForm.departuringNext.push(this.datePipe.transform(city.departuringNext, 'yyyy-MM-dd'));
        });
      }
      this.flightTypeChange(this.typeFlight);
      this.searchFlightForm.typeFlight = this.typeFlightLabel;
      if (this.searchFlightForm.bspBooking) {
        sessionStorage.setItem(flightConstant.FLIGHT_BSP_BOOKING, '1');
      } else {
        sessionStorage.setItem(flightConstant.FLIGHT_BSP_BOOKING, '0');
      }
      sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(this.searchFlightForm));
      this.store.dispatch(new FlightListActions.SearchFlightStart(this.searchFlightForm));
      this.router.navigate(['/flight']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  onChangeCheckOutDate(e, popup) {
    popup.toggle(false);
  }

}
