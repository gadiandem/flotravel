import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { OriginDestination } from 'src/app/model/flight/flight-list/originDestination';
import { OfferItem } from 'src/app/model/flight/flight-list/offerItem';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import * as fromApp from '../../store/app.reducer';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import {
  flightConstant,
  flightListType,
  flightProvider,
  flightTypeValue,
} from '../flight.constant';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { OfferItemSelected } from 'src/app/model/flight/offer-price/request/offer-item-selected';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { SearchFlightService } from '../../service/flight/search-flight.service';
import { FormGroup } from '@angular/forms';
import { Airline } from 'src/app/model/flight/airline/airline';
import { FlightListRes } from 'src/app/model/flight/flight-list/flightListRes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-return',
  templateUrl: './flight-return.component.html',
  styleUrls: ['./flight-return.component.css'],
})
export class FlightReturnComponent implements OnInit, OnDestroy {
  sub: Subscription;
  @ViewChild('travellerDropDown', {static: false}) travellerDropDown: ElementRef;
  @ViewChild('travellerDropDownMobile', {static: false}) travellerDropDownMobile: ElementRef;
  items = [1, 2, 3, 4, 5];
  today = new Date();
  typeFlight: string;
  searchFlightForm: SearchFlightForm;

  dateBefore: Date;
  returningDate: Date;
  dateAfter: Date;

  flightList: FlightListRes;
  departureFlight: SelectedFlight;
  // departureFlightPrice: OfferItem;
  executionId: string;
  offerData_rt: OfferPriceReq;
  executionIdET: string;
  // returnDestination: OriginDestination;
  targetDestination: OriginDestination[];
  flightListView: Flight[] = [];
  flightListSource: Flight[] = [];
  flightListFilterTemp: Flight[] = [];

  selectedProvider: number;

  allOfferItemList: OfferItem[][];
  minOfferItemList: OfferItem[];

  searchForm: FormGroup;
  showDropDown: boolean;
  showDropDownMobile: boolean;
  minDate = new Date();
  errorMessage: string[] = [];
  formSubmitError: boolean;
  searching = false;
  searchFailed = false;
  typeFlightIndex: number;
  typeFlightIndexStr: string;
  hourDuration: number;
  minuteDuration: number;
  fetching = true;
  showFormSearchResponsive = false;
  filterOpen = false;
  flightHahnAirListView: Flight[];

  airlines: Airline[];
  arilineCodeList: string[] = [];
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private store: Store<fromApp.AppState>,
    private searchAirport: SearchFlightService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.selectedProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
    console.log('return page selected provider: ' + this.selectedProvider);
    this.flightListView = [];
    this.flightHahnAirListView = [];
    this.flightListFilterTemp = [];
    this.targetDestination = [];
    // this.returnDestination = new OriginDestination();
    // this.offerData_rt = JSON.parse(sessionStorage.getItem('offerPrice'));

    this.allOfferItemList = [];
    this.minOfferItemList = [];
    this.executionId = sessionStorage.getItem(flightConstant.EXECUTION_ID);

    this.showDropDown = false;
    this.showDropDownMobile = false;
    this.sub = this.store.select('flightList').subscribe((data) => {
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      if (this.searchFlightForm && this.searchFlightForm.typeFlight) {
        this.typeFlight = this.searchFlightForm.typeFlight;
      } else {
        this.route.navigate(['/dashboard/flight']);
      }

      this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
      if (!this.departureFlight || !this.departureFlight.flight) {
        this.route.navigate(['/dashboard/flight']);
      }
      const selectedProvider = this.departureFlight.flight.provider;
      // this.returnDestination = data.searchFlightResult[1] || (JSON.parse(
      //   sessionStorage.getItem(flightConstant.FLIGHT_LIST_RESULT)) as OriginDestination[])[1];
          if (data.searchFlightResult.length > 0) {
            this.allOfferItemList = [];
            data.searchFlightResult.forEach(o => {
              if (o.type === flightListType.RETURNING && o.provider === selectedProvider) {
                this.targetDestination.push(Object.assign({}, o));
              }
            });
            this.getMinOfferItem();
          }
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      if (!this.searchFlightForm || !this.searchFlightForm.destination) {
        this.route.navigate(['/dashboard/flight']);
      }
      this.refeshData();
    });
    this.loadingSkeleton();
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

