import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ObjectUnsubscribedError, Observable, Observer, of } from 'rxjs';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import {
  economyData,
  flightConstant,
  flightTypeValue,
  moreOptionData,
  typeFlightData,
} from '../../flight.constant';
import * as fromApp from 'src/app/store/app.reducer';
import * as FlightListActions from 'src/app/flight/store/flight-list.actions';
import { Router } from '@angular/router';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { Journey } from 'src/app/model/gca/quote/response/gca-quote-result';

@Component({
  selector: 'app-flight-search-box',
  templateUrl: './flight-search-box.component.html',
  styleUrls: ['./flight-search-box.component.css'],
})
export class FlightSearchBoxComponent implements OnInit, OnChanges {
  @ViewChild('travellerDropDown', { static: false }) travellerDropDown: ElementRef;
  @ViewChild('travellerDropDownMobile', { static: false }) travellerDropDownMobile: ElementRef;

  @Input() typeFlight: string;
  @Input() fetching: boolean;
  @Input() searchFlightFormInit: SearchFlightForm;
  @Output() searchFlightBox = new EventEmitter<SearchFlightForm>();

  flightClass = '7';
  searchFlightForm: SearchFlightForm;
  updatedFlyFrom: AirportRes;
  updatedDestination: AirportRes;
  updatedFlyFromNext: AirportRes[] = [];
  updatedDestinationNext: AirportRes[] = [];
  updatedDeparturingNext: string[] = [];
  searchForm: FormGroup;
  searchFormNew: FormGroup;
  adultNumber: number;
  childrenNumber: number;
  typeFlightIndexStr: string;
  options: Options;
  bsConfig: Partial<BsDatepickerConfig>;
  minDate = new Date();


  showDropDown: boolean;
  showDropDownMobile: boolean;
  economyData: Array<Select2OptionData> = economyData;
  selectedFlightClass = this.flightClass;
  moreOptionData: Array<Select2OptionData> = moreOptionData;
  typeFlightData: Array<Select2OptionData> = typeFlightData;

  suggestions1$: Observable<AirportRes[]>;
  search1: string;
  suggestions2$: Observable<AirportRes[]>;
  search2: string;
  suggestions3$: Observable<AirportRes[]>;
  sugDepartureNexts$: Observable<AirportRes[]>[] = [];
  sugArrivalNexts$: Observable<AirportRes[]>[] = [];
  searchFailed = false;
  searching = false;
  errorMessage: string[] = [];
  formSubmitError: boolean;
  flyFromNext: string[] = [];
  destinationsNext: string[] = [];
  nextCity : number;

