import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Airline} from '../../../../../model/flight/airline/airline';
import { UserDetail } from '../../../../../model/auth/user/user-detail';
import { FlotravelProvider} from '../../../../../model/auth/provider/flotravel-provider';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertifyService } from '../../../../../service/alertify.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';
import { FlotravelProviderService } from '../../../../../service/admin/provider/flotravel-provider.service';
import { appConstant } from '../../../../../app.constant';
import { SellingCurrencyService } from '../../../../../service/admin/agency/selling-currency/selling-currency.service';
import { AgencySellingCurrencyRequest } from '../../../../../model/auth/agency/selling-currency/agency-selling-currency-request';
import { Agent } from '../../../../../model/auth/agency/agency';
import { adminConstant } from '../../../../userGroup-constant';
import { SellingCurrency } from '../../../../../model/auth/agency/selling-currency/selling-currency';
import { CountryRes } from '../../../../../model/common/country/country-res';
import { CurrencyNewRes } from '../../../../../model/dashboard/currency/currency-new-res.model';

@Component({
  selector: 'app-agent-selling-currency-create',
  templateUrl: './agent-selling-currency-create.component.html',
  styleUrls: ['./agent-selling-currency-create.component.css']
})
export class AgentSellingCurrencyCreateComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  sellingCurrencyForm: FormGroup;

  formSubmitError: boolean;
  airlines: Airline[];
  user: UserDetail;
  agentDetail: Agent;
  searching: boolean;
  searchFailed: boolean;
  errorMessage: string[] = [];
  providers: FlotravelProvider[];
  sourceProviders: FlotravelProvider[];
  countries: CountryRes[];
  countryCode: string;
  country = '';
  currencies: CurrencyNewRes[];
  currencyCode: string;
  currency = '';
  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private _location: Location,
              private alertify: AlertifyService,
              private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private providerService: FlotravelProviderService,
              private sellingCurrencyService: SellingCurrencyService) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.searching = false;
    this.agentDetail = JSON.parse(sessionStorage.getItem(adminConstant.AGENTDETAIL));
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY))
      .sort((a, b) => b.code < a.code ? 1 : -1);
    this.searchFailed = false;
    this.initForm();
    // this.providers = [];
    this.sourceProviders = [];
    this.store.select('auth').subscribe(data => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (!this.user) {
        this.router.navigate(['/']);
      }
      // this.fetchProviders();
    });
  }

  // fetchProviders() {
  //   this.subscription = this.providerService.getProviders(this.user.id).subscribe(
  //     (res: FlotravelProvider[]) => {
  //       // this.providers = res;
  //       this.sourceProviders = res;
  //     }
  //   );
  // }

  onSelectCountry(value: any) {
    if (value) {
      const countrySelected = this.countries.filter(item => item.code === value);
      this.countryCode = countrySelected[0].code;
      this.country = countrySelected[0].name;
    }
  }

  onSelectCurrency(value: any) {
    if (value) {
      const currencySelected = this.currencies.filter(item => item.code === value);
      this.currencyCode = currencySelected[0].code;
      this.currency = currencySelected[0].name;
    }
  }

  private initForm() {
    this.sellingCurrencyForm = this.fb.group({
      type: ['', Validators.required],
      // provider: ['', Validators.required],
      country: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  createAgencySellingCurrency() {
    console.log(this.sellingCurrencyForm.value);
    if (this.sellingCurrencyForm.valid) {
      const d: any = this.sellingCurrencyForm.value;
      const request = new AgencySellingCurrencyRequest();
      request.email = this.agentDetail.owner;
      const sellingCurrency: SellingCurrency = new SellingCurrency();
      sellingCurrency.serviceType = d.type;
      sellingCurrency.countryCode = this.countryCode;
      sellingCurrency.currency = this.currencyCode;
      // sellingCurrency.provider = d.provider;
      request.sellingCurrency = sellingCurrency;
      console.log(request);
      this.sellingCurrencyService.createSellingCurrency(this.user.id, request).subscribe(
        res => {
          this.alertify.success(`Create selling currency successful!`);
          this._location.back();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  // onChangeProvider(type: string) {
  //   if (type) {
  //     this.providers = this.sourceProviders.filter(item => item.type === type);
  //   }
  // }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
