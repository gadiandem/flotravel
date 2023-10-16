import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap';

import * as fromApp from '../../store/app.reducer';
import {SearchFlightService} from '../../service/flight/search-flight.service';
import {gcaConstant} from '../gca.constant';
import {SearchGcaForm} from '../../model/gca/shopping/request/search-gca-form';
import {GcaModel} from '../../model/gca/shopping/request/gca-model';
import {AirportCode} from '../../model/gca/shopping/request/airport-code';
import {Meta} from '../../model/gca/common/meta';
import {Observable, Observer, of} from 'rxjs';
import {AirportRes} from '../../model/flight/airport/airportRes';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-gca-search-dialogs',
  templateUrl: './gca-search-dialog.component.html',
  styleUrls: ['./gca-search-dialog.component.css']
})
export class GcaSearchDialogComponent implements OnInit {

  searchGcaForm: SearchGcaForm;
  meta: Meta;
  departureAirport: AirportRes;
  arrivalAirport: AirportRes;
  minDate = new Date();

  bsConfig: Partial<BsDatepickerConfig>;
  searchForm: FormGroup;

  sugDepartureAirport$: Observable<AirportRes[]>;
  searchDepartureAirport: string[] = [];
  sugArrivalAirport$: Observable<AirportRes[]>;
  searchArrivalAirport: string[] = [];

  searching = false;
  searchFailed = false;
  errorMessage: string;

  public event: EventEmitter<SearchGcaForm> = new EventEmitter();
  constructor(
    protected router: Router,
    protected datepipe: DatePipe,
    protected searchAirport: SearchFlightService,
    protected store: Store<fromApp.AppState>,
    public bsModalRef: BsModalRef
  ) {
  }

  ngOnInit() {
    this.searchDepartureAirport[0] = this.searchGcaForm.flights[0].departure_airport.iata;
    this.searchArrivalAirport[0] = this.searchGcaForm.flights[0].arrival_airport.iata;
    this.meta = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER));
    this.initFormDialog();
    console.log(this.searchGcaForm);
    (this.searchForm.get('departureAirport') as FormControl).setValue(this.searchGcaForm.flights[0].departure_airport.iata);
    (this.searchForm.get('arrivalAirport') as FormControl).setValue(this.searchGcaForm.flights[0].arrival_airport.iata);
    (this.searchForm.get('departing') as FormControl).setValue(new Date(this.searchGcaForm.flights[0].departure_date));
    (this.searchForm.get('flightNo') as FormControl).setValue(this.searchGcaForm.flights[0].flight_no);
    (this.searchForm.get('adults') as FormControl).setValue(this.meta.adult);
    (this.searchForm.get('children') as FormControl).setValue(this.meta.child);
    (this.searchForm.get('infants') as FormControl).setValue(this.meta.infant);

    this.searchDestination();
    this.searchArrival();
  }

  initFormDialog() {
    this.searchForm = new FormGroup({
      departureAirport: new FormControl('', [Validators.required, Validators.minLength(3)]),
      arrivalAirport: new FormControl('', [ Validators.required, Validators.minLength(3)]),
      departing: new FormControl('', Validators.required),
      flightNo: new FormControl('',
        [Validators.required, Validators.minLength(3), Validators.maxLength(5), Validators.pattern('^[a-zA-Z]{2}[0-9]{3}$')]),
      adults: new FormControl( 1 , Validators.required),
      children: new FormControl( 0 , Validators.required),
      infants: new FormControl( 0 , Validators.required)
    });
  }

  searchDestination() {
    this.sugDepartureAirport$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchDepartureAirport[0]);
    }).pipe(
      debounceTime(500),
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
    this.sugArrivalAirport$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchArrivalAirport[0]);
    }).pipe(
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
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }


  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    // console.log('Form Submitted with value: ', this.searchForm.value);
    this.searchGca();
    this.bsModalRef.hide();
  }

  getAirportCode(str: string) : string {
    const index: number = str.indexOf('(');
    return str ? str.substring(index + 1, index + 4) : null;
  }

  selectDepartureAirport(departureAirport: any) {
    this.departureAirport = departureAirport;
  }

  selectArrivalAirport(arrivalAirport: any) {
    this.arrivalAirport = arrivalAirport;
  }

  searchGca() {
    const d: any = this.searchForm.value;
    const searchGcaForm: SearchGcaForm = new SearchGcaForm();
    searchGcaForm.flights = [];
    const gcaModel = new GcaModel();
    const flightNo = d.flightNo;
    gcaModel.flight_no = flightNo.toLocaleUpperCase();
    console.log(gcaModel.flight_no);
    gcaModel.departure_date = this.datepipe.transform(d.departing, 'yyyy-MM-dd');
    console.log(d.departing);
    gcaModel.departure_airport = new AirportCode(this.getAirportCode(d.departureAirport));
    gcaModel.arrival_airport = new AirportCode(this.getAirportCode(d.arrivalAirport));
    searchGcaForm.flights.push(gcaModel);
    // if (this.typeGca === gcaTypeIndex.MULTI_FLIGHT) {
    //   (d.anotherFlights as Array<any>).forEach((flight) => {
    //     gcaModel.departure_date = this.datepipe.transform(flight.departingNext, "yyyy-MM-dd");
    //     gcaModel.flight_no = flight.flightNoNext;
    //     gcaModel.departure_airport = new AirportCode(this.getAirportCode(flight.departureAirportNext));
    //     gcaModel.arrival_airport = new AirportCode(this.getAirportCode(flight.arrivalAirportNext));
    //     this.searchGcaForm.flights.push(gcaModel);
    //   });
    // }
    const meta: Meta = new Meta();
    meta.child = d.children;
    meta.adult = d.adults;
    meta.infant = d.infants;
    sessionStorage.setItem(gcaConstant.GCA_PASSENGER_NUMBER, JSON.stringify(meta));
    sessionStorage.setItem(gcaConstant.DEPARTURE_AIRPORT, JSON.stringify(this.departureAirport));
    sessionStorage.setItem(gcaConstant.ARRIVAL_AIRPORT, JSON.stringify(this.arrivalAirport));
    sessionStorage.setItem(gcaConstant.SEARCH_GCA, JSON.stringify(searchGcaForm));
    this.event.emit(searchGcaForm);
    this.bsModalRef.hide();
  }
}