  loadingSkeleton() {
    setTimeout(() => {
      this.fetching = false;
    }, 1000);
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

  refeshData() {
    // this.returnDestination.flightList.forEach((e) => {
    //   this.allOfferItemList.push(e.offerItemList);
    // });
    this.targetDestination.forEach(o => {
      this.flightListSource.push(...o.flightList);
    });
    if (this.flightListSource.length > 0) {
      this.filterFlightListSource(this.flightListSource);
      this.flightListView = [...this.flightListSource];
      this.flightListFilterTemp = [...this.flightListSource];
      this.getListAirline(this.flightListSource);

    // this.flightHahnAirListView = [...this.returnDestination.flightList];
    // this.flightListFilterTemp = this.flightHahnAirListView;
    //  this.getListAirline(this.returnDestination.flightList);
    }
    if (this.searchFlightForm.departuring) {
      this.returningDate = new Date(this.searchFlightForm.returning);
      this.dateBefore = new Date(
        new Date(this.searchFlightForm.departuring).setDate(
          this.returningDate.getDate() - 1
        )
      );
      this.dateAfter = new Date(
        new Date(this.searchFlightForm.departuring).setDate(
          this.returningDate.getDate() + 1
        )
      );
    }
    this.getMinOfferItem();
  }

  filterFlightListSource(flights: Flight[]) {
    this.flightListSource  = flights.filter(flight => flight.provider === this.selectedProvider);
    // if(this.departureFlight){
    //   this.flightListSource = this.flightListSource.filter(flight => {
    //     if(flight.offerItemList[0].offerId == this.departureFlight.offerItem.offerId){
    //       return true;
    //     }
    //     return false;
    //   })
    // }
  }

  getMinOfferItem() {
    this.allOfferItemList.forEach((list) => {
      let minItem = new OfferItem();
      let max = Number.POSITIVE_INFINITY;
      let tmp: number;
      list.forEach((e) => {
        tmp = e.totalAmount;
        if (tmp < max) {
          max = tmp;
          minItem = e;
        }
      });
      this.minOfferItemList.push(minItem);
    });
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
      this.flightHahnAirListView = this.flightListSource.filter(flight => {
        if (flight.flightSegments.length === 1) {
          return flight;
        }
      });
    } else {
      this.flightHahnAirListView = this.flightListSource;
      // this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }
  upTo1StopFilter(filter: boolean) {
    console.log('upTo1StopFilter: ' + filter);
    if (filter) {
      this.flightHahnAirListView = this.flightListSource.filter(flight => {
        if (flight.flightSegments.length > 1) {
          return flight;
        }
      });
      console.log('flight List filtered: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListSource;
      // this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  isInRange(value, range) {
    return value >= range[0] && value <= range[1];
  }

  earlyMorningDepatureFilter(filter: boolean) {
    console.log('earlyMorningDepatureFilter: ' + filter);
    const range = ['00:00', '05:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightListFilterTemp.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('earlyMorningDepatureFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  morningDepatureFilter(filter: boolean) {
    console.log('morningDepatureFilter: ' + filter);
    const range = ['05:00', '12:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('morningDepatureFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  afternoonDepatureFilter(filter: boolean) {
    console.log('afternoonDepatureFilter: ' + filter);
    const range = ['12:00', '18:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('afternoonDepatureFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  eveningDepatureFilter(filter: boolean) {
    console.log('eveningDepatureFilter: ' + filter);
    const range = ['18:00', '23:59'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getDepatureTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('eveningDepatureFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  earlyMorningArrivalFilter(filter: boolean) {
    console.log('earlyMorningArrivalFilter: ' + filter);
    const range = ['00:00', '05:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightListFilterTemp.filter(flight => {
        const time = this.getArrivalCode(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('earlyMorningArrivalFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  morningArrivalFilter(filter: boolean) {
    console.log('morningArrivalFilter: ' + filter);
    const range = ['05:00', '12:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getArrivalCode(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('morningArrivalFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  afternoonArrivalFilter(filter: boolean) {
    console.log('afternoonArrivalFilter: ' + filter);
    const range = ['12:00', '18:00'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getArrivalTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('afternoonArrivalFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
    }
  }

  eveningArrivalFilter(filter: boolean) {
    console.log('eveningArrivalFilter: ' + filter);
    const range = ['18:00', '23:59'];
    if (filter) {
      this.flightHahnAirListView = this.flightHahnAirListView.filter(flight => {
        const time = this.getArrivalTime(flight).split(' ')[1];
        const inRange = this.isInRange(time, range);
        return inRange;
      });
      console.log('eveningArrivalFilter: ' + JSON.stringify(this.flightHahnAirListView));
    } else {
      this.flightHahnAirListView = this.flightListFilterTemp;
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

  airlineFilter(selectedAirline: string[]) {
    this.flightHahnAirListView = [];
    if (selectedAirline) {
      selectedAirline.forEach(airline => {
        this.flightHahnAirListView.push(...this.getFlightOfAirline(airline));
      });
    }
  }

  getFlightOfAirline(airline: string): Flight[] {
    const flights = this.targetDestination[0].flightList.filter(flight => flight.flightSegments[0].airline === airline);
    return flights;
  }

  totalDuration(data: Flight): string {
    this.hourDuration = 0;
    this.minuteDuration = 0;
    if (data.flightSegments.length > 1) {
      data.flightSegments.forEach(segment => {
        const hour = segment.duration.split('H')[0];
        const minute  = segment.duration.split('M')[0].split('H')[1];
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

  reserve(flight: Flight) {

    const selectFlight = new SelectedFlight();
    selectFlight.flight = flight;
    selectFlight.offerItem = flight.offerItemList[0];
    sessionStorage.setItem(
      flightConstant.RETURN_FLIGHT,
      JSON.stringify(selectFlight)
    );
    this.store.dispatch(new FlightListActions.SelectReturnFlight(selectFlight));

    const offerData_rt = new OfferPriceReq();
    offerData_rt.executionId = this.executionId;

    offerData_rt.offerItems = [];
    const offerItem = new OfferItemSelected();
    offerItem.offerId = this.departureFlight.offerItem.offerId;
    offerItem.offerItemId = this.departureFlight.offerItem.offerItemId;
    offerItem.owner = this.departureFlight.offerItem.owner || 'HR';
    offerData_rt.offerItems.push(offerItem);

    const selectItem_rt: OfferItem = flight.offerItemList[0];
    const offerItem_rt = new OfferItemSelected();
    offerItem_rt.offerId = selectItem_rt.offerId;
    offerItem_rt.offerItemId = selectItem_rt.offerItemId;
    offerItem_rt.owner = selectItem_rt.owner || 'HR';
    offerData_rt.offerItems.push(offerItem_rt);
    const travellers = new Travellers();
    const searchFlightForm: SearchFlightForm = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
    travellers.adt = searchFlightForm.adults;
    travellers.chd = searchFlightForm.children;
    travellers.inf = searchFlightForm.infants;
    travellers.ins = 0;
    travellers.unn = 0;
    offerData_rt.travellers = travellers;
    const bspBooking = sessionStorage.getItem(
      flightConstant.FLIGHT_BSP_BOOKING
    );
    if (bspBooking == '1') {
      offerData_rt.bspBooking = true;
    } else {
      offerData_rt.bspBooking = false;
    }
    sessionStorage.setItem(
      flightConstant.OFFER_PRICE,
      JSON.stringify(offerData_rt)
    );
    this.store.dispatch(
      new FlightListActions.OfferPriceFlightStart(offerData_rt)
    );

    this.route.navigate(['../flightSummary'], {
      relativeTo: this.activatedRoute,
    });
  }

  searchFlight(searchData: SearchFlightForm) {
    this.store.dispatch(new FlightListActions.SearchFlightStart( searchData));
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
}
