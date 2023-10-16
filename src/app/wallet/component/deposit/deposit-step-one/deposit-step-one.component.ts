import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

import { appConstant } from 'src/app/app.constant';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { DepositStep1 } from 'src/app/model/wallet/deposit/deposit-step-1';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { depositConstant } from '../../../deposit-money/deposit.constant';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';

@Component({
  selector: 'app-deposit-step-one',
  templateUrl: './deposit-step-one.component.html',
  styleUrls: ['./deposit-step-one.component.css']
})
export class DepositStepOneComponent implements OnInit {
  isCollapsed: boolean;
  depositForm: FormGroup;
  formSubmitError: boolean;

  accountProfile: UserInfoRes;

  searchFlyFrom = '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];
  countryCode: string;
  currencyCode: string;
  countryName: string;
  currencyName: string;

  currencies: CurrencyNewRes[];
  constructor(private fb: FormBuilder,
    private route: Router,
    private searchCountry: SearchCountryService,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isCollapsed = false;
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.autoCompleteCountry();
    this.store.select('wallet').subscribe(data => {
      this.accountProfile = data.merchantProfileRes;
      if (this.accountProfile) {
        this.updateFormData();
      }
    });
  }

  private initForm() {
    this.depositForm = this.fb.group({
      country: ['', Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  updateFormData() {
    this.depositForm.patchValue({
      country: this.accountProfile.user.countryName || this.accountProfile.user.country
    });
    this.searchFlyFrom = this.accountProfile.user.countryName || this.accountProfile.user.country;
  }

  autoCompleteCountry() {
    // this.sugFlyFrom$ = this.searchAutoComplement(1);
    this.sugFlyFrom$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchFlyFrom);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchCountry.searchCountry(this.searchFlyFrom).pipe(
            map((data: CountryRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  selectResidenceCountry(selectedCountry: CountryRes) {
    this.countryCode = selectedCountry.code;
    this.countryName = selectedCountry.name;
  }
  depositNext() {
    if (this.depositForm.valid) {
      const d = this.depositForm.value;
      const depositStep1 = new DepositStep1();
      depositStep1.countryCode = this.countryCode || this.accountProfile.user.country;
      depositStep1.countryName = this.countryName || this.accountProfile.user.countryName;
      const currency: CurrencyNewRes = this.currencies.find(item => item.code === d.currency);
      depositStep1.currencyCode = currency.code;
      depositStep1.currencyName = currency.name;
      depositStep1.amount = +d.amount;

      sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStep1));
      this.route.navigate(['../step2'], { relativeTo: this.activeRoute });
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
