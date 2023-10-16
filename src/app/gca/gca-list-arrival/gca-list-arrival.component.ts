import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as GcaActions from '../store/gca.actions';
import * as fromApp from "../../store/app.reducer";
import { GcaListRes } from '../../model/gca/shopping/response/gca-list-res';
import { SearchGcaForm } from '../../model/gca/shopping/request/search-gca-form';
import { TerminalGca } from '../../model/gca/shopping/response/terminal-gca';
import { GcaQuoteReq } from '../../model/gca/quote/request/gca-quote-req';
import {ContactPoint, DepartureQuoteReq} from '../../model/gca/quote/request/departure-quote-req';
import { gcaConstant, gcaServiceField } from '../gca.constant';
import { ArrivalQuoteReq } from '../../model/gca/quote/request/arrival-quote-req';
import {AlertifyService} from '../../service/alertify.service';
import { GcaItemResult } from "src/app/model/gca/shopping/response/gca-item-result";
import { Bags, Meta } from '../../model/gca/common/meta';
import { Contacts } from '../../model/gca/common/contacts';
import { Email } from '../../model/gca/common/email';
import { Phone } from '../../model/gca/common/phone';
import { Address } from '../../model/gca/common/address';
import { Pax } from '../../model/gca/common/pax';
import { Passengers } from '../../model/gca/common/passengers';
import { Adult } from '../../model/gca/common/adult';
import { Details } from '../../model/gca/common/details';
import { Name } from '../../model/gca/common/name';
import { Service } from '../../model/gca/common/service';
import { GcaSearchDialogComponent } from '../gca-search-dialog/gca-search-dialog.component';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { DateTime } from '../date-time';
import { FieldReq } from 'src/app/model/gca/quote/request/field-req';
import { ServiceTerminalGca } from 'src/app/model/gca/shopping/response/service-terminal-gca';
import { SelectedTerminal } from 'src/app/model/gca/common/selected-terminal';

@Component({
  selector: 'app-gca-list-arrival',
  templateUrl: './gca-list-arrival.component.html',
  styleUrls: ['./gca-list-arrival.component.css']
})
export class GcaListArrivalComponent implements OnInit {
  @ViewChild('popoverRef',  {static: false}) private _popoverRef: PopoverDirective;
  time: Date;
  date: Date;
  dateTime: Date;
  isDateVisible: boolean = true;
  isMeridian: boolean = false;
  formSubmitError: boolean;
  minDate = new Date();

  searchGcaForm: SearchGcaForm;
  searchQuoteForm: GcaQuoteReq;
  gcaListRes: GcaListRes;
  terminalListArrival: TerminalGca[];
  terminalListArrivalView: TerminalGca[];
  gcaData: GcaItemResult;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchData: boolean = true;
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  isCollapsed: boolean[];

  adults: number;
  children: number;
  infants: number;
  meta: Meta;
  
  selectedDepartureServices: ServiceTerminalGca[];
  selectedDepartureTerminal: SelectedTerminal;

