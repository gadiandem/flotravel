import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import {Flight} from 'src/app/model/flight/flight-list/flight';
import {OfferItem} from 'src/app/model/flight/flight-list/offerItem';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import * as HepstarActions from '../../hepstar/store/hepstar.actions';
import * as TracemeActions from '../../traceme/store/traceme.actions';
import * as InsuranceActions from '../../insurance/store/insurance.actions';
import * as GcaActions from '../../gca/store/gca.actions';

import * as fromApp from '../../store/app.reducer';
import {OfferPriceReq} from 'src/app/model/flight/offer-price/request/offer-price-req';
import {OfferPriceRes} from 'src/app/model/flight/offer-price/offer-price-res';
import {SearchFlightForm} from 'src/app/model/flight/search-flight-form';
import {
  demoFlightData, economyData,
  flightConstant,
  flightProvider,
  flightSelectedProvider,
  flightTypeIndex,
  flightTypeValue, moreOptionData, typeFlightData,
} from '../flight.constant';
import {SelectedFlight} from 'src/app/model/flight/selected-flight';
import {AeroService} from 'src/app/service/aero/aero.service';
import {OriginalDestination} from 'src/app/model/flight/flight-list/request/OriginalDestination';
import {Departure} from 'src/app/model/flight/create-order/departure';
import {Arrival} from 'src/app/model/flight/create-order/arrival';
import {DatePipe} from '@angular/common';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {Observable, Observer, of, Subscription} from 'rxjs';
import {AirportRes} from '../../model/flight/airport/airportRes';
import {SearchFlightService} from '../../service/flight/search-flight.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {Select2OptionData} from 'ng-select2';
import {Options} from 'select2';
import {HepstarSearchFormData} from 'src/app/model/hepstar/search-from-data';
import {TraceMeShoppingReq} from 'src/app/model/traceme/shopping/traceme-shopping-req';
import {journeyType} from 'src/app/traceme/traceme.constant';
import {SearchInsurancePackageReq} from 'src/app/model/insurance/search-insurance-package.req';
import {SearchGcaForm} from 'src/app/model/gca/shopping/request/search-gca-form';
import {GcaModel} from 'src/app/model/gca/shopping/request/gca-model';
import {AirportCode} from 'src/app/model/gca/shopping/request/airport-code';
import {SearchQouteRequest} from 'src/app/model/insurance/search-quote.request';
import {insuranceConstant} from 'src/app/insurance/insurance.constant';
import {gcaConstant} from 'src/app/gca/gca.constant';
import {Travellers} from 'src/app/model/flight/flight-list/request/travellers';
import {FlightServiceReq} from 'src/app/model/flight/services/service-request';
import {appConstant, appDefaultData} from '../../app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { MetaData } from 'src/app/model/dashboard/hotel/metadata';

@Component({
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrls: ['./flight-summary.component.css'],
})
export class FlightSummaryComponent implements OnInit, OnDestroy {
  typeFlight: string;
  departureFlight: SelectedFlight;

  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchdata = true;
  returnFlight: SelectedFlight;

  nextFlights: SelectedFlight[];
  totalTripPrice: number;

  offerPrices: OfferPriceRes;
  offerPricesReq: OfferPriceReq;
  searchFlightForm: SearchFlightForm;
  totalPassegers: number;
  currency: string;
  loadMoreFlight: boolean;
  aeroProvider: boolean;
  qrProvider: boolean;

  searchForm: FormGroup;
  showDropDown: boolean;
  showDropDownMobile: boolean;
  bsConfig: Partial<BsDatepickerConfig>;
  minDate = new Date();

  searching = false;
  searchFailed = false;
  typeFlightNew: string;
  typeFlightIndex: number;
  typeFlightIndexStr: string;
  economyData: Array<Select2OptionData> = economyData;
  moreOptionData: Array<Select2OptionData> = moreOptionData;
  typeFlightData: Array<Select2OptionData> = typeFlightData;
  hourDuration: number;
  minuteDuration: number;
  showFormSearchResponsive = false;
  filterOpen = false;
  numberOfFlight = 1;
  numberOfReturnFlight = 1;
  currentUrl: string;
  sub: Subscription;
  isCollapsed: boolean;
  baggageRules = '';
  serviceReq: FlightServiceReq;
  executionId: string;
  selectedProvider: number;

