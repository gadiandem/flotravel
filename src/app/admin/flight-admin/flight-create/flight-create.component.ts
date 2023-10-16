import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { AlertifyService } from 'src/app/service/alertify.service';
import { Store } from "@ngrx/store";
import { tap, switchMap, map, debounceTime } from 'rxjs/operators';
import { Observable, of, Observer } from 'rxjs';
import * as fromApp from "../../../store/app.reducer";
import { appConstant } from "src/app/app.constant";
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FloAir } from 'src/app/model/flight/create-floAir';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { FloAirSearchForm } from 'src/app/model/flight/flo-air-searchform';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { Airline } from 'src/app/model/flight/airline/airline';

@Component({
  selector: 'app-flight-create',
  templateUrl: './flight-create.component.html',
  styleUrls: ['./flight-create.component.css']
})
export class FlightCreateComponent implements OnInit {

  errorMessage: string[] = [];
  searching: boolean;
  searchFailed: boolean;
  isLoading: boolean;
  formSubmitError: boolean;
  account: UserDetail;
  flightForm: FormGroup;
  floAirSearchForm : FloAirSearchForm;
  weightAllowance: any;


  sugFlyFrom$: Observable<AirportRes[]>;
  searchFlyFrom: string[] = [];
  sugFlyTo$: Observable<AirportRes[]>;
  searchFlyTo: string[] = [];
  sugDestinationNexts$: Observable<AirportRes[]>[] = [];
  searchDestinationNexts: string[] = [];
  sugArrivalNexts$: Observable<AirportRes[]>[] = [];
  searchArrivalNexts: string[] = [];
  nextCity = 1;
  searchAirline: Airline[] = [];
  selectedAirline$: Observable<string[]>;
  sugSearchStop$: Observable<AirportRes[]>;
  searchStop: string[] = [];
  selectedStop: string;

  constructor(
    private _location: Location,
    private searchAirport: SearchFlightService,
    private searchFlightService: SearchFlightService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.floAirSearchForm = new FloAirSearchForm();
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(
          localStorage.getItem(appConstant.ACCOUNT_INFO)
        );
      }
    });
    this.selectAirline();
    this.initFlightForm();
    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext();
    this.searchArrivalNext();
    this.searchStopDestination();
  }

  private initFlightForm() {
    this.flightForm = new FormGroup({
      fromcode: new FormControl('', Validators.required),
      from: new FormControl("", Validators.required),
      depCityName: new FormControl('', Validators.required),
      depCountry: new FormControl("", Validators.required),
      agentId: new FormControl('', Validators.required),
      tocode: new FormControl("", Validators.required),
      to: new FormControl('', Validators.required),
      arrCityName: new FormControl("", Validators.required),
      arrCountry: new FormControl("", Validators.required),
      stop: new FormControl('', Validators.required),
      depart: new FormControl("", Validators.required),
      arrive: new FormControl("", Validators.required),
      stopDepart: new FormControl("", Validators.required),
      stopArrive: new FormControl("", Validators.required),
      basicFare: new FormControl("", Validators.required),
      tax: new FormControl("", Validators.required),
      totalFare: new FormControl("", Validators.required),
      airline: new FormControl("", Validators.required),
      aircraft: new FormControl("", Validators.required),
      flightNumber: new FormControl("", Validators.required),
      flightClass: new FormControl("ECONOMY", Validators.required),
      flightType: new FormControl("Direct", Validators.required),
      maximumWeight: new FormControl(10, Validators.required),
      totalQuantity: new FormControl(2, Validators.required),
    });
  }

  flightTypeList: any[] = [
    { option: 'Direct' },
    { option: 'OneStop' }
  ];



  searchStopDestination() {
    this.sugSearchStop$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchStop[0]);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          return this.searchAirport.searchAirport(this.searchStop[0]).pipe(
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
                  (err && err.message) || 'Something went wrong';
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
                    (err && err.message) || 'Something went wrong';
                }
              )
            );
        }
        return of([]);
      })
    );
  }

  selectDestination(destination: any) {
    this.floAirSearchForm.to = destination.name;
    this.floAirSearchForm.tocode =  destination.code;
    this.floAirSearchForm.arrCityName =  destination.cityCode;
    this.floAirSearchForm.arrCountry =  destination.country.code;
  }
  selectFlyFrom(flyFrom: any) {
    this.floAirSearchForm.from = flyFrom.name;
    this.floAirSearchForm.fromcode =  flyFrom.code;
    this.floAirSearchForm.depCityName =  flyFrom.cityCode;
    this.floAirSearchForm.depCountry =  flyFrom.country.code;
  }
  selectStop(stopdestination: any) {
    this.floAirSearchForm.stop = stopdestination.name;
    this.floAirSearchForm.stopCode =  stopdestination.code;
    this.floAirSearchForm.stopCityName =  stopdestination.cityCode;
    this.floAirSearchForm.stopCountry =  stopdestination.country.code;
  }

  selectAirline() {
    this.searchAirport.getAirlines().subscribe(
      (data: Airline[]) => {
        data.forEach(res =>{
          this.searchAirline.push(res);
        });
      }
    );
  }
  getselectedAirline(item: any) {
    this.floAirSearchForm.airline = item.iata + " - " + item.name;
  }
  setDeparture(time: any){
    console.log('time: ' + JSON.stringify(time));
    let now = new Date();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.floAirSearchForm.depart = str;
  }
  setArrival(time: any){
    console.log('time: ' + JSON.stringify(time));
    let now = new Date();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.floAirSearchForm.arrive = str;
  }
  saveFlight() {
   //if (this.flightForm.valid) {
      const d: FloAir = this.flightForm.value;
      this.floAirSearchForm.aircraft = d.aircraft;
      this.floAirSearchForm.arrCityName = this.floAirSearchForm.arrCityName;
      this.floAirSearchForm.arrCountry = this.floAirSearchForm.arrCountry;
      this.floAirSearchForm.arrive = d.arrive;
      this.floAirSearchForm.basicFare = d.basicFare;
      this.floAirSearchForm.depCityName = this.floAirSearchForm.depCityName;
      this.floAirSearchForm.depCountry = this.floAirSearchForm.depCountry;
      this.floAirSearchForm.depart = d.depart;
      this.floAirSearchForm.duration;
      this.floAirSearchForm.flightClass = d.flightClass;
      this.floAirSearchForm.flightNumber = d.flightNumber;
      this.floAirSearchForm.flightType = this.selectedStop;
      this.floAirSearchForm.from = this.floAirSearchForm.from ;
      this.floAirSearchForm.fromcode = this.floAirSearchForm.fromcode;
      this.floAirSearchForm.tax = d.tax;
      this.floAirSearchForm.to = this.floAirSearchForm.to;
      this.floAirSearchForm.tocode = this.floAirSearchForm.tocode;
      this.floAirSearchForm.stopDepart = d.stopDepart;
      this.floAirSearchForm.stopArrive = d.stopArrive;
      this.floAirSearchForm.totalFare = d.totalFare;
      this.floAirSearchForm.totalQuantity = d.totalQuantity;
      this.floAirSearchForm.maximumWeight = d.maximumWeight;
      console.log(JSON.stringify(this.floAirSearchForm));
      this.searchFlightService.createFloAirFlight(this.floAirSearchForm).subscribe(
        (res: FloAir) => {
          this.alertify.success(`Flight ${res.airline} create succeeful`);
          this._location.back();
        },
        (e) => {
          this.alertify.error(`There is some error!!!`);
          console.log(e);
        },
       
      );
   //} else {
   //   this.formSubmitError = true;
   //   return;
  //}
  }

}