  constructor(
    public datePipe: DatePipe,
    private route: Router,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2,
    private searchAirport: SearchFlightService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.searchFlightFormInit){
      this.searchFlightForm = Object.assign({}, changes.searchFlightFormInit.currentValue);
      console.log(this.searchFlightFormInit);
    }
    
   
  }
  ngOnInit() {
    this.nextCity  = 0;
    this.showDropDown = false;
    this.showDropDownMobile = false;
    this.searchFlightForm = Object.assign({}, this.searchFlightFormInit);
    if (!this.searchFlightForm || !this.searchFlightForm.destination) {
      this.route.navigate(['/dashboard/flight']);
    }
    this.flightClass = this.searchFlightForm.classType;
    this.getFlightTypeIndex(this.typeFlight);
    this.options = {
      theme: 'classic',
      width: 'auto',
      dropdownAutoWidth: true,
    };

    this.initForm();
    this.updateValueForm();
    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext(0);
    this.searchArrivalNext(0);
    this.refreshData();
  }

  refreshData() {
    this.search1 = this.searchFlightFormInit.flyFrom.displayName;
    this.search2 = this.searchFlightFormInit.destination.displayName;
    this.adultNumber = this.searchFlightFormInit.adults;
    this.childrenNumber = this.searchFlightFormInit.children;
    if (this.searchFlightFormInit.typeFlight == 'MULTI_CITY') {
      if (this.searchFlightFormInit.flyFromNext && this.searchFlightFormInit.flyFromNext.length > 0) {
        this.searchFlightFormInit.flyFromNext.forEach(
          response => {
            this.flyFromNext.push(response.displayName);
          }
        );
        this.searchFlightFormInit.destinationNext.forEach(
          response => {
            this.destinationsNext.push(response.displayName);
          }
        );
      }
    }
  }

  initForm() {
    this.searchForm = new FormGroup({
      flyFrom: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      departuring: new FormControl('', Validators.required),
      departuringRoundtrip: new FormControl(''),
      returning: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.ROUND_TRIP), Validators.required)),
      anotherCities: new FormArray([
        new FormGroup({
          flyFromNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          destinationNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          departuringNext: new FormControl('', this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required))
        })
      ])

    });
    if (this.searchFlightFormInit.typeFlight == 'MULTI_CITY') {
      for (let index = 1; index < this.searchFlightFormInit.flyFromNext.length; index++) {
        (this.searchForm.get('anotherCities') as FormArray).push(
          new FormGroup({
            flyFromNext: new FormControl(this.searchFlightFormInit.flyFromNext[index], Validators.required),
            destinationNext: new FormControl(this.searchFlightFormInit.destinationNext[index], Validators.required),
            departuringNext: new FormControl(this.searchFlightFormInit.departuringNext[index], Validators.required),
          })
        );
        this.searchDestinationNext(index);
        this.searchArrivalNext(index);
        this.nextCity = this.searchFlightFormInit.flyFromNext.length;
      }
    }
  }

  conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  updateValueForm() {
    this.searchFlightForm.classType = this.flightClass;
    (this.searchForm.get('flyFrom') as FormControl).patchValue(this.searchFlightFormInit.flyFrom.displayName);
    (this.searchForm.get('destination') as FormControl).patchValue(this.searchFlightFormInit.destination.displayName);
    (this.searchForm.get('departuring') as FormControl).patchValue(new Date(this.searchFlightFormInit.departuring));
    if (this.searchFlightFormInit.returning) {
      (this.searchForm.get('returning') as FormControl).patchValue(new Date(this.searchFlightFormInit.returning));
      (this.searchForm.get('departuringRoundtrip') as FormControl).patchValue(new Date(this.searchFlightFormInit.departuring));
    }
    if (this.searchFlightFormInit.typeFlight == 'MULTI_CITY') {
      for (let index = 0; index < this.searchFlightFormInit.flyFromNext.length; index++) {
        (this.searchForm.get('anotherCities') as FormArray).at(index).patchValue({ flyFromNext: this.searchFlightFormInit.flyFromNext[index].displayName, destinationNext: this.searchFlightFormInit.destinationNext[index].displayName, departuringNext: new Date(this.searchFlightFormInit.departuringNext[index]) });
      }
    }
  }

  resetMultiCity() {
    this.updatedFlyFromNext = [];
    this.updatedDestinationNext = [];
    this.updatedDeparturingNext = [];
  }

  valueChanged(id: string) {
    if (id === '1') {
      this.typeFlight = flightTypeValue.ONE_WAY;
    } else if (id === '2') {
      this.typeFlight = flightTypeValue.ROUND_TRIP;
    } else if (id === '3') {
      this.typeFlight = flightTypeValue.MULTI_CITY;
    }
    this.refreshData();
  }

  getFlightClass(id: string) {
    this.flightClass = id;
  }

  getFlightTypeIndex(type: string) {
    switch (type) {
      case flightTypeValue.ONE_WAY:
        this.typeFlightIndexStr = '1';
        break; // one way
      case flightTypeValue.ROUND_TRIP:
        this.typeFlightIndexStr = '2';
        break; // round trip
      case flightTypeValue.MULTI_CITY:
        this.typeFlightIndexStr = '3';
        break; // multi city
    }
  }

  toggleDropMobile() {
    this.showDropDownMobile = !this.showDropDownMobile;
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }
  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  changeShowDropDownMobile(isShowDropDownMobile: boolean) {
    this.showDropDownMobile = isShowDropDownMobile;
  }

  updateAdultNumber(value: number) {
    this.adultNumber = value;
  }

  updateChildrenNumber(value: number) {
    this.childrenNumber = value;
  }

  selectFlyFrom(flyFrom: any) {
    this.updatedFlyFrom = flyFrom;
  }

  selectDestination(destination: any) {
    this.updatedDestination = destination;
  }

  onValueChange(value: Date): void {
    const returnDateValue = new Date(this.searchForm.value.returning);
    if (returnDateValue && value) {
      if (value.getTime() > returnDateValue.getTime()) {
        (this.searchForm.get('returning') as FormControl).setValue(value);
        // this.minReturnDate = value;
        const returnDate = value;
        this.bsConfig = Object.assign(
          {},
          {
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD-MM-YYYY',
            minDate: returnDate,
            showWeekNumbers: false,
          }
        );
      }
    }
  }
  onValueChangeMultiCity(date: Date): void {
    this.updatedDeparturingNext.push(this.datePipe.transform(date, 'yyyy-MM-dd'));
  }

  selectFlyFromNext(flyFromNext: any, index: any) {
    this.updatedFlyFromNext.push(flyFromNext);
  }

  selectDestinationNext(destinationNext: any) {
    this.updatedDestinationNext.push(destinationNext);
  }

  removeitem(index: number) {
    (this.searchForm.get('anotherCities') as FormArray).removeAt(index);
    this.nextCity--;
    this.searchDestinationNext(this.nextCity);
    this.searchArrivalNext(this.nextCity);
  }

  onAddCity() {
    if (this.nextCity == -1) {
      this.nextCity = 1;
    } else {
      this.nextCity++;
    }
    (this.searchForm.get('anotherCities') as FormArray).push(
      new FormGroup({
        flyFromNext: new FormControl('', Validators.required),
        destinationNext: new FormControl('', Validators.required),
        departuringNext: new FormControl('', Validators.required),
      })
    );
    this.searchDestinationNext(this.nextCity);
    this.searchArrivalNext(this.nextCity);
    this.nextCity++;
  }


  get flightsControls() {
    return (this.searchForm.get('anotherCities') as FormArray).controls;
  }

  searchFlight() {
    this.searchFlightForm = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
    const d: any = this.searchForm.value;
    this.searchFlightForm.adults = this.adultNumber;
    this.searchFlightForm.children = this.childrenNumber;
    this.searchFlightForm.typeFlight = this.typeFlight;
    this.searchFlightForm.classType = this.flightClass;
    this.searchFlightForm.simulator = false;
    if (this.typeFlight === flightTypeValue.MULTI_CITY) {

      if (this.updatedFlyFromNext.length >= 1) {
        this.searchFlightForm.flyFromNext = this.updatedFlyFromNext;
      }
      if (this.updatedDestinationNext.length >= 1) {
        this.searchFlightForm.destinationNext = this.updatedDestinationNext;
      }
      if (this.updatedDeparturingNext.length >= 1) {
        this.searchFlightForm.departuringNext = this.updatedDeparturingNext;
      }
    }

    if (this.updatedDestination) {
      this.searchFlightForm.destination = this.updatedDestination;
    }
    if (this.updatedFlyFrom) {
      this.searchFlightForm.flyFrom = this.updatedFlyFrom;
    }

    if (d.departuring) {
      this.searchFlightForm.departuring = this.datePipe.transform(d.departuring, 'yyyy-MM-dd');
    }

    const valueBspBooking: string = sessionStorage.getItem(
      flightConstant.FLIGHT_BSP_BOOKING
    );
    if (valueBspBooking === '1') {
      this.searchFlightForm.bspBooking = true;
    } else {
      this.searchFlightForm.bspBooking = false;
    }

    if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
      this.searchFlightForm.returning = this.datePipe.transform(d.returning, 'yyyy-MM-dd');
      this.searchFlightForm.departuring = this.datePipe.transform(d.departuringRoundtrip, 'yyyy-MM-dd');
    }

    sessionStorage.setItem(
      flightConstant.SEARCH_FLIGHTS,
      JSON.stringify(this.searchFlightForm)
    );
    this.searchFlightBox.emit(this.searchFlightForm);
    this.resetMultiCity();
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
  searchDestinationNext(index: any) {
    this.sugDepartureNexts$[index] = new Observable((observer: Observer<string>) => {
      observer.next(this.flyFromNext[index]);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.flyFromNext[index]).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something went wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchArrivalNext(index: any) {
    this.sugArrivalNexts$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.destinationsNext[index]);
      }).pipe(
        switchMap((query: string) => {
          if (query) {
            // using github public api to get users by name
            return this.searchAirport.searchAirport(this.destinationsNext[index]).pipe(
              map((data: AirportRes[]) => {
                this.searchFailed = false;
                return data || [];
              }),
              tap(() => this.searching = false, err => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage = err && err.message || 'Something went wrong';
              })
            );
          }
          return of([]);
        })
      );
  }


  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    const menuDropClick = btn.className === this.travellerDropDown.nativeElement.className;
    const dropDown = btn.closest('app-room-guests-flight');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClickMobile(btn) {
    if (this.travellerDropDownMobile) {
      const menuDropClick = btn.className === this.travellerDropDownMobile.nativeElement.className;
      const dropDown = btn.closest('app-room-guests-flight');
      if (!menuDropClick && !dropDown) {
        this.showDropDownMobile = false;
      }
    }
  }

  onOpenDatepicker(event: any, datepicker: any) {
    datepicker.toggle(true);
  }
  onChangeCheckOutDate(e, popup) {
    popup.toggle(false);
  }
}
