import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
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
import { FlightRuleConfigureService } from 'src/app/service/admin/combine-service/flight-rule-configure.service';
import { FlightRuleConfigure } from 'src/app/model/combine-service/flight-configure-rule';

@Component({
  selector: 'app-flight-rule-detail',
  templateUrl: './flight-rule-detail.component.html',
  styleUrls: ['./flight-rule-detail.component.css']
})
export class FlightRuleDetailComponent implements OnInit {
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
  selectFlyFrom(flyFrom: any) {
    this.flyFrom = flyFrom;
  }

  selectDestination(destination: any) {
    this.destination = destination;
  }
  private initForm() {
    this.agentForm = this.fb.group({
      type: ["ROUND_TRIP", Validators.required],
      departure: ["", Validators.required],
      arrival: ["", Validators.required],
      providers: ["All", Validators.required],
      airlinePreferenceIncludes: ["", Validators.required],
      airlinePreferenceExcludes: ["", [Validators.required]],
      businessCabinPreferences: ["", [Validators.required]],
      baggagePreferences: ["3", [Validators.required]],
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
