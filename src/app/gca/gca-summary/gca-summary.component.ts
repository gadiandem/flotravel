import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as GcaActions  from '../store/gca.actions';
import * as fromApp from "../../store/app.reducer";
import { gcaConstant } from '../gca.constant';
import {GcaQuoteReq} from '../../model/gca/quote/request/gca-quote-req';
import {SearchGcaForm} from '../../model/gca/shopping/request/search-gca-form';
import {AlertifyService} from '../../service/alertify.service';
import {QuoteCreatedRes} from '../../model/gca/quote/response/quote-created-res';
import { GcaItemResult } from "src/app/model/gca/shopping/response/gca-item-result";
import { GcaListRes } from "src/app/model/gca/shopping/response/gca-list-res";
import {Meta} from '../../model/gca/common/meta';
import { SelectedTerminal } from "src/app/model/gca/common/selected-terminal";
import { ServiceTerminalGca } from "src/app/model/gca/shopping/response/service-terminal-gca";

@Component({
  selector: 'app-gca-summary',
  templateUrl: './gca-summary.component.html',
  styleUrls: ['./gca-summary.component.css']
})
export class GcaSummaryComponent implements OnInit {
  searchQuoteForm: GcaQuoteReq;
  searchFormGca: SearchGcaForm;
  quoteCreateRes: QuoteCreatedRes;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchData: boolean = true;
  isCollapsed: boolean[];
  currency: string;
  bookingId: string;
  adults: number;
  children: number;
  infants: number;
  metaReq: Meta;
  gcaListRes: GcaListRes;
  gcaData: GcaItemResult;
  date: Date = new Date();

  selectedDepartureServices: ServiceTerminalGca[];
  selectedDepartureTerminal: SelectedTerminal;

  selectedArrivalServices: ServiceTerminalGca[];
  selectedArrivalTerminal: SelectedTerminal;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.isCollapsed = [true , true];
    this.selectedDepartureServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_SERVICES)) || [];
    this.selectedDepartureTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_TERMINAL));
    this.selectedArrivalServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_SERVICE)) || [];
    this.selectedArrivalTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_TERMINAL));
    this.searchQuoteForm = JSON.parse(sessionStorage.getItem(gcaConstant.SEARCH_QUOTE)) || null;
    if (this.searchQuoteForm == null) {
      this.route.navigate(["/"]);
    }
    this.metaReq = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER)) || null;
    if (this.metaReq) {
      this.adults = this.metaReq.adult;
      this.children = this.metaReq.child;
      this.infants = this.metaReq.infant;
    } else {
      this.route.navigate(["/"]);
    }
    this.store.select("gcaList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.quoteCreateRes = data.gcaQuoteResult;
      this.searchFormGca = data.searchGcaForm;
      this.gcaListRes = data.searchGcaResult;
      if (this.gcaListRes && this.gcaListRes.result.data) {
        this.gcaData = this.gcaListRes.result;
      }
      if (!this.quoteCreateRes && !this.fetching ) {
        if(this.tryFetchData){
          this.store.dispatch(new GcaActions.CreateGcaQuoteStart({data: this.searchQuoteForm}));
          this.tryFetchData = false;
        }
      }
      if(this.quoteCreateRes){
        this.bookingId = this.quoteCreateRes.gcaQuoteResult.id;
      }
      if (this.searchFormGca == null) {
        this.searchFormGca = JSON.parse(
          sessionStorage.getItem(gcaConstant.SEARCH_GCA)
        );
        if (this.searchFormGca == null) {
          this.route.navigate(["/"]);
        }
      }
    });
  }

  // onSortChange(type: string) {
  //   console.log(type);
  //   switch (type) {
  //     case "priceIncrease":
  //       this.alertify.warning(`Price Increase currently not support`);
  //       break;
  //     case "priceDecrease":
  //       this.alertify.warning(`Price Decrease currently not support`);
  //       break;
  //     case "popularity":
  //       // this.ratingStar.threeStar++;
  //       this.alertify.warning(`Popularity currently not support`);
  //       break;
  //     case "new":
  //       this.alertify.warning(`Newest currently not support`);
  //       break;
  //   }
  // }

  goToPayment() {
    // sessionStorage.setItem('totalPrice', this.totalTripPrice.toString());
    sessionStorage.setItem(gcaConstant.QUOTE_BOOKING_ID, this.bookingId);
    this.route.navigate(["/gca/cart"]);
  }
}