  user: UserDetail;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private aeroService: AeroService,
    private datePipe: DatePipe,
    private searchAirport: SearchFlightService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {

    this.searching = false;
    this.isCollapsed = true;
    this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.qrProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.QR;
    this.executionId = sessionStorage.getItem(flightConstant.EXECUTION_ID) || demoFlightData.EXECUTION_ID;
    this.selectedProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
    this.user = JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
    console.log(sessionStorage.getItem(flightConstant.CUSTOMERS_INFO));
  
    window.scroll(0, 0);
    this.totalTripPrice = 0;
    this.loadMoreFlight = true;
    this.showDropDown = false;
    this.showDropDownMobile = false;
    this.bsConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: this.minDate,
        showWeekNumbers: false,
        orientation: 'bottom left',
      }
    );
    this.sub = this.store.select('flightList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.offerPrices = data.offerPrices;
      if (this.offerPrices) {
        this.currency = this.offerPrices.currency || appDefaultData.DEFAULT_CURRENCY;
      }
      this.offerPricesReq = data.offerPricesReq || JSON.parse(sessionStorage.getItem(flightConstant.OFFER_PRICE));
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      if (this.searchFlightForm && this.searchFlightForm.typeFlight) {
        this.typeFlight = this.searchFlightForm.typeFlight;
      } else {
        this.route.navigate(['/dashboard/flight']);
      }
      if (this.offerPrices) {     
        if (this.offerPrices.pricedOffer.totalPrice) {
          this.totalTripPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value;
        } else {
          this.totalTripPrice = this.offerPrices.pricedOffer.offerItem[0].totalPriceDetail.totalAmount.simpleCurrencyPrice.value;
        }
        if (this.offerPrices.baggageInfo) {
          this.baggageRules += this.offerPrices.baggageInfo.join().replace(',', ' ');
        }
      }

      this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
      this.returnFlight = data.returnFlight || JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
      if (this.returnFlight) {
        if (+sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.FLO_AIR) {
          this.totalTripPrice += this.returnFlight.offerItem.totalAmount;
        }
      }
      if (!this.offerPrices && !this.fetching) {
        if (this.tryFetchdata) {
          const offerData = JSON.parse(
            sessionStorage.getItem(flightConstant.OFFER_PRICE)
          );
          this.store.dispatch(
            new FlightListActions.OfferPriceFlightStart(offerData)
          );
          this.tryFetchdata = false;
        }
      }
      this.getNumberOfFlight();
      if (this.departureFlight != null) {
        this.currency = this.departureFlight.offerItem.currency;
      }
      if (this.offerPrices) {
        this.getAddonOption(this.searchFlightForm);
      }
      if (this.loadMoreFlight) {
        this.loadMoreSelectedFlight(data);
        this.loadMoreFlight = false;
      }
    });
  }

  getServices() {
    const services: FlightServiceReq = new FlightServiceReq();
    services.offerID = this.offerPrices.pricedOffer.offerID;
    services.ownerCode = this.offerPrices.pricedOffer.owner;
    services.offerItemID = this.offerPrices.pricedOffer.offerItem[0].offerItemID;
    services.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
    this.store.dispatch(new FlightListActions.SearchFlightServicesStart(services));
    this.route.navigate(['../flight-services'], {relativeTo: this.activatedRoute});

  }

  getAddonOption(searchFlightForm: SearchFlightForm) {
    this.getTracemeList(searchFlightForm);
    this.getRefundProtection(searchFlightForm, this.totalTripPrice);
    this.getSmartDelay(searchFlightForm, this.totalTripPrice);
    this.getGcaList(searchFlightForm);
    this.getInsuranceList(searchFlightForm, this.totalTripPrice);
  }

  getInsuranceList(searchFlightForm: SearchFlightForm, totalTripPrice: number) {
    const expirationDate = sessionStorage.getItem(insuranceConstant.AXA_TOKEN_EXPIRE_TIME);
    this.store.dispatch(new InsuranceActions.AuthAxaStart({data: expirationDate}));
    const axaRequest = new SearchInsurancePackageReq();
    axaRequest.residenceCountry = searchFlightForm.flyFrom.country.code;
    axaRequest.countryOfTravel = searchFlightForm.destination.country.code;
    axaRequest.startDate = searchFlightForm.departuring;
    const startDate = new Date(searchFlightForm.departuring);
    axaRequest.endDate = searchFlightForm.returning;
    const travellersInsure = new Travellers();
    travellersInsure.adt = searchFlightForm.adults;
    travellersInsure.chd = searchFlightForm.children;
    travellersInsure.inf = 0;
    axaRequest.travellers = travellersInsure;
    const searchQuoteForm: SearchQouteRequest = new SearchQouteRequest(axaRequest);
    this.currentUrl = this.route.url;
    searchQuoteForm.price = +totalTripPrice.toFixed(2);
    searchQuoteForm.currency = this.currency;
    searchQuoteForm.executionId = this.executionId;
    searchQuoteForm.provider = this.selectedProvider;
    sessionStorage.setItem(insuranceConstant.QUOTE_SEARCH_FORM, JSON.stringify(searchQuoteForm));

    this.store.dispatch(new InsuranceActions.QouteListStart({data: searchQuoteForm}));
    // this.store.dispatch(new InsuranceActions.AuthAxaStart({data: expirationDate}));
    // let getQoute = true;
    // this.store.select('insuranceList').subscribe(
    //   (data) => {
    // console.log('axa auth check ' +  getQoute);
    // if (data.axaAuth && getQoute) {
    //   getQoute = false;
    //   console.log('get quote list');
    //   this.store.dispatch(new InsuranceActions.QouteListStart({data: searchQuoteForm}));
    // }
    // }
    // );
  }

  getGcaList(searchFlightForm: SearchFlightForm) {
    const gcaReq = new SearchGcaForm();
    gcaReq.executionId = this.executionId;
    gcaReq.provider = this.selectedProvider;
    const flights = [];
    const gcaModel = new GcaModel();
    const arrival = new AirportCode(searchFlightForm.destination.code);
    gcaModel.arrival_airport = arrival;
    const depature = new AirportCode(searchFlightForm.flyFrom.code);
    gcaModel.departure_airport = depature;
    gcaModel.departure_date = searchFlightForm.departuring;
    gcaModel.flight_no = 'BA123';
    flights.push(gcaModel);
    gcaReq.flights = flights;
    sessionStorage.setItem(gcaConstant.SEARCH_GCA, JSON.stringify(gcaReq));
    this.store.dispatch(new GcaActions.SearchGcaStart({data: gcaReq}));
  }

  getTracemeList(searchFlightForm: SearchFlightForm) {
    const tracemereq = new TraceMeShoppingReq();
    tracemereq.provider = this.selectedProvider;
    tracemereq.executionId = this.executionId;
    tracemereq.startDate = searchFlightForm.departuring;
    const startDate = new Date(searchFlightForm.departuring);
    tracemereq.endDate = searchFlightForm.returning || this.datePipe.transform(startDate.setDate(startDate.getDate() + 1), 'yyyy-MM-dd');
    tracemereq.journey = this.getJourney(searchFlightForm.typeFlight);
    tracemereq.luggageCount = 1;
    this.store.dispatch(new TracemeActions.SearchTracemeStart({data: tracemereq}));
  }

  getJourney(typeFlight: string): string {
    if (typeFlight === flightTypeValue.ONE_WAY) {
      return journeyType.ONE_WAY;
    } else if (typeFlight === flightTypeValue.ROUND_TRIP) {
      return journeyType.ROUND_TRIP;
    } else {
      return journeyType.MULTI_CITY;
    }
  }

  getRefundProtection(search: SearchFlightForm, totalTripPrice: number) {
    const searchData: HepstarSearchFormData = new HepstarSearchFormData();
    searchData.executionId = this.executionId;
    searchData.provider = this.selectedProvider;
    searchData.residenceCountry = search.flyFrom.country.code;
    searchData.countryOfTravel = search.destination.country.code;
    searchData.startDate = search.departuring;
    searchData.endDate = search.returning;
    searchData.adults = search.adults;
    searchData.children = search.children;
    searchData.infants = search.infants;
    searchData.totalTripPrice = totalTripPrice;
    this.store.dispatch(new HepstarActions.SearchHepstarStart(
      {data: searchData}));
  }

  getSmartDelay(search: SearchFlightForm, totalTripPrice: number) {
    const searchData: HepstarSearchFormData = new HepstarSearchFormData();
    searchData.executionId = this.executionId;
    searchData.provider = this.selectedProvider;
    searchData.residenceCountry = search.flyFrom.country.code;
    searchData.countryOfTravel = search.destination.country.code;
    searchData.startDate = search.departuring;
    searchData.endDate = search.returning;
    searchData.adults = search.adults;
    searchData.children = search.children;
    searchData.infants = search.infants;
    searchData.totalTripPrice = totalTripPrice;
    this.store.dispatch(new HepstarActions.SearchHepstarStart(
      {data: searchData}));
  }

  getNumberOfFlight() {
    if (this.departureFlight && this.departureFlight.flight && this.departureFlight.flight.flightSegments) {
      this.numberOfFlight = this.departureFlight.flight.flightSegments.length;
    }
    if (this.returnFlight && this.returnFlight.flight && this.returnFlight.flight.flightSegments) {
      this.numberOfReturnFlight = this.returnFlight.flight.flightSegments.length;
    }

  }

  showFormSearch() {
    const myTag1 = this.el.nativeElement.querySelector('form');
    const myTag2 = this.el.nativeElement.querySelector('#select-box-mobile');
    this.showFormSearchResponsive = true;
    if (this.showFormSearchResponsive) {
      myTag1.classList.remove('hotel-search');
      myTag2.classList.remove('hotel-search');
    }
  }

  closeFormSearch() {
    const myTag1 = this.el.nativeElement.querySelector('form');
    const myTag2 = this.el.nativeElement.querySelector('#select-box-mobile');
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag1.classList.add('hotel-search');
      myTag2.classList.add('hotel-search');
    }
  }

  valueChanged(id: string) {
    if (id === '1') {
      this.typeFlightNew = flightTypeValue.ONE_WAY;
    } else if (id === '2') {
      this.typeFlightNew = flightTypeValue.ROUND_TRIP;
    } else if (id === '3') {
      this.typeFlightNew = flightTypeValue.MULTI_CITY;
    }
  }

  loadMoreSelectedFlight(data: any) {
    switch (this.typeFlight) {
      case flightTypeValue.ROUND_TRIP:
        this.returnFlight = data.returnFlight;
        if (this.returnFlight == null) {
          this.returnFlight = JSON.parse(
            sessionStorage.getItem(flightConstant.RETURN_FLIGHT)
          );
          if (this.returnFlight == null) {
            this.route.navigate(['/']);
          }
        }
        break;
      case flightTypeValue.MULTI_CITY:
        this.nextFlights = [];
        this.nextFlights = data.nextFlights;
        if (this.nextFlights.length === 0) {
          this.nextFlights = JSON.parse(
            sessionStorage.getItem(flightConstant.NEXT_FLIGHT)
          );
          if (this.nextFlights == null) {
            this.route.navigate(['/']);
          }
        }
        break;
    }
  }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if (data.flightSegments.length > 1) {
      data.flightSegments.forEach(segment => {
        const hour = segment.duration.split('H')[0];
        const minute = segment.duration.split('M')[0].split('H')[1];
        this.hourDuration += +hour;
        this.minuteDuration += +minute;
        if (this.minuteDuration >= 60) {
          this.hourDuration += 1;
          this.minuteDuration -= 60;
        }
      });
      return this.hourDuration.toString() + 'H ' + this.minuteDuration.toString() + 'M';
    } else {
      return data.flightSegments[0].duration;
    }
  }

  getArrivalCode(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrAirportCode;
    } else {
      return data.flightSegments[0].arrAirportCode;
    }
  }

  getArrivalTime(data: Flight): string {
    if (data.flightSegments.length > 1) {
      return data.flightSegments[data.flightSegments.length - 1].arrDateTime;
    } else {
      return data.flightSegments[0].arrDateTime;
    }
  }


  goToPayment() {
    // sessionStorage.setItem('totalPrice', this.totalTripPrice.toString());
    if (this.aeroProvider) {
      const offerPrice = Object.assign({}, this.offerPricesReq);
      // choose provider
      const provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      if (provider === flightProvider.AERO_CRS) {
        const searchFlightForm: any = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
        offerPrice.originalDestinations = [];
        const original = new OriginalDestination();
        const departure = new Departure();
        departure.airportCode = searchFlightForm.flyFrom.code;
        original.departure = departure;
        const arrival = new Arrival();
        arrival.airportCode = searchFlightForm.destination.code;
        original.arrival = arrival;
        const metadata = new MetaData();
           metadata.country = searchFlightForm.flyFrom.code;
           metadata.currency = demoFlightData.CURRENCY;
           metadata.locale = '';
           metadata.user = this.user.email;
        offerPrice.metadata = metadata;
        offerPrice.originalDestinations.push(original);
        if (searchFlightForm.typeFlight === 'ROUND_TRIP') {
          const destination = new OriginalDestination();
          const departureRT = new Departure();
          departureRT.airportCode = searchFlightForm.destination.code;
          destination.departure = departureRT;
          const arrivalRT = new Arrival();
          arrivalRT.airportCode = searchFlightForm.flyFrom.code;
          destination.arrival = arrivalRT;
          offerPrice.originalDestinations.push(destination);
        }
      }
      this.aeroService.createBooking(offerPrice).subscribe(
        (res: any) => {
          sessionStorage.setItem(flightConstant.CREATE_BOOKING, JSON.stringify(res));
          // console.log('aero order: ' + JSON.stringify(res));

          // this.route.navigate(["../cart"], {
          //   relativeTo: this.activatedRoute,
          // });
        }, e => {
          console.log(e);
        }
      );
      this.route.navigate(['../cart'], {
        relativeTo: this.activatedRoute,
      });
      console.log('aero provider');
    } else {
      this.route.navigate(['../cart'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  searchFlight(searchData: SearchFlightForm) {
    this.store.dispatch(new FlightListActions.SearchFlightStart(searchData));
    this.route.navigate(['../flightList'], {relativeTo: this.activatedRoute});
  }

  showFormFilter() {
    if (this.filterOpen) {
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    } else {
      this.renderer.addClass(document.querySelector('#sortFilter'), 'we-sort-filter');
      this.renderer.removeClass(document.querySelector('#sortFilter'), 'we-sort-filter-display');
      this.filterOpen = !this.filterOpen;
    }
  }

  get flightsControls() {
    return (this.searchForm.get('anotherCities') as FormArray).controls;
  }

  flightTypeChange(type: number) {
    if (type == flightTypeIndex.ONE_WAY) {
      this.typeFlight = flightTypeValue.ONE_WAY;
    } else if (type == flightTypeIndex.ROUND_TRIP) {
      this.typeFlight = flightTypeValue.ROUND_TRIP;
    } else if (type == flightTypeIndex.MULTI_CITY) {
      this.typeFlight = flightTypeValue.MULTI_CITY;
    }
    // console.log(this.typeFlight);
  }

  getFlightTypeIndex(type: string) {
    switch (type) {
      case flightTypeValue.ONE_WAY:
        this.typeFlightIndex = 1;
        this.typeFlightIndexStr = '1';
        break; // one way
      case flightTypeValue.ROUND_TRIP:
        this.typeFlightIndex = 2;
        this.typeFlightIndexStr = '2';
        break; // round trip
      case flightTypeValue.MULTI_CITY:
        this.typeFlightIndex = 3;
        this.typeFlightIndexStr = '3';
        break; // multi city
    }
  }
}
