import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { OriginDestination } from 'src/app/model/flight/flight-list/originDestination';
import { Flight } from 'src/app/model/flight/flight-list/flight';
import { OfferItem } from 'src/app/model/flight/flight-list/offerItem';
import { FlightSearchDialogComponent } from '../flight-search-dialog/flight-search-dialog.component';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import * as fromApp from '../../store/app.reducer';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import {
  demoFlightData, economyData,
  flightConstant,
  flightTypeIndex,
  flightTypeValue, moreOptionData, typeFlightData,
} from '../flight.constant';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { OfferItemSelected } from 'src/app/model/flight/offer-price/request/offer-item-selected';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AirportRes } from '../../model/flight/airport/airportRes';
import { SearchFlightService } from '../../service/flight/search-flight.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';

@Component({
  selector: 'app-flight-next-city',
  templateUrl: './flight-next-city.component.html',
  styleUrls: ['./flight-next-city.component.css']
})
export class FlightNextCityComponent implements OnInit {
  @ViewChild('travellerDropDown', {static: false}) travellerDropDown: ElementRef;
  @ViewChild('travellerDropDownMobile', {static: false}) travellerDropDownMobile: ElementRef;
  // items = [1, 2, 3, 4, 5];
  today = new Date();
  isCollapsed: boolean[];
  isCollapsedD: boolean;
  typeFlight: string;
  cabinClass: string;
  searchFlightForm: SearchFlightForm;

  // bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  dateBefore: Date;
  departuringDate: Date;
  dateAfter: Date;

  nextFlight: OriginDestination;
  departureFlight: SelectedFlight;
  nextFlights: SelectedFlight[];
  nextFlightsNew: SelectedFlight[];
  // nextFlightPrices: OfferItem[];
  cityToChoose: number;
  numberOfCityMustChoose: number;
  executionId: string;
  // offerData_mc: OfferPriceReq;

  allOfferItemList: OfferItem[][];
  minOfferItemList: OfferItem[];
  // departureFlightPrice: OfferItem;
  searchForm: FormGroup;
  showDropDown: boolean;
  showDropDownMobile: boolean;
  bsConfig: Partial<BsDatepickerConfig>;
  minDate = new Date();

  suggestions1$: Observable<AirportRes[]>;
  search1: string;
  suggestions2$: Observable<AirportRes[]>;
  search2: string;
  suggestions3$: Observable<AirportRes[]>;
  search3: string;
  suggestions4$: Observable<AirportRes[]>;
  search4: string;
  errorMessage: string[] = [];
  formSubmitError: boolean;

  searching = false;
  searchFailed = false;
  adultNumber: number;
  childrenNumber: number;
  searchFlightFormNew: SearchFlightForm;
  typeFlightIndex: number;
  typeFlightIndexStr: string;
  economyData: Array<Select2OptionData> =  economyData;
  moreOptionData: Array<Select2OptionData> = moreOptionData;
  typeFlightData:  Array<Select2OptionData> = typeFlightData;
  options: Options;
  hourDuration: number;
  minuteDuration: number;
  fetching = true;
  showFormSearchResponsive = false;
  filterOpen = false;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    private searchAirport: SearchFlightService,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // this.bsConfig = new ModalOptions();
    this.initForm();
    this.options = {
      multiple: true,
      theme: 'classic',
      closeOnSelect: false,
      width: 'auto',
      templateSelection: (object: any) => {
        return object && object.custom && object.custom.en;
      },
      templateResult: (object: any) => {
        return object && object.custom && object.custom.en;
      }
    };
    this.isCollapsedD = true;
    this.isCollapsed = [];
    this.nextFlight = new OriginDestination();
    this.cityToChoose = 2;
    this.nextFlights = [];
    this.nextFlightsNew = [];

    // this.nextFlightPrices = [];
    this.allOfferItemList = [];
    this.minOfferItemList = [];
    // this.offerData_mc = JSON.parse(sessionStorage.getItem('offerPrice'));

