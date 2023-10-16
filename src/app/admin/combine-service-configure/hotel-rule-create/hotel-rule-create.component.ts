import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Observer, of, Subscription } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import {Location} from '@angular/common';

import { appConstant } from "src/app/app.constant";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { HotelItem } from "src/app/model/combine-service/hotel-item";
import { CountryRes } from "src/app/model/common/country/country-res";
import { DestinationRes } from "src/app/model/dashboard/desRes.model";
import { HotelRuleConfigureService } from "src/app/service/admin/combine-service/hotel-rule-configure.service";
import { AlertifyService } from "src/app/service/alertify.service";
import { DashboardService } from "src/app/service/dashboard/dashboard.service";
import * as fromApp from 'src/app/store/app.reducer';
import { HotelRuleConfigureCreate } from "src/app/model/combine-service/hotel-configure-rule-create";
import { PreferenceItem } from "src/app/model/combine-service/preference-item";
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
  selector: "app-hotel-rule-create",
  templateUrl: "./hotel-rule-create.component.html",
  styleUrls: ["./hotel-rule-create.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelRuleCreateComponent implements OnInit {
  subscription: Subscription;
  formSubmitError: boolean;
  agentForm: FormGroup;
  hotels: HotelItem[];
  starList: ModelAutoComplete[] = starList;
  airports: any[];
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
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.starList = JSON.parse(JSON.stringify(starList));
    this.initForm();
    this.searchDestination();
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (!this.user) {
          this.router.navigate(['/']);
        }
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
    this.subscription = this.hotelRuleConfigureService.getAirportByCountryCode(this.selectedDestination.id).subscribe(
      (res: any[]) => {
        this.airports = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  fetchHotelList() {
    this.subscription = this.hotelRuleConfigureService.getHotelInCityList(this.selectedDestination.id).subscribe(
      (res: HotelItem[]) => {
        this.hotels = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  getCountryCode(country: any) {
    this.countryCode = country.code;
   // console.log('country: ' + this.countryCode);
  }

  hotelListAutoComplete = (text: string): Observable<HotelItem[]> => {
    return of([...this.hotels]);
  }
  starListAutoComplete = (text: string): Observable<ModelAutoComplete[]> => {
    return of([...this.starList]);
  }
  createRule(){
    if(this.agentForm.valid){
      const d: any = this.agentForm.value;
      const request = new HotelRuleConfigureCreate();
      request.cityCode = this.selectedDestination.id;
      request.cityName = this.selectedDestination.displayName;
      request.countryCode = this.selectedDestination.countryName;
      request.countryName = this.selectedDestination.countryCode;
      request.code = this.selectedDestination.id + '_' + this.selectedDestination.countryCode;
      const provider = new PreferenceItem();
      provider.code = d.providers;
      provider.name = d.providers;
      request.providers = [provider];
      const airportPrefer = new PreferenceItem();
      airportPrefer.code = d.airport;
      airportPrefer.name = d.airport;
      request.airportPrefer = [airportPrefer];

      const hotelPreferenceIncludes = [];
      if(d.hotelPreferenceIncludes){
        d.hotelPreferenceIncludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.hotelCode;
          prefer.name = e.hotelName;
          hotelPreferenceIncludes.push(prefer);
        });
      }
      request.hotelPreferenceIncludes = hotelPreferenceIncludes;
      const hotelPreferenceExcludes = [];
      if(d.hotelPreferenceExcludes){
        d.hotelPreferenceExcludes.forEach(e => {
          const prefer = new PreferenceItem();
          prefer.code = e.hotelCode;
          prefer.name = e.hotelName;
          hotelPreferenceExcludes.push(prefer);
        });
      }
      request.hotelPreferenceExcludes = hotelPreferenceExcludes;
      request.starPreferences = [null];
      this.hotelRuleConfigureService.createHotelRule(request, this.user.id).subscribe(
        res => {
          this.alertify.success(`Create Hotel rule succeeful!`);
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
