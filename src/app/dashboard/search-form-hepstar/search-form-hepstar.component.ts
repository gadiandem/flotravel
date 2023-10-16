import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, switchMap, map, debounceTime } from "rxjs/operators";
import { Observable, of, Observer } from "rxjs";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';


import * as HepstarActions from '../../hepstar/store/hepstar.actions';
import * as fromApp from '../../store/app.reducer';
import { insuranceConstant } from '../../insurance/insurance.constant';
import { AirportRes } from 'src/app/model/flight/airport/airportRes';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { hepstarConstant } from 'src/app/hepstar/hepstar.constant';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';

@Component({
  selector: 'app-search-form-hepstar',
  templateUrl: './search-form-hepstar.component.html',
  styleUrls: ['./search-form-hepstar.component.css']
})
export class SearchFormHepstarComponent implements OnInit {

  sugFlyFrom$: Observable<CountryRes[]>;
  // sugFlyTo$: Observable<CountryRes[]>;
  searchFlyFrom: string[] = [];
  // searchFlyTo: string[] = [];
  errorMessage: string[] = [];

  formSubmitError: boolean;

  checkin_date: Date;
  checkout_date: Date;
  searchForm: FormGroup;
  searchData: HepstarSearchFormData;
  searching = false;
  searchFailed = false;
  constructor(protected router: Router, public datepipe: DatePipe,
    public searchCountry: SearchCountryService,
    public store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.checkin_date = new Date();
    this.checkout_date = this.addDays(new Date(), 1);
    this.initForm();
    this.residenceCountry();
    this.searchData = new HepstarSearchFormData();
    // this.countryOfTravel();
    // this.searchData = JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM));
    // if(this.searchData){
    //   this.updateSearchForm();
    // } else {
    //   this.searchData = new HepstarSearchFormData();
    // }
  }
  updateSearchForm() {
    this.searchForm.patchValue({
      residenceCountry: this.searchData.residenceCountry,
      // countryOfTravel: this.searchData.countryOfTravel,
      checkin_date: this.searchData.startDate,
      checkout_date: this.searchData.endDate,
      adults: this.searchData.adults,
      children: this.searchData.children,
      infants: this.searchData.infants
    });
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  private initForm() {
    this.searchForm = new FormGroup({
      residenceCountry: new FormControl('', Validators.required),
      // countryOfTravel: new FormControl('', Validators.required),
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

  // countryOfTravel() {
  //   // this.sugFlyFrom$ = this.searchAutoComplement(1);
  //   this.sugFlyTo$ = new Observable((observer: Observer<string>) => {
  //     observer.next(this.searchFlyTo[0]);
  //   }).pipe(
  //     debounceTime(300),
  //     switchMap((query: string) => {
  //       if (query) {
  //         // using github public api to get users by name
  //         return this.searchCountry.searchCountry(this.searchFlyTo[0]).pipe(
  //           map((data: CountryRes[]) => {
  //             this.searchFailed = false;
  //             return data || [];
  //           }), tap(
  //             () => (this.searching = false),
  //             (err) => {
  //               // in case of http error
  //               this.searchFailed = true;
  //               this.errorMessage =
  //                 (err && err.message) || "Something goes wrong";
  //             }
  //           )
  //         );
  //       }
  //       return of([]);
  //     })
  //   );
  // }

  selectResidenceCountry(flyFrom: CountryRes) {
    // this.searchData.residenceCountry = flyFrom.name;
    this.searchData.residenceCountry = flyFrom.code;
  }
  // selectCountryOfTravel(destination: CountryRes) {
  //   this.searchData.countryOfTravel = destination.name;
  // }
  searchInsurance() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      // this.searchData.residenceCountry = d.residenceCountry;
      // this.searchData.countryOfTravel = d.countryOfTravel;
      this.searchData.startDate = this.datepipe.transform(this.checkin_date, 'yyyy-MM-dd');
      this.searchData.endDate = this.datepipe.transform(this.checkout_date, 'yyyy-MM-dd');
      this.searchData.adults = +d.adults;
      this.searchData.children = +d.children;
      this.searchData.infants = +d.infants;
      sessionStorage.setItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM, JSON.stringify(this.searchData));
      this.store.dispatch(new HepstarActions.SearchHepstarStart(
        { data: this.searchData }));
      this.router.navigate(['/hepstar']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
