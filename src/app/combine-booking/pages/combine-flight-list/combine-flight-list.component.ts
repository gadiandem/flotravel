import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { OriginDestination } from 'src/app/model/flight/flight-list/originDestination';
import { OfferItem } from 'src/app/model/flight/flight-list/offerItem';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import * as FlightListActions from '../../../flight/store/flight-list.actions';
import * as fromApp from '../../../store/app.reducer';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import {
  combineBookingConstant,
  demoFlightData,
  flightProvider,
  flightSelectedProvider,
  flightTypeIndex,
  flightTypeValue,
} from '../../combine-booking.constant';
import { Airline } from 'src/app/model/flight/airline/airline';
import { OfferItemSelected } from 'src/app/model/flight/offer-price/request/offer-item-selected';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { flightConstant, flightListType } from 'src/app/flight/flight.constant';
import { FormGroup } from '@angular/forms';
import { SearchFlightService } from 'src/app/service/flight/search-flight.service';
import { FlightUtils } from 'src/app/flight/flight.function';
@Component({
  selector: 'app-combine-flight-list',
  templateUrl: './combine-flight-list.component.html',
  styleUrls: ['./combine-flight-list.component.css']
})
export class CombineFlightListComponent implements OnInit {

  typeFlight: string;
  typeFlightIndex: number;
  typeFlightIndexStr: string;
  searchFlightForm: SearchFlightForm;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchdata = true;

  destinations: OriginDestination[];
  originDestination: OriginDestination[];
  currency: string;
  allOfferItemList: OfferItem[][];
  minOfferItemList: OfferItem[];
  executionId: string;
  executionIdET: string;
  dateBefore: Date;
  departuringDate: Date;
  dateAfter: Date;
  flightSegNum: number;
  flightListView: Flight[] = [];
  flightListSource: Flight[] = [];
  flightListFilterTemp: Flight[] = [];
  // bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  sortType: string;

  // providerSearch: number;

  searchForm: FormGroup;
  showDropDown: boolean;
  showDropDownMobile: boolean;
  minDate = new Date();
  errorMessage: string[] = [];
  formSubmitError: boolean;

  searching = false;
  searchFailed = false;
  adultNumber: number;
  childrenNumber: number;
  showFormSearchResponsive = false;
  filterOpen = false;

