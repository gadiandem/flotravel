import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { FlightRuleConfigure } from 'src/app/model/combine-service/flight-configure-rule';

@Component({
  selector: 'app-flight-rule-edit',
  templateUrl: './flight-rule-edit.component.html',
  styleUrls: ['./flight-rule-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightRuleEditComponent implements OnInit {
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
  ruleId: string;
  ruleDetail: FlightRuleConfigure;
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
    this.activeRoute.params.subscribe((params: Params) => {
      this.ruleId = params["ruleId"];
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        this.fetRuleDetail();
    });
    this.fetchAirlineList();
    this.searchDestination();
    this.searchArrival();
  }

  fetRuleDetail(){
    this.flightRuleConfigureService.getFlightRuleDetail(this.user.id, this.ruleId).subscribe(
      res => {
        this.ruleDetail = res;
        this.updateFormData();
        this.fetchAirlineList();
      }, e => {
        this.alertify.error(e);
      }
    )
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
  updateFormData() {
    this.agentForm.patchValue({
      type: this.ruleDetail.type,
      departure: this.ruleDetail.departure.displayName,
      arrival: this.ruleDetail.arrival.displayName,
      providers: this.ruleDetail.providers ? this.ruleDetail.providers[0].code : '0',
      businessCabinPreferences: this.ruleDetail.businessCabinPreferences?this.ruleDetail.businessCabinPreferences[0].code : '7',
      baggagePreferences: this.ruleDetail.baggagePreferences ? this.ruleDetail.baggagePreferences[0].name : '3',
    });
  }
  fetchAirlineList() {
    this.airlines = JSON.parse(localStorage.getItem(flightConstant.AIRLINE_LIST)) || [];
    if(this.ruleDetail){
      if (this.airlines.length === 0) {
        this.airlineService.getAirline().subscribe(
          (res: Airline[]) => {
            this.airlines = res;
            this.updatePreferences();
          }, e => {
            console.log(e)
          }
        );
      } else {
        this.updatePreferences();
      }
    }
  }
  updatePreferences(){
    if(this.airlines.length > 0){
      const includesTemp = [];
      this.ruleDetail.airlinePreferenceIncludes.forEach(s => {
        const selectAirline = this.airlines.find(i => i.iata === s.code);
        if(selectAirline){
          includesTemp.push(this.airlines.find(i => i.iata === s.code))
        }
      })
      if(includesTemp.length > 0){
        this.agentForm.patchValue({
          airlinePreferenceIncludes: includesTemp
        })
      }

      const excludesTemp = [];
      this.ruleDetail.airlinePreferenceExcludes.forEach(s => {
        const selectAirline = this.airlines.find(i => i.iata === s.code);
        if(selectAirline){
          excludesTemp.push(this.airlines.find(i => i.iata === s.code))
        }
      })
      if(excludesTemp.length > 0){
        this.agentForm.patchValue({
          airlinePreferenceExcludes: excludesTemp
        })
      }
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

  findProviderValue(value: string): number{
    switch(value){
      case 'ALL':
        return 0;
      case 'HAHN_AIR':
          return 1;
      case 'AERO_CRS':
        return 2;
      case 'ET':
        return 3;
      default:
        return 0;
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
      if(!this.flyFrom){
        this.flyFrom = this.ruleDetail.departure;
      }
      if(!this.destination){
        this.destination = this.ruleDetail.arrival;
      }
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

      const airlinePreferenceIncludes = [];
      if(d.airlinePreferenceIncludes){
        d.airlinePreferenceIncludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.iata;
          prefer.name = e.name;
          airlinePreferenceIncludes.push(prefer);
        });
      }
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
      this.flightRuleConfigureService.editFlightRule(request,this.ruleId, this.user.id).subscribe(
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
