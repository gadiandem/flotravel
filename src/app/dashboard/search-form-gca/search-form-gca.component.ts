import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl, FormArray, AbstractControl, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { tap, switchMap, map, debounceTime } from "rxjs/operators";
import { Observable, of, Observer } from "rxjs";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { SearchFlightService } from "../../service/flight/search-flight.service";
import { AirportRes } from "../../model/flight/airport/airportRes";
import * as GcaActions from '../../gca/store/gca.actions';
import * as fromApp from "../../store/app.reducer";
import { gcaConstant , gcaTypeValue, gcaTypeIndex } from '../../gca/gca.constant';
import { SearchGcaForm } from '../../model/gca/shopping/request/search-gca-form';
import { GcaModel } from '../../model/gca/shopping/request/gca-model';
import { AirportCode } from '../../model/gca/shopping/request/airport-code';
import {Bags, Meta} from '../../model/gca/common/meta';

@Component({
  selector: 'app-search-form-gca',
  templateUrl: './search-form-gca.component.html',
  styleUrls:  ['./search-form-gca.component.css']
})
export class SearchFormGcaComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  searchForm: FormGroup;
  typeGca: number;
  typeGcaLabel: string;
  minDate = new Date();

  sugDepartureAirport$: Observable<AirportRes[]>;
  searchDepartureAirport: string[] = [];
  sugArrivalAirport$: Observable<AirportRes[]>;
  searchArrivalAirport: string[] = [];
  sugDepartureAirportNext$: Observable<AirportRes[]>[] = [];
  searchDepartureAirportNext: string[] = [];
  sugArrivalAirportNext$: Observable<AirportRes[]>[] = [];
  searchArrivalAirportNext: string[] = [];
  errorMessage: string[] = [];
  formSubmitError: boolean;
  nextFlight = 1;

  searching: boolean;
  searchFailed: boolean;
  departureAirport: AirportRes;
  arrivalAirport: AirportRes;

  constructor(
    protected router: Router,
    protected datepipe: DatePipe,
    protected searchAirport: SearchFlightService,
    protected store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    // this.typeGca = gcaTypeIndex.SINGLE_FLIGHT;
    this.searching = false;
    this.searchFailed = false;
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-dark-blue",
        dateInputFormat: "DD-MM-YYYY",
        minDate: this.minDate,
        showWeekNumbers: false,
      }
    );
    this.initForm();
    this.searchDestination();
    this.searchArrival();
    // this.searchDestinationNext();
    // this.searchArrivalNext();
  }

  onValueChange(value: Date): void {
    const returnDate = value;
    this.bsConfig = Object.assign({},{
        containerClass: "theme-dark-blue",
        dateInputFormat: "DD-MM-YYYY",
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }

  searchDestination() {
    this.sugDepartureAirport$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchDepartureAirport[0]);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(this.searchDepartureAirport[0]).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchArrival() {
    this.sugArrivalAirport$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchArrivalAirport[0]);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(this.searchArrivalAirport[0]).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(
              () => (this.searching = false),
              (err) => {
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationNext(index = 0) {
    this.sugDepartureAirportNext$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.searchDepartureAirportNext[0]);
      }
    ).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport
            .searchAirport(this.searchDepartureAirportNext[index])
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
                    (err && err.message) || "Something goes wrong";
                }
              )
            );
        }
        return of([]);
      })
    );
  }
  searchArrivalNext(index = 0) {
    this.sugArrivalAirportNext$[index] = new Observable(
      (observer: Observer<string>) => {
        observer.next(this.searchArrivalAirportNext[0]);
      }
    ).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport
            .searchAirport(this.searchArrivalAirportNext[index])
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
                    (err && err.message) || "Something goes wrong";
                }
              )
            );
        }
        return of([]);
      })
    );
  }

  selectDepartureAirport(departureAirport: any) {
    this.departureAirport = departureAirport;
  }

  selectArrivalAirport(arrivalAirport: any) {
    this.arrivalAirport = arrivalAirport;
  }

  private initForm() {
    this.searchForm = new FormGroup({
      departureAirport: new FormControl("", [Validators.required,Validators.minLength(3)]),
      arrivalAirport: new FormControl("", [ Validators.required,Validators.minLength(3)]),
      departing: new FormControl("", Validators.required),
      flightNo: new FormControl("",
        [Validators.required,Validators.minLength(3), Validators.maxLength(5), Validators.pattern('^[a-zA-Z]{2}[0-9]{3}$')]),
      adults: new FormControl( 1 , Validators.required),
      children: new FormControl( 0 , Validators.required),
      infants: new FormControl( 0 , Validators.required),
      bagsLarge: new FormControl( 1 , Validators.required),
      bagsMedium: new FormControl( 0 , Validators.required),
      bagsSmall: new FormControl( 0 , Validators.required),
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

  // get flightsControls() {
  //   return (this.searchForm.get("anotherFlights") as FormArray).controls;
  // }

  // onAddCity() {
  //   (this.searchForm.get("anotherFlights") as FormArray).push(
  //     new FormGroup({
  //       departureAirportNext: new FormControl("",this.conditionalValidator(() => this.typeGca === gcaTypeIndex.MULTI_FLIGHT,Validators.required)),
  //       arrivalAirportNext: new FormControl( "",this.conditionalValidator(() => this.typeGca === gcaTypeIndex.MULTI_FLIGHT,Validators.required)),
  //       departingNext: new FormControl("",this.conditionalValidator(() => this.typeGca === gcaTypeIndex.MULTI_FLIGHT,Validators.required)),
  //       flightNoNext: new FormControl("", this.conditionalValidator(() => this.typeGca === gcaTypeIndex.MULTI_FLIGHT,Validators.required))
  //     })
  //   );
  //   this.searchDestinationNext(this.nextFlight);
  //   this.searchArrivalNext(this.nextFlight);
  //   this.nextFlight++;
  // }

  // removeItem(index: number) {
  //   (this.searchForm.get("anotherFlights") as FormArray).removeAt(index);
  //   this.nextFlight--;
  // }

  // removeAllItem() {
  //   (this.searchForm.get("anotherFlights") as FormArray).reset();
  //   this.nextFlight--;
  // }

  // gcaTypeChange(type: number) {
  //   switch (type) {
  //     case 1:
  //       this.typeGca = gcaTypeIndex.SINGLE_FLIGHT;
  //       this.typeGcaLabel = gcaTypeValue.SINGLE_FLIGHT;
  //       this.removeAllItem();
  //       break; // Single Flight
  //     case 2:
  //       this.typeGca = gcaTypeIndex.MULTI_FLIGHT;
  //       this.typeGcaLabel = gcaTypeValue.MULTI_FLIGHT;
  //       break; // Multi Flight
  //   }
  // }

  getAirportCode(str: string) : string {
    let index:number = str.indexOf("(");
    return str ? str.substring(index + 1, index + 4) : null;
  }
  searchGca() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchGcaForm: SearchGcaForm = new SearchGcaForm();
      searchGcaForm.flights = [];
      let gcaModel = new GcaModel();
      let flightNo = d.flightNo;
      gcaModel.flight_no = flightNo.toLocaleUpperCase();
      gcaModel.departure_date = this.datepipe.transform(d.departing, "yyyy-MM-dd");
      gcaModel.departure_airport = new AirportCode(this.getAirportCode(d.departureAirport));
      gcaModel.arrival_airport = new AirportCode(this.getAirportCode(d.arrivalAirport));
      searchGcaForm.flights.push(gcaModel);

      const meta: Meta = new Meta();
      meta.child = +d.children;
      meta.adult = +d.adults;
      meta.infant = +d.infants;
      const bags = new Bags(+d.bagsSmall, +d.bagsMedium, +d.bagsLarge);
      meta.bags = bags;
      sessionStorage.setItem(gcaConstant.GCA_PASSENGER_NUMBER, JSON.stringify(meta));
      sessionStorage.setItem(gcaConstant.DEPARTURE_AIRPORT, JSON.stringify(this.departureAirport));
      sessionStorage.setItem(gcaConstant.ARRIVAL_AIRPORT, JSON.stringify(this.arrivalAirport));
      console.log(searchGcaForm);
      sessionStorage.setItem(gcaConstant.SEARCH_GCA, JSON.stringify(searchGcaForm))
      this.store.dispatch(new GcaActions.SearchGcaStart({data: searchGcaForm}));
      this.router.navigate(["/gca"]);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
