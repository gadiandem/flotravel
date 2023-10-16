import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormArray, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Observable, of, Observer } from 'rxjs';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { flightConstant, flightTypeValue } from '../flight.constant';

@Component({
  selector: 'app-flight-search-dialogs',
  templateUrl: './flight-search-dialog.component.html',
  styleUrls: ['./flight-search-dialog.component.css']
})
export class FlightSearchDialogComponent implements OnInit {

  bsConfig: Partial<BsDatepickerConfig>;
  searchForm: FormGroup;
  searchFlightForm: SearchFlightForm;
  typeFlight: string;
  minDate = new Date();
  // typeFlightLabel: string;

  suggestions1$: Observable<AirportRes[]>;
  search1: string;
  suggestions2$: Observable<AirportRes[]>;
  search2: string;
  suggestions3$: Observable<AirportRes[]>;
  search3: string;
  suggestions4$: Observable<AirportRes[]>;
  search4: string;
  errorMessage: string;
  public event: EventEmitter<SearchFlightForm> = new EventEmitter();
  formSubmitError: boolean;
  searching = false;
  searchFailed = false;
  airportList: AirportRes[] = [];
  airportListLabel: string[] = [];
  constructor(protected router: Router,
    public bsModalRef: BsModalRef, public datepipe: DatePipe, private searchAirport: SearchFlightService) {
  }

  get flightsControls() {
    return (this.searchForm.get('anotherCities') as FormArray).controls;
  }

  ngOnInit() {
    // this.searchFlightForm = new SearchFlightForm();
    this.search1 = this.searchFlightForm.flyFrom.name;
    this.search2 = this.searchFlightForm.destination.name;
    // this.search3 = this.searchFlightForm.flyFrom.name;
    // this.search4 = this.searchFlightForm.destination.name;
    this.formSubmitError = false;
    this.bsConfig = Object.assign({},
      { containerClass: 'theme-red', dateInputFormat: 'DD-MM-YYYY', minDate: this.minDate, showWeekNumbers: false });
    this.initForm();
    (this.searchForm.get('flyFrom') as FormControl).setValue(this.searchFlightForm.flyFrom);
    (this.searchForm.get('destination') as FormControl).setValue(this.searchFlightForm.destination);
    (this.searchForm.get('departuring') as FormControl).setValue(new Date(this.searchFlightForm.departuring));
    if(this.searchFlightForm.returning ){
      (this.searchForm.get('returning') as FormControl).setValue(new Date(this.searchFlightForm.returning));
    }
    (this.searchForm.get('adults') as FormControl).setValue(this.searchFlightForm.adults);
    (this.searchForm.get('children') as FormControl).setValue(this.searchFlightForm.children);

    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext();
    this.searchArrivalNext();
  }

  private initForm() {
    this.searchForm = new FormGroup({
      flyFrom: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      departuring: new FormControl('', Validators.required),
      returning: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.ROUND_TRIP), Validators.required)),
      adults: new FormControl(1),
      children: new FormControl(0),
      anotherCities: new FormArray([
        new FormGroup({
          flyFromNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          destinationNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          departuringNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required))
        })
      ])
    });
  }
  searchDestination() {
    this.suggestions1$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search1);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search1).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchArrival() {
    this.suggestions2$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search2);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search2).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationNext() {
    this.suggestions3$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search3);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search3).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchArrivalNext() {
    this.suggestions4$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search4);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search4).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
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

  selectDestinationNext(destinationNext: any) {
    this.searchFlightForm.destinationNext.push(destinationNext);
  }
  conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  onAddCity() {
    (this.searchForm.get('anotherCities') as FormArray).push(
      new FormGroup({
        flyFromNext: new FormControl('', Validators.required),
        destinationNext: new FormControl('', Validators.required),
        departuringNext: new FormControl('', Validators.required),
      })
    );
  }

  removeitem(index: number) {
    (this.searchForm.get('anotherCities') as FormArray).removeAt(index);
  }

  onValueChange(value: Date): void {
    (this.searchForm.get("returning") as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
    this.bsConfig = Object.assign({},{
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }
  flightTypeChange(type: number) {
    switch (type) {
      case 1:
        this.typeFlight = flightTypeValue.ONE_WAY;
        break; // one way
      case 2:
        this.typeFlight = flightTypeValue.ROUND_TRIP;
        break; // roundtrip
      case 3:
        this.typeFlight = flightTypeValue.MULTI_CITY;
        break; // multi city
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    // console.log('Form Submitted with value: flight');
    this.searchFlight();
    this.bsModalRef.hide();
  }


  searchFlight() {
    if(this.searchForm.valid){
      const d: any = this.searchForm.value;
      this.searchFlightForm.departuring = this.datepipe.transform(d.departuring, 'yyyy-MM-dd');
      this.searchFlightForm.adults = d.adults;
      this.searchFlightForm.children = d.children;
      this.searchFlightForm.typeFlight = this.typeFlight;
      if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
        this.searchFlightForm.returning = this.datepipe.transform(d.returning, 'yyyy-MM-dd');
      }
      if (this.typeFlight === flightTypeValue.MULTI_CITY) {
        this.searchFlightForm.returning = this.datepipe.transform(d.returning, 'yyyy-MM-dd');
        this.searchFlightForm.departuringNext = [];
        (d.anotherCities as Array<any>).forEach((city) => {
          this.searchFlightForm.departuringNext.push(this.datepipe.transform(city.departuringNext, 'yyyy-MM-dd'));
        });
      }
      sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(this.searchFlightForm));
      this.event.emit(this.searchFlightForm);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