  airlines: Airline[];
  arilineCodeList: string[] = [];
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private searchAirport: SearchFlightService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.airlines = [];
    this.originDestination = [];
    this.allOfferItemList = [];
    this.minOfferItemList = [];
    this.fetchAirlineList();
    this.sortType = flightConstant.SORT_TYPE;
    console.log('sortType: ' + this.sortType);
    this.flightListView = [];
    this.showDropDown = false;
    this.showDropDownMobile = false;
    this.store.select('flightList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS_FORM));
      if (this.searchFlightForm) {
        this.typeFlight = this.searchFlightForm.typeFlight;
        this.getFlightTypeIndex(this.typeFlight);
      }
      this.destinations = data.searchFlightResult;
      console.log('Destination size: ' + this.destinations);
      if (this.destinations.length === 0) {
        this.destinations = JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_LIST_RESULT)) || [];
      }
      this.flightSegNum = this.destinations.length;
      this.errorMes = data.errorMessage;
      if (this.destinations.length > 0) {
        this.allOfferItemList = [];
        this.destinations.forEach(o => {
          if (o.type == flightListType.DEPARTURE) {
            this.originDestination.push(Object.assign({}, o));
          }
        });
        this.getMinOfferItem();
      }
      this.refeshData();
    });
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
      this.typeFlight = flightTypeValue.ONE_WAY;
    } else if (id === '2') {
      this.typeFlight = flightTypeValue.ROUND_TRIP;
    } else if (id === '3') {
      this.typeFlight = flightTypeValue.MULTI_CITY;
    }
  }


  fetchAirlineList() {
    this.airlines = JSON.parse(localStorage.getItem(flightConstant.AIRLINE_LIST)) || [];
    if (this.airlines.length === 0) {
      this.store.dispatch(new FlightListActions.SearchAirlinesStart());
    }
  }
  refeshData() {
    this.searchFlightForm = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS_FORM));

    this.originDestination.forEach(o => {
      this.flightListSource.push(...o.flightList);
      if (o.provider === flightProvider.ET) {
        this.executionIdET = o.executionId;
      }
      if (o.provider === flightProvider.HAHN_AIR) {
        this.executionId = o.executionId;
      }
    });
    if (this.flightListSource.length > 0) {
      this.currency = this.flightListSource[0].offerItemList[0].currency || demoFlightData.CURRENCY;
      this.flightListView = [...this.flightListSource];
      this.getListAirline(this.flightListSource);
    }
    if (this.searchFlightForm && this.searchFlightForm.departuring) {
      this.departuringDate = new Date(this.searchFlightForm.departuring);
      this.dateBefore = new Date(
        new Date(this.searchFlightForm.departuring).setDate(
          this.departuringDate.getDate() - 1
        )
      );
      this.dateAfter = new Date(
        new Date(this.searchFlightForm.departuring).setDate(
          this.departuringDate.getDate() + 1
        )
      );
    }
  }
  getListAirline(flightListSource: Flight[]) {
    flightListSource.forEach(flight => {
      flight.flightSegments.forEach(seg => {
        this.addAirlineCode(seg.airline);
      });
    });
  }

  addAirlineCode(airline: string) {
    const arilineIndex = this.arilineCodeList.findIndex(item => item === airline);
    if (arilineIndex < 0) {
      this.arilineCodeList.push(airline);
    }
  }

  fetchFlightList() {
    this.store.dispatch(
      new FlightListActions.SearchFlightStart(this.searchFlightForm)
    );
  }

  getMinOfferItem() {
    let minItem: OfferItem;
    this.allOfferItemList.forEach((list) => {
      minItem = new OfferItem();
      let max = Number.POSITIVE_INFINITY;
      let tmp: number;
      list.forEach((e) => {
        tmp = e.totalAmount / this.flightSegNum;
        if (tmp < max) {
          max = tmp;
          minItem = e;
        }
      });
      this.minOfferItemList.push(minItem);
    });
    // this.sortPriceFlightList();
  }

  onSortChange(type: string) {
    this.sortType = type;
    switch (type) {
      case 'priceIncrease':
        this.increaseSort();
        break;
      case 'priceDecrease':
        this.decreaseSort();
        break;
      case 'durationIncreasing':
        this.increaseDuration();
        break;
      case 'durationDecreasing':
        this.decreaseDuration();
        break;
      case 'departureIncreasing':
        this.departureIncrease();
        break;
      case 'departureDecreasing':
        this.departureDecrease();
        break;
      case 'arrivalIncreasing':
        this.arrivalIncrease();
        break;
      case 'arrivalDecreasing':
        this.arrivalDecrease();
        break;
    }
    this.flightListFilterTemp = this.flightListView;
  }

  increaseSort() {
    this.flightListView = this.flightListSource.sort((a, b) =>
      a.offerItemList[0].totalAmount > b.offerItemList[0].totalAmount ? 1 : -1
    );
  }

  decreaseSort() {
    this.flightListView = this.flightListSource.sort((a, b) =>
      a.offerItemList[0].totalAmount < b.offerItemList[0].totalAmount ? 1 : -1
    );
  }

  increaseDuration() {
    this.flightListView = this.flightListSource.sort((a, b) => {
      const depaDateA = new Date(a.depDateTime).getTime();
      const arrDateA = new Date(a.arrDateTime).getTime();
      const diffTime = Math.abs(arrDateA - depaDateA);

      const depaDateB = new Date(a.depDateTime).getTime();
      const arrDateB = new Date(a.arrDateTime).getTime();
      const diffTime2 = Math.abs(arrDateB - depaDateB);
      return diffTime > diffTime2 ? 1 : -1;
    });
  }
  decreaseDuration() {
    this.flightListView = this.flightListSource.sort(FlightUtils.decreaseDuration);
  }
  departureIncrease() {
    this.flightListView = this.flightListSource.sort((a, b) => {
      const depaDateA = new Date(a.depDateTime).getTime();
      const depaDateB = new Date(b.depDateTime).getTime();
      return depaDateA > depaDateB ? 1 : -1;
    });
  }

  departureDecrease() {
    this.flightListView = this.flightListSource.sort((a, b) => {
      const depaDateA = new Date(a.depDateTime).getTime();
      const depaDateB = new Date(b.depDateTime).getTime();
      return depaDateA < depaDateB ? 1 : -1;
    });
  }

  arrivalIncrease() {
    this.flightListView = this.flightListSource.sort((a, b) => {
      const depaDateA = new Date(a.arrDateTime).getTime();
      const depaDateB = new Date(b.arrDateTime).getTime();
      return depaDateA > depaDateB ? 1 : -1;
    });
  }

  arrivalDecrease() {
    this.flightListView = this.flightListSource.sort((a, b) => {
      const depaDateA = new Date(a.arrDateTime).getTime();
      const depaDateB = new Date(b.arrDateTime).getTime();
      return depaDateA < depaDateB ? 1 : -1;
    });
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

  getDepatureTime(data: Flight): string {
    // if (data.flightSegments.length > 1) {
    //   return data.flightSegments[data.flightSegments.length - 1].depDateTime;
    // } else {
      return data.flightSegments[0].depDateTime;
    // }
  }

  directFilter(filter: boolean) {
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        if (flight.flightSegments.length === 1) {
          return flight;
        }
      });
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }
  upTo1StopFilter(filter: boolean) {
    console.log('upTo1StopFilter: ' + filter);
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        if (flight.flightSegments.length > 1) {
          return flight;
        }
      });
      console.log('flight List filtered: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  isInRange(value, range) {
    return value >= range[0] && value <= range[1];
  }

  earlyMorningDepatureFilter(filter: boolean) {
    console.log('earlyMorningDepatureFilter: ' + filter);
    const range = ['00:00', '05:00'];
    if (filter) {
      this.flightListView = this.flightListFilterTemp.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('earlyMorningDepatureFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  morningDepatureFilter(filter: boolean) {
    console.log('morningDepatureFilter: ' + filter);
    const range = ['05:00', '12:00'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('morningDepatureFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  afternoonDepatureFilter(filter: boolean) {
    console.log('afternoonDepatureFilter: ' + filter);
    const range = ['12:00', '18:00'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('afternoonDepatureFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  eveningDepatureFilter(filter: boolean) {
    console.log('eveningDepatureFilter: ' + filter);
    const range = ['18:00', '23:59'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('eveningDepatureFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  earlyMorningArrivalFilter(filter: boolean) {
    console.log('earlyMorningArrivalFilter: ' + filter);
    const range = ['00:00', '05:00'];
    if (filter) {
      this.flightListView = this.flightListFilterTemp.filter(flight => {
        const time = this.getArrivalCode(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('earlyMorningArrivalFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  morningArrivalFilter(filter: boolean) {
    console.log('morningArrivalFilter: ' + filter);
    const range = ['05:00', '12:00'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getArrivalCode(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('morningArrivalFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  afternoonArrivalFilter(filter: boolean) {
    console.log('afternoonArrivalFilter: ' + filter);
    const range = ['12:00', '18:00'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getArrivalTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('afternoonArrivalFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }

  eveningArrivalFilter(filter: boolean) {
    console.log('eveningArrivalFilter: ' + filter);
    const range = ['18:00', '23:59'];
    if (filter) {
      this.flightListView = this.flightListView.filter(flight => {
        const time = this.getArrivalTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('eveningArrivalFilter: ' + JSON.stringify(this.flightListView));
    } else {
      this.flightListView = this.flightListFilterTemp;
    }
  }
  airlineFilter(selectedAirline: string[]) {
    this.flightListView = [];
    if (selectedAirline) {
      selectedAirline.forEach(airline => {
        this.flightListView.push(...this.getFlightOfAirline(airline));
      });
    }
  }

  getFlightOfAirline(airline: string): Flight[] {
    const flights = this.flightListSource.filter(flight => flight.flightSegments[0].airline === airline);
    return flights;
  }

  reserve(flight: Flight) {
    if (flight.provider === flightProvider.AERO_CRS) {
      sessionStorage.setItem(flightConstant.SELECTED_PROVIDER, flightSelectedProvider.AERO_CRS.toString());
    } else {
      if (flight.provider === flightProvider.HAHN_AIR) {
        sessionStorage.setItem(flightConstant.SELECTED_PROVIDER, flightSelectedProvider.HAHN_AIR.toString());
      } else {
        sessionStorage.setItem(flightConstant.SELECTED_PROVIDER, flightSelectedProvider.ET.toString());
        this.executionId = this.executionIdET;
      }
    }
    const selectFlight = new SelectedFlight();
    selectFlight.flight = flight;
    selectFlight.offerItem = flight.offerItemList[0];
    sessionStorage.setItem(combineBookingConstant.DEPARTURE_FLIGHT, JSON.stringify(selectFlight));
    this.store.dispatch(
      new FlightListActions.SelectDepartureFlight(selectFlight)
    );
    if (this.searchFlightForm.typeFlight) {
      this.searchFlightForm.typeFlight = flightTypeValue.ONE_WAY;
    }
    switch (this.searchFlightForm.typeFlight) {
      case flightTypeValue.ONE_WAY:
        const offerData = new OfferPriceReq();
        if (+sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightSelectedProvider.ET) {
            this.executionId = this.executionIdET;
        }
        offerData.executionId = this.executionId || '';

        const selectItem: OfferItem = flight.offerItemList[0];
        const offerItem = new OfferItemSelected();
        offerItem.offerId = selectItem.offerId;
        offerItem.offerItemId = selectItem.offerItemId;
        offerItem.owner = selectItem.owner || 'HR';
        offerData.offerItems = [];
        offerData.offerItems.push(offerItem);
        const travellers = new Travellers();
        travellers.adt = this.searchFlightForm.adults;
        travellers.chd = this.searchFlightForm.children;
        travellers.inf = 0;
        travellers.ins = 0;
        travellers.unn = 0;
        offerData.travellers = travellers;
        const bspBooking = sessionStorage.getItem(
          flightConstant.FLIGHT_BSP_BOOKING
        );
        if (bspBooking == '1') {
          offerData.bspBooking = true;
        } else {
          offerData.bspBooking = false;
        }
        sessionStorage.setItem(
          combineBookingConstant.OFFER_PRICE,
          JSON.stringify(offerData)
        );
        offerData.originalDestinations = [];
        window.open(`#/combine/combineSummary`, '_blank');
        break;
      case flightTypeValue.ROUND_TRIP:
        window.open(`#/combine/combineSummary`, '_blank');
        break;
      case flightTypeValue.MULTI_CITY:
        window.open(`#/combine/combineSummary`, '_blank');
    }
  }


  searchFlight(searchData: SearchFlightForm) {
    this.store.dispatch(new FlightListActions.SearchFlightStart( searchData));
    this.route.navigate(["../flightList"], {relativeTo: this.activatedRoute});
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

  flightTypeChange(type: number) {
    if (type == flightTypeIndex.ONE_WAY) {
      this.typeFlight = flightTypeValue.ONE_WAY;
    } else if (type == flightTypeIndex.ROUND_TRIP) {
      this.typeFlight = flightTypeValue.ROUND_TRIP;
    } else if (type == flightTypeIndex.MULTI_CITY) {
      this.typeFlight = flightTypeValue.MULTI_CITY;
    }
    console.log(this.typeFlight);
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