  selectedArrivalServices: ServiceTerminalGca[];
  selectedArrivalTerminal: SelectedTerminal;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.isCollapsed = [];
    this.selectedDepartureServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_SERVICES)) || [];
    this.selectedDepartureTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_TERMINAL));
    this.selectedArrivalServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_SERVICE)) || [];
    this.selectedArrivalTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_TERMINAL));
    this.meta = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER)) || null;
    if (this.meta) {
      this.adults = this.meta.adult;
      this.children = this.meta.child;
      this.infants = this.meta.infant;
    }
    this.store.select("gcaList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.searchGcaForm = data.searchGcaForm;
      this.gcaListRes = data.searchGcaResult;
      this.errorMes = data.errorMessage;
      if (this.gcaListRes && this.gcaListRes.result.data) {
        this.gcaData = this.gcaListRes.result;
        this.terminalListArrival = [];
        this.gcaListRes.result.data.forEach((data) => {
          if (data.iata === this.searchGcaForm.flights[0].arrival_airport.iata) {
            data.terminals.forEach((terminal) => {
              this.terminalListArrival.push(terminal);
            })
          }
        })
      } else {
        if (this.tryFetchData && !this.fetching && !this.gcaListRes) {
          this.fetchGcaList();
          this.tryFetchData = false;
        }
      }
      this.refreshData();
    });
  }
  refreshData() {
    if ( this.terminalListArrival && this.terminalListArrival.length > 0 ) {
     this.terminalListArrivalView = [...this.terminalListArrival];
     if(this.selectedArrivalTerminal){
      this.filterTerminal(this.selectedArrivalTerminal.terminalId);
    }
    }

    if (this.searchGcaForm && this.searchGcaForm.flights[0].departure_date) {
      this.date = this.time = this.dateTime = new Date(this.searchGcaForm.flights[0].departure_date);
    }
  }

  fetchGcaList() {
    this.store.dispatch(
      new GcaActions.SearchGcaStart({data: this.searchGcaForm})
    );
  }

  openModalWithComponent() {
    const initialState = {
      searchGcaForm: Object.assign({}, this.searchGcaForm),
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(GcaSearchDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      this.searchGcaForm = res;
      this.fetchGcaList();
      this.route.navigate(["../gcaListDeparture"], {
        relativeTo: this.activatedRoute,
      });
    });
  }

  //
  dateSelectionDone() {
    this.isDateVisible = false;
  }

  updateDate() {
    if (this.date) {
      this.dateTime = DateTime.getDateTime(this.date, this.time);
    }
    if (!this.time) {
      this.time = this.date;
    }
  }

  updateTime() {
    if (this.time) {
      this.dateTime = DateTime.getDateTime(this.date, this.time);
    }
  }

  close() {
    this._popoverRef.hide();
  }

  now() {
    this.dateTime = DateTime.now(this.date);
    this.time = this.dateTime;
  }

  today() {
    this.date = this.time = new Date();
    this.dateTime = DateTime.now(this.date);
  }

  clear() {
    //https://valor-software.com/ngx-bootstrap/#/timepicker#dynamic
    //Check component DemoTimepickerDynamicComponent  -> clear() method;  void 0 evaluates to undefined
    this.time = void 0;
    this.date = void 0;
    this.dateTime = void 0;
  }
  //

  
  addService(terminalId: string, selectedService: any) {
    if (!this.selectedArrivalTerminal) {
      this.filterTerminal(terminalId);
    }
    this.terminalListArrival.forEach(t => {
      if(t.terminal_id === terminalId){
        const selectedTerminal = new SelectedTerminal();
        selectedTerminal.terminalId = terminalId
        selectedTerminal.terminalName = t.terminal_name;
        this.selectedArrivalTerminal = selectedTerminal;
      }
    })
    if (this.selectedArrivalServices.indexOf(selectedService) === -1) {
      this.selectedArrivalServices.push(selectedService);
    }
  }

  removeService(index: number) {
    this.selectedArrivalServices.splice(index, 1);
    if (this.selectedArrivalServices.length === 0) {
      this.selectedArrivalTerminal = null;
      this.refreshData();
    }
  }

  filterTerminal(terminalId: string) {
    this.terminalListArrivalView = this.terminalListArrival.filter(
      (t) => t.terminal_id === terminalId
    );
  }


  buildData() :  Pax {
    let paxReq: Pax = new Pax();
    let passengers = new Passengers();
    let adult = new Adult();
    let details = new Details();
    let contacts = new Contacts();
    let email = new Email();
    let phone = new Phone();
    let address = new Address();
    email.email = "email@email.com";
    email.type = "Main";
    phone.phone = "+18666612345";
    phone.name = "Head Office";
    phone.type = "Office";
    address.country = "United Kingdom";
    address.postal_code = "LN223 2323";
    address.state = "London";
    address.city = "Hethrow";
    address.streets = ["No 221/1, Baker'\\''s Street"];
    contacts.address = address;
    contacts.phones = [];
    contacts.phones.push(phone);
    contacts.emails = [];
    contacts.emails.push(email);
    details.name = new Name("Mr.", "John", "Doe");
    details.date_of_birth = "1989-02-14";
    details.signage = "John Doe";
    details.comments = "First time traveller.";
    details.passport_no = "N32343423";
    details.contacts = contacts;
    adult.lead = true;
    adult.pnr = "flotravel";
    adult.class = "First";
    adult.details = details;
    passengers.adult = [];
    passengers.adult.push(adult);
    passengers.child = [];
    passengers.infant = [];
    paxReq.meta = new Meta();
    paxReq.meta.adult = this.meta.adult;
    paxReq.meta.child = this.meta.child;
    paxReq.meta.infant = this.meta.infant;
    const bags = new Bags(this.meta.bags.small, this.meta.bags.medium, this.meta.bags.large)
    paxReq.meta.bags = bags;
    paxReq.passengers = passengers;
    return paxReq;
  }

  continueBooking() {
    sessionStorage.setItem(gcaConstant.SELECTED_ARRIVAL_SERVICE, JSON.stringify(this.selectedArrivalServices));
    sessionStorage.setItem(gcaConstant.SELECTED_ARRIVAL_TERMINAL, JSON.stringify(this.selectedArrivalTerminal));

    this.searchQuoteForm = new GcaQuoteReq();
    let departureQuoteReq: DepartureQuoteReq = JSON.parse(sessionStorage.getItem(gcaConstant.DEPARTURE_QUOTE_REQ));
    let arrivalQuoteReq = new ArrivalQuoteReq();
    arrivalQuoteReq.arrival_date = this.datepipe.transform(this.dateTime, "yyyy-MM-ddTHH:MM:ss.000");
    arrivalQuoteReq.meeting_date = this.datepipe.transform(this.dateTime, "yyyy-MM-ddTHH:MM:ss.000");
    arrivalQuoteReq.terminal_id = this.selectedArrivalTerminal? this.selectedArrivalTerminal.terminalId : this.terminalListArrival[0].terminal_id;
    arrivalQuoteReq.connection = true;
    arrivalQuoteReq.contact_point = new ContactPoint();
    arrivalQuoteReq.contact_point.name = "John";
    arrivalQuoteReq.contact_point.contact = "+251911947669";
    arrivalQuoteReq.special_notes = "Need translator";
    arrivalQuoteReq.services = [];
    if(this.selectedArrivalServices.length > 0){
      this.selectedArrivalServices.forEach(selectedService => {
        const arrivalService = new Service(selectedService.service_id);
        arrivalService.fields =  [];
        (selectedService.fields as Array<any>).forEach(
          fields => {
            if(fields.name === gcaServiceField.pax){
              const field = new FieldReq();
              field.name = gcaServiceField.pax;
              field.value = this.meta.adult + this.meta.child + this.meta.infant;
              arrivalService.fields.push(field);
            }
            if(fields.name === gcaServiceField.bags){
              const field = new FieldReq();
              field.name = gcaServiceField.bags;
              field.value = this.meta.bags.large + this.meta.bags.medium + this.meta.bags.small;
              arrivalService.fields.push(field);
            }
          }
        )
        arrivalQuoteReq.services.push(arrivalService);
      })
    }
    this.searchQuoteForm.departure = departureQuoteReq;
    this.searchQuoteForm.arrival = arrivalQuoteReq;
    //build data for quote request
    this.searchQuoteForm.currency =  "USD";
    this.searchQuoteForm.flightNumber = this.searchGcaForm.flights[0].flight_no;
    this.searchQuoteForm.promo_code = "";
    this.searchQuoteForm.pax = this.buildData();
    const validSearchQuote = this.validQuoteReq(this.searchQuoteForm);
    if(validSearchQuote){
      sessionStorage.setItem(gcaConstant.SEARCH_QUOTE, JSON.stringify(this.searchQuoteForm));
      this.store.dispatch(new GcaActions.CreateGcaQuoteStart({data: this.searchQuoteForm}));
      this.route.navigate(["../gcaSummary"], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  validQuoteReq(req: GcaQuoteReq): boolean{
    const departureServiceLength = req.departure.services.length;
    const arrivalServiceLength = req.arrival.services.length;
    if((departureServiceLength + arrivalServiceLength) === 0){
      this.alertify.error("Need to select at least one service");
      return false;
    }
    return true;
  }
}

