import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, switchMap, map, debounceTime } from "rxjs/operators";
import { Observable, of, Observer } from "rxjs";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appConstant } from "src/app/app.constant";
import { SearchInsurancePackageReq } from '../../model/insurance/search-insurance-package.req';
import * as InsuranceActions from '../../insurance/store/insurance.actions';
import * as fromApp from '../../store/app.reducer';
import { insuranceConstant } from '../../insurance/insurance.constant';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
@Component({
  selector: 'app-search-form-insurance',
  templateUrl: './search-form-insurance.component.html',
  styleUrls: ['./search-form-insurance.component.css']
})
export class SearchFormInsuranceComponent implements OnInit {

  sugFlyFrom$: Observable<CountryRes[]>;
  sugFlyTo$: Observable<CountryRes[]>;
  searchFlyFrom: string[] = [];
  searchFlyTo: string[] = [];
  errorMessage: string[] = [];

  formSubmitError: boolean;
  countries: CountryRes[];
  countryCode: string;
  checkin_date: Date;
  checkout_date: Date;
  searchForm: FormGroup;
  searchData: SearchInsurancePackageReq;
  searching = false;
  searchFailed = false;
  constructor(protected router: Router, public datepipe: DatePipe,
    public searchCountry: SearchCountryService,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {
    sessionStorage.clear();
    this.formSubmitError = false;
    this.checkin_date = new Date();
    this.checkout_date = this.addDays(new Date(), 1);
    this.initForm();
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.residenceCountry();
    this.countryOfTravel();
    this.searchData = JSON.parse(sessionStorage.getItem(insuranceConstant.SEARCH_PACKAGE_FORM));
    if(this.searchData){
      this.updateSearchForm();
    } else {
      this.searchData = new SearchInsurancePackageReq();
    }
  }
  updateSearchForm() {
    this.searchForm.patchValue({
      residenceCountry: this.searchData.residenceCountry,
      countryOfTravel: this.searchData.countryOfTravel,
      checkin_date: this.searchData.startDate,
      checkout_date: this.searchData.endDate,
      adults: this.searchData.travellers.adt,
      children: this.searchData.travellers.chd,
      infants: this.searchData.travellers.inf
    });
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  private initForm() {
    this.searchForm = new FormGroup({
      residenceCountry: new FormControl('', Validators.required),
      countryOfTravel: new FormControl('', Validators.required),
      checkin_date: new FormControl(this.checkin_date, Validators.required),
      checkout_date: new FormControl(this.checkout_date, Validators.required),
      adults: new FormControl( 1 , Validators.required),
      children: new FormControl( 0 , Validators.required),
      infants: new FormControl( 0 , Validators.required)
    });

  }

  residenceCountry() {
    // this.sugFlyFrom$ = this.searchAutoComplement(1);
    this.sugFlyFrom$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchFlyFrom[0]);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchCountry.searchCountry(this.searchFlyFrom[0]).pipe(
            map((data: CountryRes[]) => {
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

  countryOfTravel() {
    // this.sugFlyFrom$ = this.searchAutoComplement(1);
    this.sugFlyTo$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchFlyTo[0]);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchCountry.searchCountry(this.searchFlyTo[0]).pipe(
            map((data: CountryRes[]) => {
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

  selectCountryOfTravel(country: any) {
    this.searchData.countryOfTravel = country.code;
  }
  selectResidenceCountry(country: any) {
    this.searchData.residenceCountry = country.code;
  }

  searchInsurance() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
    //  this.searchData.residenceCountry = d.residenceCountry;
     // this.searchData.countryOfTravel = d.countryOfTravel;
      this.searchData.startDate = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
      this.searchData.endDate = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
     // travellers property
     let travellers = new Travellers();
       travellers.adt = +d.adults;
       travellers.chd = +d.children;
       travellers.inf = +d.infants;
       travellers.ins = 0;
       travellers.unn = 0;
       this.searchData.travellers = travellers;
      sessionStorage.setItem(insuranceConstant.SEARCH_PACKAGE_FORM, JSON.stringify(this.searchData));
      this.store.dispatch(new InsuranceActions.SearchInsurancePackageListStart(
        { data: this.searchData }));

      this.router.navigate(['/insurance']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
