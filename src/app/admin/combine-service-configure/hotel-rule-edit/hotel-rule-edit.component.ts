import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, Observable, Observer, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { HotelRuleConfigureCreate } from 'src/app/model/combine-service/hotel-configure-rule-create';
import { HotelItem } from 'src/app/model/combine-service/hotel-item';
import { PreferenceItem } from 'src/app/model/combine-service/preference-item';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { HotelRuleConfigureService } from 'src/app/service/admin/combine-service/hotel-rule-configure.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import * as fromApp from 'src/app/store/app.reducer';
import { HotelRuleConfigure } from 'src/app/model/combine-service/hotel-configure-rule';
interface ModelAutoComplete {
  id: number;
  code: number;
}
const starList: ModelAutoComplete[] = [
  {
    id: 1,
    code: 1
  },
  {
    id: 2,
    code: 2
  },
  {
    id: 3,
    code: 2.5
  },
  {
    id: 4,
    code: 3
  },
  {
    id: 5,
    code: 3.5
  },
  {
    id: 6,
    code: 4
  },
  {
    id: 7,
    code: 4.5
  },
  {
    id: 8,
    code: 5
  }
]

@Component({
  selector: 'app-hotel-rule-edit',
  templateUrl: './hotel-rule-edit.component.html',
  styleUrls: ['./hotel-rule-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelRuleEditComponent implements OnInit {
  subscription: Subscription;
  formSubmitError: boolean;
  agentForm: FormGroup;
  hotels: HotelItem[];
  airports: any[];
  starList: ModelAutoComplete[] = starList;

  suggestions$: Observable<DestinationRes[]>;
  selectedDestination: DestinationRes;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  countries: CountryRes[];
  countryCode: string;
  user: UserDetail;
  ruleId: string;
  ruleDetail: HotelRuleConfigure;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    protected dashboardService: DashboardService,
    private fb: FormBuilder,
    private hotelRuleConfigureService: HotelRuleConfigureService
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.selectedDestination = new DestinationRes();
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.starList = JSON.parse(JSON.stringify(starList));
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.ruleId = params["ruleId"];
      console.log(this.ruleId);
    });
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
        this.fetRuleDetail();
    });
  }

  fetRuleDetail(){
    this.hotelRuleConfigureService.getHotelRuleDetail(this.user.id, this.ruleId).subscribe(
      res => {
        this.ruleDetail = res;
        this.updateFormData();
        this.searchDestination();
        this.fetchHotelList();
        this.fetchAirportPrefer();
      }, e => {
        this.alertify.error(e);
      }
    )
  }
  updateFormData() {
    this.search = this.ruleDetail.cityName;
    this.agentForm.patchValue({
      cityName: this.ruleDetail.cityName,
      providers: this.ruleDetail.providers[0].name,
      airport: this.ruleDetail.airportPrefer? this.ruleDetail.airportPrefer[0].code : ''
    });
  }
  private initForm() {
    this.agentForm = this.fb.group({
      cityName: ["", Validators.required],
      airport: [""],
      providers: ["Nuitee", Validators.required],
      hotelPreferenceIncludes: [""],
      hotelPreferenceExcludes: [""],
      // starPreferences: ["", Validators.required],
    });
  }
  fetchHotelList() {
    const cityId = this.selectedDestination.id  || this.ruleDetail.cityCode;
    this.subscription = this.hotelRuleConfigureService.getHotelInCityList(cityId).subscribe(
      (res: HotelItem[]) => {
        this.hotels = res;
        this.updatePreferences();
      },
      (e) => {
        console.log(e);
      }
    );
  }

  updatePreferences(){
    if(this.hotels.length > 0){
      const includesTemp = [];
      this.ruleDetail.hotelPreferenceIncludes.forEach(s => {
        const selectHotel = this.hotels.find(i => i.hotelCode.toString() === s.code);
        if(selectHotel){
          includesTemp.push(this.hotels.find(i => i.hotelCode.toString() === s.code))
        }
      })
      if(includesTemp.length > 0){
        this.agentForm.patchValue({
          hotelPreferenceIncludes: includesTemp
        })
      }

      const excludesTemp = [];
      this.ruleDetail.hotelPreferenceExcludes.forEach(s => {
        const selectHotel = this.hotels.find(i => i.hotelCode.toString() === s.code);
        if(selectHotel){
          excludesTemp.push(this.hotels.find(i => i.hotelCode.toString() === s.code))
        }
      })
      if(excludesTemp.length > 0){
        this.agentForm.patchValue({
          hotelPreferenceExcludes: excludesTemp
        })
      }
    }
  }

  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.dashboardService.getDestination(this.search).pipe(
            map((data: DestinationRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => {
              this.searching = false;
            }, err => {
              // in case of http error
              this.limit = 0;
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  select(des: DestinationRes) {
    this.selectedDestination = des;
    this.fetchHotelList();
    this.fetchAirportPrefer();
  }
  fetchAirportPrefer() {
    const cityId = this.selectedDestination.id  || this.ruleDetail.cityCode;
    this.subscription = this.hotelRuleConfigureService.getAirportByCountryCode(cityId).subscribe(
      (res: any[]) => {
        this.airports = res;
        this.updateSelectedAirport();
      },
      (e) => {
        console.log(e);
      }
    );
  }
  updateSelectedAirport() {
    this.agentForm.patchValue({
      airport: this.ruleDetail.airportPrefer? this.ruleDetail.airportPrefer[0].code : ''
    });
  }

  hotelListAutoComplete = (text: string): Observable<HotelItem[]> => {
    return of([...this.hotels]);
  }
  starListAutoComplete = (text: string): Observable<ModelAutoComplete[]> => {
    return of([...this.starList]);
  }
  editRule(){
    if(this.agentForm.valid){
      const d: any = this.agentForm.value;
      const request = new HotelRuleConfigureCreate();
      request.cityCode = this.selectedDestination.id || this.ruleDetail.cityCode;
      request.cityName = this.selectedDestination.displayName || this.ruleDetail.cityName;
      request.countryCode = this.selectedDestination.countryCode || this.ruleDetail.countryCode;
      request.countryName = this.selectedDestination.countryName || this.ruleDetail.countryName;
      request.code = (this.selectedDestination.id || this.ruleDetail.cityCode) + '_' + (this.selectedDestination.countryCode || this.ruleDetail.countryCode);
      const provider = new PreferenceItem();
      provider.code = d.providers;
      provider.name = d.providers;
      request.providers = [provider];
      const airportPrefer = new PreferenceItem();
      airportPrefer.code = d.airport;
      const selectAirport = this.airports.find(a => a.airportCode === d.airport);
      airportPrefer.name = selectAirport.airportName;
      request.airportPrefer = [airportPrefer];

      const hotelPreferenceIncludes = []
      if(d.hotelPreferenceIncludes){
        d.hotelPreferenceIncludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.hotelCode;
          prefer.name = e.hotelName;
          hotelPreferenceIncludes.push(prefer);
        });
      }
      request.hotelPreferenceIncludes = hotelPreferenceIncludes;
      const hotelPreferenceExcludes = []
      if(d.hotelPreferenceExcludes){
        d.hotelPreferenceExcludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.hotelCode;
          prefer.name = e.hotelName;
          hotelPreferenceExcludes.push(prefer);
        });
      }
      request.hotelPreferenceExcludes = hotelPreferenceExcludes;
      request.starPreferences = [];
      this.hotelRuleConfigureService.editHotelRule(request,this.ruleId, this.user.id).subscribe(
        res => {
          this.alertify.success(`Edit Hotel rule succeeful!`);
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
