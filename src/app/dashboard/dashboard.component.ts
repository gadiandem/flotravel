import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { faHotel, faPlane, faTicketAlt, faShieldAlt, faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DashboardService } from '../service/dashboard/dashboard.service';
import { CurrencyNewRes } from '../model/dashboard/currency/currency-new-res.model';
import { appConstant } from '../app.constant';
import { TranslateService } from '@ngx-translate/core';
import { flightConstant, flightProvider, flightProviderName } from '../flight/flight.constant';
import { CountryRes } from '../model/common/country/country-res';
import { FLightSearchProvidersEnable } from '../model/common/flight-search-enable/flight-search-enable';
import { FLightProviderSettingRequest } from '../model/common/flight-search-enable/flight-setting-enable-request';
import { FlightSearchProviderService } from '../service/setting/flight-search-provider.service';
import { FLightProviderEnable } from 'src/app/model/common/flight-search-enable/flight-enable-item';
import { AlertifyService } from '../service/alertify.service';
import { UserDetail } from '../model/auth/user/user-detail';
import { DatePipe } from '@angular/common';
import { GeoIP } from '../model/common/GeoIP';
import { listCityForPackage, listCountryForPackage } from './dashboard.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faHotel = faHotel;
  faFlight = faPlane;
  faExtras = faTicketAlt;
  faInsurance = faShieldAlt;
  faTracemeCard = faCreditCard;

  currentOrientation = 'horizontal';
  active = 1;
  currency: string;
  fetching = true;
  listCountryReq: string[] = [];
  listCityReq: string[] = [];
  cityReq: string;
  isShowAlert: boolean;
  dismissible: boolean;
  currentLocation: GeoIP;
  user: UserDetail;
  requestSetting: FLightProviderSettingRequest;

  tokenTimer: any;

  constructor(
    private dashboardService: DashboardService,
    private store: Store<fromApp.AppState>,
    public datePipe: DatePipe,
    protected router: Router,
    public translate: TranslateService,
    private alertify: AlertifyService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.isShowAlert = true;
    this.dismissible = true;
    this.currency = 'USD';
    this.listCountryReq = listCountryForPackage;
    this.listCityReq = listCityForPackage;
    //sessionStorage.clear();
    this.fetchCurrencies();
    this.fetchCountries();
    this.getCurrentLocation();
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user;
      });
    if (this.user) {
      sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(this.user));
    }
    if (this.user.flightProvider && this.user.flightProvider.length > 0) {
      const suppliers: number[] = [];
      this.user.flightProvider.forEach(res => {
        suppliers.push(res.id);
      });
      localStorage.setItem(flightConstant.PROVIDER, JSON.stringify(suppliers));
    } else {
      // this.fetchFlightSearchEnable();
    }

  }

  fetchFlightSearchEnable() {
    this.dashboardService.fetchFLightSearchProvidersEnable().subscribe(
      (r: FLightSearchProvidersEnable[]) => {
        const enableProvider = r.filter(item => item.searchEnable === true);
        if (r.length === enableProvider.length) {
          localStorage.setItem(flightConstant.PROVIDER, flightProvider.ANY.toString());
        } else {
          if (enableProvider[0].name === flightProviderName[flightProviderName.HahnAir]) {
            localStorage.setItem(flightConstant.PROVIDER, flightProvider.HAHN_AIR.toString());
          } else if (enableProvider[0].name === flightProviderName[flightProviderName.ET]) {
            localStorage.setItem(flightConstant.PROVIDER, flightProvider.ET.toString());
          } else if (enableProvider[0].name === flightProviderName[flightProviderName.QR]) {
            localStorage.setItem(flightConstant.PROVIDER, flightProvider.QR.toString());
          } else {
            localStorage.setItem(flightConstant.PROVIDER, flightProvider.FLO_AIR.toString());
          }
        }
      }, e => {
        console.log(e);
      }
    );
  }
  getCurrentLocation() {
    this.dashboardService.getLocationCurrent().subscribe((data) => {
      this.currentLocation = data;
      localStorage.setItem(appConstant.CURRENT_LOCATION, JSON.stringify(this.currentLocation));
      console.log(this.currentLocation);
    }, e => {
      localStorage.setItem(appConstant.CURRENT_LOCATION, null);
      console.log(e);
    });
  }
  fetchCountries() {
    this.dashboardService.fetchCountries().subscribe(
      (r: CountryRes) => {
        localStorage.setItem(appConstant.COUNTRY, JSON.stringify(r));
      }, e => {
        console.log(e);
      }
    );
  }

  fetchCurrencies() {
    this.dashboardService.fetchCurrencies().subscribe(
      (r: CurrencyNewRes) => {
        localStorage.setItem(appConstant.CURRENCY, JSON.stringify(r));
      }, e => {
        console.log(e);
      }
    );
  }
}
