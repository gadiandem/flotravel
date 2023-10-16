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
  selector: 'app-hotel-rule-detail',
  templateUrl: './hotel-rule-detail.component.html',
  styleUrls: ['./hotel-rule-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelRuleDetailComponent implements OnInit {
  subscription: Subscription;
  formSubmitError: boolean;
  agentForm: FormGroup;
  hotels: HotelItem[];
  starList: ModelAutoComplete[] = starList;

  cityName: string;
  cityCode: string;
  suggestions$: Observable<DestinationRes[]>;
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
        this.cityCode = res.cityCode;
        this.updateFormData();
        this.searchDestination();
        this.fetchHotelList();
      }, e => {
        this.alertify.error(e);
      }
    )
  }
  updateFormData() {
    this.search = this.ruleDetail.cityName;
    this.agentForm.patchValue({
      cityName: this.ruleDetail.cityName,
      providers: this.ruleDetail.providers[0].name
      // hotelPreferenceIncludes: this.ruleDetail.hotelPreferenceIncludes,
      // hotelPreferenceExcludes: this.ruleDetail.hotelPreferenceExcludes,
    });
  }
  private initForm() {
    this.agentForm = this.fb.group({
      cityName: ["", Validators.required],
      // countryName: ["", Validators.required],
      providers: ["Nuitee", Validators.required],
      hotelPreferenceIncludes: [""],
      hotelPreferenceExcludes: [""],
      // starPreferences: ["", Validators.required],
    });
  }
  fetchHotelList() {
    this.subscription = this.hotelRuleConfigureService.getHotelInCityList(this.cityCode).subscribe(
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
  select(des: any) {
    this.cityName = des.displayName;
    this.cityCode = des.id;
    this.fetchHotelList()
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
  editRule(){
    if(this.agentForm.valid){
      const d: any = this.agentForm.value;
      const request = new HotelRuleConfigureCreate();
      request.cityCode = this.cityCode;
      request.cityName = this.cityName|| this.ruleDetail.cityName;
      request.countryCode = this.ruleDetail.countryName;
      request.countryName = this.ruleDetail.countryCode;
      request.code = this.cityCode + '_' + (this.cityName|| this.ruleDetail.cityName);
      const provider = new PreferenceItem();
      provider.code = d.providers;
      provider.name = d.providers;
      request.providers = [provider];

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
