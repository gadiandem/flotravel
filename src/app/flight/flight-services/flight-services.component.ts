import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {Subscription } from 'rxjs';
import { flightConstant, flightTypeIndex, flightTypeValue } from '../flight.constant';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import { ServiceListResponse } from 'src/app/model/flight/services/service-response';
import { AvailableServices } from 'src/app/model/flight/services/available-services';
import { FlightServicesOfferPriceReq } from 'src/app/model/flight/services/service-offerprice-req';
import { OfferPriceReq } from 'src/app/model/flight/offer-price/request/offer-price-req';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';

@Component({
  selector: 'app-flight-services',
  templateUrl: './flight-services.component.html',
  styleUrls: ['./flight-services.component.css']
})
export class FlightServicesComponent implements OnInit, OnDestroy {

  fetching = true;
  fetchFailed = false;
  errorMes: string;
  sub: Subscription;
  servicesAvailable: ServiceListResponse;
  servicesOffers: AvailableServices[] = [];
  selectedService: AvailableServices;
  selectedServiceList: AvailableServices[] = [];
  offerPricesReq: OfferPriceReq;
  orderChange: OrderChangeReq;
  searchFlightForm: SearchFlightForm;
  typeFlight: string;
  filterOpen = false;
  showFormSearchResponsive = false;
  provider: number;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2,
    private el: ElementRef,
  ) { 
    
  }
 

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.sub = this.store.select('flightList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
      this.servicesAvailable = data.serviceList || JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_SEVICES_RES));
      this.offerPricesReq = data.offerPricesReq || JSON.parse(sessionStorage.getItem(flightConstant.OFFER_PRICE));
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      if(this.offerPricesReq){
        this.offerPricesReq = Object.assign({}, this.offerPricesReq);
        const travellers = new Travellers();
        travellers.adt = this.searchFlightForm.adults;
        travellers.chd = this.searchFlightForm.children;
        travellers.inf = this.searchFlightForm.infants;
        travellers.ins = 0;
        travellers.unn = 0;
        this.offerPricesReq.travellers =  travellers;
      }
      this.orderChange = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_CHANGE));
      if(this.orderChange){  
        if(!this.provider){
          sessionStorage.setItem(flightConstant.SELECTED_PROVIDER,JSON.stringify(this.orderChange.provider));
        }
        sessionStorage.setItem(flightConstant.DEPARTURE_FLIGHT, JSON.stringify(this.orderChange.flightDetail.departureFlight));
        sessionStorage.setItem(flightConstant.RETURN_FLIGHT, JSON.stringify(this.orderChange.flightDetail.returnFlight));
        sessionStorage.setItem(flightConstant.NEXT_FLIGHT, JSON.stringify(this.orderChange.flightDetail.nextFlights));
        const searchFlightForm: SearchFlightForm = new SearchFlightForm();
        searchFlightForm.adults = this.orderChange.flightDetail.travellers.adt;
        searchFlightForm.infants  = this.orderChange.flightDetail.travellers.inf;
        searchFlightForm.children  = this.orderChange.flightDetail.travellers.chd;
        sessionStorage.setItem(flightConstant.SEARCH_FLIGHTS, JSON.stringify(searchFlightForm));
        if(this.orderChange.flightDetail.departureFlight){
          sessionStorage.setItem(flightConstant.FLIGHT_TYPE,JSON.stringify(flightTypeValue.ONE_WAY));
        }
        if(this.orderChange.flightDetail.returnFlight){
          sessionStorage.setItem(flightConstant.FLIGHT_TYPE,JSON.stringify(flightTypeValue.ROUND_TRIP));
        }
        if(this.orderChange.flightDetail.nextFlights){
          sessionStorage.setItem(flightConstant.FLIGHT_TYPE,JSON.stringify(flightTypeValue.MULTI_CITY));
        }
      }
      if(this.servicesAvailable){
        this.servicesAvailable.paxSegmentList[0].paxSegmentID
         Object.keys(this.servicesAvailable.servicesList).forEach(key => {
          this.servicesOffers.push(this.servicesAvailable.servicesList[key]);
        });
        sessionStorage.setItem(flightConstant.FLIGHT_SEVICES_RES, JSON.stringify(this.servicesAvailable));
        }
      if (this.searchFlightForm && this.searchFlightForm.typeFlight) {
        this.typeFlight = this.searchFlightForm.typeFlight;
      } 
    });
  }

  reserve(){
    if(this.orderChange){
      sessionStorage.setItem(flightConstant.SELECTED_FLIGHT_SEVICES, JSON.stringify(this.selectedServiceList));
      this.route.navigate(["../cart"], {relativeTo: this.activatedRoute});
    }else{
    const serviceOfferReq = new FlightServicesOfferPriceReq();
    serviceOfferReq.selectedServices = this.selectedServiceList;
    serviceOfferReq.offerPriceReq =  this.offerPricesReq;
    serviceOfferReq.provider = this.provider;

    this.store.dispatch(
      new FlightListActions.ServiceOfferPriceFlightStart(serviceOfferReq)
    );
    this.route.navigate(["../flightSummary"], {relativeTo: this.activatedRoute});
    }
  }

  clickedOption(event, segment: any){
    this.selectedService = segment;
    if (event.target.checked) {
      this.selectedServiceList.push(this.selectedService);
    } else {
      let element = this.selectedServiceList.find(itm => itm === this.selectedService);
      if (element) this.selectedServiceList.splice(this.selectedServiceList.indexOf(element), 1);
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

}