    this.executionId = sessionStorage.getItem(flightConstant.EXECUTION_ID);
    this.showDropDown = false;
    this.showDropDownMobile = false;
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: this.minDate,
        showWeekNumbers: false,
        orientation: 'bottom left',
      }
    );
    this.options = {
      theme: 'classic',
      width: 'auto',
      dropdownAutoWidth: true,
    };
    this.store.select('flightList').subscribe((data) => {
      this.nextFlight = data.searchFlightResult[1];
      if (this.nextFlight == null) {
        this.nextFlight = (JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_LIST_RESULT)) as OriginDestination[])[1];
        if (this.nextFlight == null) {
          this.route.navigate(['/']);
        }
      }
      if (data.searchFlightResult.length > 0) {
        this.numberOfCityMustChoose = data.searchFlightResult.length;
      } else {
        this.numberOfCityMustChoose = (JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_LIST_RESULT)) as OriginDestination[])
          .length || 2;
      }
      this.searchFlightForm = data.searchFlightForm;
      if (this.searchFlightForm == null) {
        this.searchFlightForm = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
        if (this.searchFlightForm == null) {
          this.route.navigate(['/']);
        }
      }
        this.searchFlightFormNew = Object.assign({}, this.searchFlightForm);
        this.search1 = this.searchFlightFormNew.flyFrom.name;
        this.search2 = this.searchFlightFormNew.destination.name;
        this.searchFlightFormNew.flyFromNext = [];
        this.searchFlightFormNew.destinationNext = [];
        this.typeFlight = this.searchFlightFormNew.typeFlight;
        this.getFlightTypeIndex(this.typeFlight);
        this.adultNumber = this.searchFlightFormNew.adults;
        this.childrenNumber = this.searchFlightFormNew.children;
      this.departureFlight = data.departureFlight;
      if (this.departureFlight == null) {
        this.departureFlight = JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
        if (this.departureFlight == null) {
          this.route.navigate(['/']);
        }
      }
      // this.departureFlightPrice = data.departureFlight.offerItem;
      // if (this.departureFlightPrice == null) {
      //   this.departureFlightPrice = JSON.parse(sessionStorage.getItem('departureFlightPrice'));
      //   if (this.departureFlightPrice == null) {
      //     this.route.navigate(['/']);
      //   }
      // }
      // this.numberOfCityMustChoose = data.searchFlightResult.length;
      this.refeshData();
    });
    this.updateValueForm();
    this.searchDestination();
    this.searchArrival();
    this.searchDestinationNext();
    this.searchArrivalNext();
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
    }, 2000);
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
    if (this.numberOfCityMustChoose > 2) {
      this.loadNextFlight();
    } else {
      this.nextFlight.flightList.forEach(e => {
        this.allOfferItemList.push(e.offerItemList);
        this.isCollapsed.push(true);
      });
      this.getMinOfferItem();
    }

    this.typeFlight = sessionStorage.getItem('flightType') || 'MULTI_CITY';
    this.cabinClass = sessionStorage.getItem('cabinClass') || 'BUSINESS';
    if (this.searchFlightForm.departuring) {
      this.departuringDate = new Date(this.searchFlightForm.departuring);
      this.dateBefore = new Date((new Date(this.searchFlightForm.departuring)).setDate(this.departuringDate.getDate() - 1));
      this.dateAfter = new Date((new Date(this.searchFlightForm.departuring)).setDate(this.departuringDate.getDate() + 1));
    }
  }

  getMinOfferItem() {
    this.allOfferItemList.forEach(list => {
      let minItem = new OfferItem();
      let max = Number.POSITIVE_INFINITY;
      let tmp: number;
      list.forEach(e => {
        tmp = e.totalAmount;
        if (tmp < max) {
          max = tmp;
          minItem = e;
        }
      });
      this.minOfferItemList.push(minItem);
    });
  }

  // openModalWithComponent() {
  //   const initialState = {
  //     searchFlightForm: this.searchFlightForm,
  //     typeFlight: this.typeFlight
  //   };
  //   this.bsConfig.initialState = initialState;
  //   this.bsConfig.class = 'modal-lg';
  //   this.bsConfig.animated = true;
  //   this.bsModalRef = this.modalService.show(FlightSearchDialogComponent, this.bsConfig);
  //   this.bsModalRef.content.closeBtnName = 'Close';
  //
  //   this.bsModalRef.content.event.subscribe(res => {
  //     this.searchFlightForm = res;
  //   });
  // }

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

  reserve(index: number) {
    // console.log('reserve flight: ' + id);
    // this.nextFlights.push(this.nextFlight.flightList[index]);
    // this.nextFlightPrices.push(this.minOfferItemList[index]);

    const selectFlight = new SelectedFlight();
    selectFlight.flight = this.nextFlight.flightList[index];
    selectFlight.offerItem = this.minOfferItemList[index];
    // this.nextFlights.push(selectFlight);
    this.nextFlightsNew.push(selectFlight);
    this.nextFlights = Object.assign([], this.nextFlightsNew);
    sessionStorage.setItem(flightConstant.NEXT_FLIGHT, JSON.stringify(this.nextFlights));
    this.store.dispatch(
      new FlightListActions.SelectNextFlights(this.nextFlights)
    );
    // sessionStorage.setItem('nextFlights', JSON.stringify(this.nextFlights));
    // sessionStorage.setItem('nextFlightPrices', JSON.stringify(this.nextFlightPrices));
    // this.store.dispatch(new FlightListActions.SelectNextFlights(this.nextFlights));
    // this.store.dispatch(new FlightListActions.SaveNextFlightsPrice(this.nextFlightPrices));


    // const offerData_mc = new OfferPriceReq();
    // // if (this.offerData_mc != null) {
    //   const selectItem: OfferItem = this.minOfferItemList[index];
    // offerData_mc.offerItemIds.push(selectItem.offerItemId);
    // }
    if (this.cityToChoose === this.numberOfCityMustChoose) {
      const offerData_mc = new OfferPriceReq();
      offerData_mc.executionId = this.executionId;

      offerData_mc.offerItems = [];
      const offerItem = new OfferItemSelected();
      offerItem.offerId = this.departureFlight.offerItem.offerId;
      offerItem.offerItemId = this.departureFlight.offerItem.offerItemId;
      offerItem.owner = this.departureFlight.offerItem.owner || 'HR';
      offerData_mc.offerItems.push(offerItem);

      const travellers = new Travellers();
      const searchFlightForm: SearchFlightForm = JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      travellers.adt = searchFlightForm.adults;
      travellers.chd = searchFlightForm.children;
      travellers.inf = searchFlightForm.infants;
      travellers.ins = 0;
      travellers.unn = 0;
      offerData_mc.travellers = travellers;

      this.nextFlights.forEach((item) => {
        const offerItemNexts = new OfferItemSelected();
        offerItemNexts.offerId = item.offerItem.offerId;
        offerItemNexts.offerItemId = item.offerItem.offerItemId;
        offerItemNexts.owner = item.offerItem.owner || 'HR';
        offerData_mc.offerItems.push(offerItemNexts);
      });
      sessionStorage.setItem(flightConstant.OFFER_PRICE, JSON.stringify(offerData_mc));
      this.store.dispatch(new FlightListActions.OfferPriceFlightStart(offerData_mc ));
      this.route.navigate(['../flightSummary'], { relativeTo: this.activatedRoute });
    } else {
      this.cityToChoose++;
      this.loadNextFlight();
    }
  }

  loadNextFlight() {
    this.store.select('flightList').subscribe((data) => {
      this.nextFlight = data.searchFlightResult[this.cityToChoose - 1];
    });
    this.nextFlight.flightList.forEach(e => {
      this.allOfferItemList.push(e.offerItemList);
    });
    this.getMinOfferItem();

  }

  private initForm() {
    this.searchForm = new FormGroup({
      flyFrom: new FormControl('', Validators.required),
      destination: new FormControl('', Validators.required),
      departuring: new FormControl('', Validators.required),
      returning: new FormControl('',
        this.conditionalValidator((() => this.typeFlight === flightTypeValue.ROUND_TRIP),
          Validators.required)),
      anotherCities: new FormArray([
        new FormGroup({
          flyFromNext: new FormControl('',
            this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          destinationNext: new FormControl('',
            this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required)),
          departuringNext: new FormControl('',
            this.conditionalValidator((() => this.typeFlight === flightTypeValue.MULTI_CITY), Validators.required))
        })
      ])
    });
  }

  updateValueForm() {
    (this.searchForm.get('flyFrom') as FormControl).setValue(this.searchFlightFormNew.flyFrom);
    (this.searchForm.get('destination') as FormControl).setValue(this.searchFlightFormNew.destination);
    (this.searchForm.get('departuring') as FormControl).setValue(new Date(this.searchFlightFormNew.departuring));
    if (this.searchFlightFormNew.returning ) {
      (this.searchForm.get('returning') as FormControl).setValue(new Date(this.searchFlightFormNew.returning));
    }
  }

  searchFlight() {
    const d: any = this.searchForm.value;
    this.searchFlightFormNew.departuring = this.datePipe.transform(d.departuring, 'yyyy-MM-dd');
    this.searchFlightFormNew.adults = this.adultNumber;
    this.searchFlightFormNew.children = this.childrenNumber;
    this.searchFlightFormNew.typeFlight = this.typeFlight;
    this.searchFlightFormNew.simulator = false;

    const valueBspBooking: string = sessionStorage.getItem(flightConstant.FLIGHT_BSP_BOOKING);
    if (valueBspBooking === '1') {
      this.searchFlightFormNew.bspBooking = true;
    } else {
      this.searchFlightFormNew.bspBooking = false;
    }
    if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
      this.searchFlightFormNew.returning = this.datePipe.transform(d.returning, 'yyyy-MM-dd');
    }
    if (this.typeFlight === flightTypeValue.MULTI_CITY) {
      this.searchFlightFormNew.returning = this.datePipe.transform(d.returning, 'yyyy-MM-dd');
      this.searchFlightFormNew.departuringNext = [];
      (d.anotherCities as Array<any>).forEach((city) => {
        this.searchFlightFormNew.departuringNext.push(this.datePipe.transform(city.departuringNext, 'yyyy-MM-dd'));
      });
    }
    sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(this.searchFlightFormNew));
    this.store.dispatch(new FlightListActions.SearchFlightStart( this.searchFlightFormNew));
    this.route.navigate(['/flight']);
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  toggleDropMobile() {
    this.showDropDownMobile = !this.showDropDownMobile;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  changeShowDropDownMobile(isShowDropDownMobile: boolean) {
    this.showDropDownMobile = isShowDropDownMobile;
  }

  updateAdultNumber(value: number) {
    this.adultNumber = value;
  }

  updateChildrenNumber(value: number) {
    this.childrenNumber = value;
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    const menuDropClick = btn.className  === this.travellerDropDown.nativeElement.className;
    const dropDown =  btn.closest('app-room-guests-flight');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClickMobile(btn) {
    const menuDropClick = btn.className  === this.travellerDropDownMobile.nativeElement.className;
    const dropDown =  btn.closest('app-room-guests-flight');
    if (!menuDropClick && !dropDown) {
      this.showDropDownMobile = false;
    }
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
    // switch (type) {
    //   case flightTypeIndex.ONE_WAY:
    //     this.typeFlight = flightTypeValue.ONE_WAY;
    //     break;
    //   case flightTypeIndex.ROUND_TRIP:
    //     this.typeFlight = flightTypeValue.ROUND_TRIP;
    //     break;
    //   case flightTypeIndex.MULTI_CITY:
    //     this.typeFlight = flightTypeValue.MULTI_CITY;
    //     break;
    // }
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

  searchDestination() {
    this.suggestions1$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search1);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search1).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchArrival() {
    this.suggestions2$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search2);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search2).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchDestinationNext() {
    this.suggestions3$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search3);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search3).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }
  searchArrivalNext() {
    this.suggestions4$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search4);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchAirport.searchAirport(this.search4).pipe(
            map((data: AirportRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => this.searching = false, err => {
              // in case of http error
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }

  selectFlyFrom(flyFrom: any) {
    this.searchFlightFormNew.flyFrom = flyFrom;
  }

  selectDestination(destination: any) {
    this.searchFlightFormNew.destination = destination;
  }

  selectFlyFromNext(flyFromNext: any) {
    this.searchFlightFormNew.flyFromNext.push(flyFromNext);
  }

  selectDestinationNext(destinationNext: any) {
    this.searchFlightFormNew.destinationNext.push(destinationNext);
  }
  conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!condition()) {
        return null;
      }
      return validator(control);
    };
  }

  onAddCity() {
    (this.searchForm.get('anotherCities') as FormArray).push(
      new FormGroup({
        flyFromNext: new FormControl('', Validators.required),
        destinationNext: new FormControl('', Validators.required),
        departuringNext: new FormControl('', Validators.required),
      })
    );
  }

  removeitem(index: number) {
    (this.searchForm.get('anotherCities') as FormArray).removeAt(index);
  }

  onValueChange(value: Date): void {
    (this.searchForm.get('returning') as FormControl).setValue(value);
    // this.minReturnDate = value;
    const returnDate = value;
    this.bsConfig = Object.assign({}, {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }
}
