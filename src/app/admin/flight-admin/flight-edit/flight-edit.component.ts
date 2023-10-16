import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgencyService } from 'src/app/service/admin/agency/agency.service';
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
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css']
})
export class FlightEditComponent implements OnInit {


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
  flightId: string;
  user: UserDetail;
  flightDetail : FloAir;

  sugSearchStop$: Observable<AirportRes[]>;
  searchStop: string[] = [];
  selectedStop: string;
  searchAirline: Airline[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
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
    this.initFlightForm();
    this.searchDestination();
    this.searchStopDestination();
    this.searchArrival();
    this.selectAirline();
    this.searchDestinationNext();
    this.searchArrivalNext();
    this.activeRoute.params.subscribe((params: Params) => {
      this.flightId = params['flightId'];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (!this.user) {
        this.route.navigate(['/']);
      }
      this.fetchFlightDetail();

    });
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
      stopCode: new FormControl('', Validators.required),
      stopCityName: new FormControl('', Validators.required),
      stopCountry: new FormControl("", Validators.required),
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

  fetchFlightDetail() {
    this.searchFlightService.getFlight(this.flightId , this.user.id, ).subscribe(
      res => {
        this.flightDetail = res;
        console.log(JSON.stringify(this.flightDetail));
        this.updateFormData();
        this.floAirSearchForm.fromcode = this.flightDetail.fromcode;
       this.floAirSearchForm.tocode = this.flightDetail.tocode;
      }, e => {
        this.alertify.error(e);
      }
    );
  }

  updateFormData() {
    this.flightForm.patchValue({
      from: this.flightDetail.from ,
      to: this.flightDetail.to,
      basicFare: this.flightDetail.basicFare,
      tax: this.flightDetail.tax,
      totalFare: this.flightDetail.totalFare,
      airline: this.flightDetail.airline,
      aircraft: this.flightDetail.aircraft ,
      flightNumber: this.flightDetail.flightSegment[0].flightNumber,
      flightClass: this.flightDetail.flightClass,
      flightType: this.flightDetail.flightType,
      depart: this.flightDetail.flightSegment[0].depart,
      arrive: this.flightDetail.flightSegment[0].arrive,
     
    });
    if(this.flightDetail.flightType == "OneStop" ){
      this.flightForm.patchValue({
        depart: this.flightDetail.flightSegment[0].depart,
        arrive: this.flightDetail.flightSegment[1].arrive,
        stopDepart: this.flightDetail.flightSegment[1].depart,
        stopArrive:this.flightDetail.flightSegment[0].arrive,
        stop:this.flightDetail.flightSegment[0].to,
      });
    }

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
    this.flightForm.get('tocode').setValue(destination.code);
    this.flightForm.get('arrCityName').setValue(destination.cityCode);
    this.flightForm.get('arrCountry').setValue(destination.country.code);
  }
  selectFlyFrom(flyFrom: any) {
    this.flightForm.get('fromcode').setValue(flyFrom.code);
    this.flightForm.get('depCityName').setValue(flyFrom.cityCode);
    this.flightForm.get('depCountry').setValue(flyFrom.country.code);
  }

  selectStop(stopdestination: any) {
    this.flightForm.get('stopCode').setValue(stopdestination.code);
    this.flightForm.get('stopCityName').setValue(stopdestination.cityCode);
    this.flightForm.get('stopCountry').setValue(stopdestination.country.code);
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
  saveFlight() {
   //if (this.flightForm.valid) {
      const d: FloAir = this.flightForm.value;
      this.floAirSearchForm = d;
      this.floAirSearchForm.arrCityName = this.flightDetail.arrCityName;
      this.floAirSearchForm.arrCountry = this.flightDetail.arrCountry;
      this.floAirSearchForm.depCityName = this.flightDetail.depCityName;
      this.floAirSearchForm.depCountry = this.flightDetail.depCountry;
      this.floAirSearchForm.totalQuantity = d.totalQuantity;
      this.floAirSearchForm.maximumWeight = d.maximumWeight;
      this.floAirSearchForm.stopDepart = d.stopDepart;
      this.floAirSearchForm.stopArrive = d.stopArrive;
      console.log(JSON.stringify(this.floAirSearchForm));
      this.searchFlightService.editFlight(this.floAirSearchForm, this.flightId , this.user.id, ).subscribe(
        res => {
          this.alertify.success(`Flight ${res.airline} update succeeful`);
          this.flightDetail = res;
          console.log(JSON.stringify(this.flightDetail));
          this.updateFormData();
        }, e => {
          this.alertify.error(e);
        }
      );
   //} else {
   //   this.formSubmitError = true;
   //   return;
  //}
  }

}
