import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Observer, of, Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { flightConstant } from 'src/app/flight/flight.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { Airline } from 'src/app/model/flight/airline/airline';
import { AlertifyService } from 'src/app/service/alertify.service';
import { SearchCountryService } from 'src/app/service/search-country.service';
import * as fromApp from 'src/app/store/app.reducer';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { FlightRuleConfigureCreate } from 'src/app/model/combine-service/flight-configure-rule-create';
import { PreferenceItem } from 'src/app/model/combine-service/preference-item';
import { FlightRuleConfigureService } from 'src/app/service/admin/combine-service/flight-rule-configure.service';
@Component({
  selector: 'app-flight-rule-create',
  templateUrl: './flight-rule-create.component.html',
  styleUrls: ['./flight-rule-create.component.css']
})
export class FlightRuleCreateComponent implements OnInit {
  subscription: Subscription;
  agentForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;
  sugFlyFrom$: Observable<AirportRes[]>;
  searchFlyFrom: string[] = [];
  sugFlyTo$: Observable<AirportRes[]>;
  searchFlyTo: string[] = [];
  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  flyFrom: AirportRes;
  destination: AirportRes;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private searchAirport: SearchFlightService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private flightRuleConfigureService: FlightRuleConfigureService,
    private airlineService: SearchCountryService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.searchFailed = false;
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
    });
    this.fetchAirlineList();
    this.searchDestination();
    this.searchArrival();
  }
  private initForm() {
    this.agentForm = this.fb.group({
      type: ["ROUND_TRIP", Validators.required],
      departure: ["", Validators.required],
      arrival: ["", Validators.required],
      providers: ["All", Validators.required],
      airlinePreferenceIncludes: [""],
      airlinePreferenceExcludes: [""],
      businessCabinPreferences: [""],
      baggagePreferences: ["3"],
    });
  }

  fetchAirlineList() {
    this.airlines = JSON.parse(localStorage.getItem(flightConstant.AIRLINE_LIST)) || [];
    if (this.airlines.length === 0) {
      this.airlineService.getAirline().subscribe(
        (res: Airline[]) => {
          this.airlines = res;
        }, e => {
          console.log(e)
        }
      );
    }
  }
  airlineAutoComplete = (text: string): Observable<Airline[]> => {
    return of([...this.airlines]);
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
                  (err && err.message) || "Something went wrong";
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
                  (err && err.message) || "Something went wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  selectFlyFrom(flyFrom: any) {
    this.flyFrom = flyFrom;
  }

  selectDestination(destination: any) {
    this.destination = destination;
  }
  findProviderName(index: number): string{
    switch(index){
      case 0:
        return 'ALL';
      case 1:
          return 'HAHN_AIR';
      case 2:
        return 'AERO_CRS';
      case 3:
        return 'ET';
      default:
        return 'ALL';
    }
  }

  findBusinessCabinetName(index: number): string{
    switch(index){
      case 1:
        return 'First';
      case 2:
          return 'Business';
      case 3:
        return 'Economy';
      case 4:
        return 'Premium Economy';
      case 5:
        return 'Economy 2';
      case 6:
        return 'Economy 3';
      case 7:
        return 'Any cabin, no preference';
      default:
        return 'Any cabin, no preference';
    }
  }
  createRule(){
    console.log(this.agentForm.value);
    if(this.agentForm.valid){
      const d: any = this.agentForm.value;
      const request = new FlightRuleConfigureCreate();
      request.code = this.flyFrom.code + '_' + this.destination.code;
      request.type = d.type;
      request.departure = this.flyFrom;
      request.arrival = this.destination;
      const provider = new PreferenceItem();
      provider.code = d.providers;
      provider.name = this.findProviderName(+d.providers);
      request.providers = [provider];

      const airlinePreferenceIncludes = []
      d.airlinePreferenceIncludes.forEach(e => {
        const prefer = new PreferenceItem();
        prefer.code = e.iata;
        prefer.name = e.name;
        airlinePreferenceIncludes.push(prefer);
      });
      request.airlinePreferenceIncludes = airlinePreferenceIncludes;
      const airlinePreferenceExcludes = []
      if(d.airlinePreferenceExcludes){
        d.airlinePreferenceExcludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.iata;
          prefer.name = e.name;
          airlinePreferenceExcludes.push(prefer);
        });
      }
    request.airlinePreferenceExcludes = airlinePreferenceExcludes;
    const businessCabinPreferences = new PreferenceItem();
    businessCabinPreferences.code = d.businessCabinPreferences;
    businessCabinPreferences.name = this.findBusinessCabinetName(+d.businessCabinPreferences);
    request.businessCabinPreferences = [businessCabinPreferences];
    const baggagePreferences = new PreferenceItem();
    baggagePreferences.code = d.baggagePreferences;
    baggagePreferences.name = d.baggagePreferences;
    request.baggagePreferences = [baggagePreferences];
    console.log(request);
      this.flightRuleConfigureService.createFlightRule(request, this.user.id).subscribe(
        res => {
          this.alertify.success(`Create Flight rule succeeful!`);
          this._location.back();
        }, e => {
          this.alertify.error(`${e}`);
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
