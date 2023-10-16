import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../../../../store/app.reducer";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { QuoteItem } from "src/app/model/traceme/shopping/quote-item";
import { tracemeConstant } from "src/app/traceme/traceme.constant";
import { SearchGcaForm } from "src/app/model/gca/shopping/request/search-gca-form";
import { GcaListRes } from "src/app/model/gca/shopping/response/gca-list-res";
import { TerminalGca } from "src/app/model/gca/shopping/response/terminal-gca";
import { GcaItemResult } from "src/app/model/gca/shopping/response/gca-item-result";
import { SelectedFlight } from "src/app/model/flight/selected-flight";
import { ServiceTerminalGca } from "src/app/model/gca/shopping/response/service-terminal-gca";
import { flightConstant } from "src/app/flight/flight.constant";
import { GcaQuoteReq } from "src/app/model/gca/quote/request/gca-quote-req";
import { SearchFlightForm } from "src/app/model/flight/search-flight-form";
import { ArrivalQuoteReq } from "src/app/model/gca/quote/request/arrival-quote-req";
import { ContactPoint, DepartureQuoteReq } from "src/app/model/gca/quote/request/departure-quote-req";
import { DatePipe } from "@angular/common";
import { Service } from "src/app/model/gca/common/service";
import { gcaConstant, gcaServiceField } from "src/app/gca/gca.constant";
import { FieldReq } from "src/app/model/gca/quote/request/field-req";
import { Bags, Meta } from "src/app/model/gca/common/meta";
import { AlertifyService } from "src/app/service/alertify.service";
import { Name } from "src/app/model/gca/common/name";
import { Pax } from "src/app/model/gca/common/pax";
import { Passengers } from "src/app/model/gca/common/passengers";
import { Adult } from "src/app/model/gca/common/adult";
import { Details } from "src/app/model/gca/common/details";
import { Contacts } from "src/app/model/gca/common/contacts";
import { Email } from "src/app/model/gca/common/email";
import { Phone } from "src/app/model/gca/common/phone";
import { Address } from "src/app/model/gca/common/address";
import { GcaService } from "src/app/service/gca/gca.service";
import { QuoteCreatedRes } from "src/app/model/gca/quote/response/quote-created-res";

@Component({
  selector: 'app-add-on-gca',
  templateUrl: './add-on-gca.component.html',
  styleUrls: ['./add-on-gca.component.css']
})
export class AddOnGcaComponent implements OnInit {
  @Input()
  currency: string;
  @Input()
  departureFlight: SelectedFlight;
  @Input()
  returnFlight: SelectedFlight;
  @Input()
  searchFlightForm: SearchFlightForm;
  @Output()
  gcaBookingItem: EventEmitter<QuoteCreatedRes> = new EventEmitter<QuoteCreatedRes>();
  @Output()
  bookingId: EventEmitter<string> = new EventEmitter<string>();
  addonGcaForm: FormGroup;

  searchData: SearchGcaForm;
  searchListResult: GcaListRes;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  quotes: QuoteItem[];
  terminalListDeparture: TerminalGca[];
  terminalListArrival: TerminalGca[];
  selectedArrivalServices: ServiceTerminalGca[];
  selectedDepartureServices: ServiceTerminalGca[];
  gcaData: GcaItemResult;
  productExist: boolean;

  quoteSelect: QuoteItem;

  checkingPrice: boolean;
  checkingPriceSuccessful: boolean;
  searchQuoteForm: GcaQuoteReq;
  meta: Meta;
  adults: number;
  children: number;
  infants: number;

  quoteCreateRes: QuoteCreatedRes;
  constructor(private store: Store<fromApp.AppState>,
              public datePipe: DatePipe,
              private alertify: AlertifyService,
              private gcaService: GcaService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    // this.updateRefundChange();
    this.terminalListDeparture = [];
    this.terminalListArrival = [];
    this.selectedDepartureServices = [];
    this.selectedArrivalServices = [];
    this.checkingPrice = false;
    this.checkingPriceSuccessful = false;
    if (this.meta) {
      this.adults = this.meta.adult;
      this.children = this.meta.child;
      this.infants = this.meta.infant;
    }
    this.store.select("gcaList").subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchData = data.searchGcaForm;
      this.searchListResult = data.searchGcaResult;
      if (this.searchListResult) {
        this.gcaData = this.searchListResult.result;
        this.searchListResult.result.data.forEach((item) => {
          if (item.iata === this.searchData.flights[0].departure_airport.iata ) {
            item.terminals.forEach((terminal) => {
              this.terminalListDeparture.push(terminal);
            });
          } else {
            item.terminals.forEach((terminal) => {
              this.terminalListArrival.push(terminal);
            });
          }
        });
        this.refresh();
      }
      if (this.gcaData.data.length > 0) {
        this.productExist = true;
      }
    });
  }
  refresh() {
    this.filterTerminal();
    this.updateFormData();
  }

  filterTerminal() {
    // if(this.departureFlight){
    //   if(this.departureFlight.flight.flightSegments.length > 1){
    //     const departureTerminal = this.departureFlight.flight.flightSegments[0].depTerminal;
    //     this.terminalListDeparture = this.terminalListDeparture.filter(terminal => terminal.terminal_name.indexOf(departureTerminal) > 0)
    //     const returnTerminal = this.departureFlight.flight.flightSegments[1].arrTerminal;
    //     if(returnTerminal){
    //       this.terminalListArrival = this.terminalListArrival.filter(terminal => terminal.terminal_name.indexOf(returnTerminal) > 0)
    //     } else {
    //       this.terminalListArrival = [this.terminalListArrival[0]]
    //     }
    //   } else {
    //     const departureTerminal = this.departureFlight.flight.flightSegments[0].depTerminal;
    //     this.terminalListDeparture = this.terminalListDeparture.filter(terminal => terminal.terminal_name.indexOf(departureTerminal) > 0)
    //     const returnTerminal = this.departureFlight.flight.flightSegments[0].arrTerminal;
    //     if(returnTerminal){
    //       this.terminalListArrival = this.terminalListArrival.filter(terminal => terminal.terminal_name.indexOf(returnTerminal) > 0)
    //     } else {
    //       this.terminalListArrival = [this.terminalListArrival[0]]
    //     }
    //   }
    // }
    if (this.departureFlight) {
      const lengthOfDepTerminal = this.terminalListDeparture.length;
      const lengthOfArrTerminal = this.terminalListArrival.length;
      const indexOfDepTerminalRand = Math.floor(Math.random() * lengthOfDepTerminal);
      const indexOfArrTerminalRand = Math.floor(Math.random() * lengthOfArrTerminal);
      console.log(indexOfDepTerminalRand);
      this.terminalListDeparture = [this.terminalListDeparture[indexOfDepTerminalRand]];
      this.terminalListArrival = [this.terminalListArrival[indexOfArrTerminalRand]];
    }
  }

  initForm() {
    this.addonGcaForm = this.formBuilder.group({
      departureService: this.formBuilder.array([]),
      arrivalService: this.formBuilder.array([])
    });
  }
  updateFormData() {
    this.addDepartureService();
    this.addArrivalService();
  }

  addDepartureService() {
    this.terminalListDeparture[0].services.forEach(() => this.departureFormArray.push(new FormControl(false)));
  }

  addArrivalService() {
    this.terminalListArrival[0].services.forEach(() => this.arrivalFormArray.push(new FormControl(false)));
  }

  get departureFormArray() {
    return this.addonGcaForm.controls.departureService as FormArray;
  }

  get arrivalFormArray() {
    return this.addonGcaForm.controls.arrivalService as FormArray;
  }


  updateBookingSelection() {
    this.getSelectedService();
    if(this.selectedArrivalServices.length === 0 && this.selectedDepartureServices.length === 0){
      this.bookingId.emit(null);
    }
    if(this.quoteCreateRes){
      this.bookingId.emit(this.quoteCreateRes.gcaQuoteResult.id);
      this.gcaBookingItem.emit(this.quoteCreateRes);
    } else {
      this.bookingId.emit(null);
      this.gcaBookingItem.emit(null);
    }
  }
  removeGca(){
    this.bookingId.emit(null);
    this.gcaBookingItem.emit(null);
  }

  getSelectedService(){
    this.selectedDepartureServices=[];
    this.selectedArrivalServices=[];
    const d = this.addonGcaForm.value;
    (d.departureService as Array<boolean>).forEach(
      (departure, index) => {
        if(departure){
          this.selectedDepartureServices.push(this.terminalListDeparture[0].services[index])
        }
      }
    );
    (d.arrivalService as Array<boolean>).forEach(
      (arrival, index) => {
        if(arrival){
          this.selectedArrivalServices.push(this.terminalListArrival[0].services[index])
        }
      }
    )
    sessionStorage.setItem(flightConstant.ADD_ON_GCA_DEPARTURE_TERMINAL, JSON.stringify(this.terminalListDeparture[0]));
    sessionStorage.setItem(flightConstant.ADD_ON_GCA_ARRIAVEL_TERMINAL, JSON.stringify(this.terminalListArrival[0]));
    sessionStorage.setItem(flightConstant.ADD_ON_GCA_DEPARTURE_SERVICES, JSON.stringify(this.selectedDepartureServices));
    sessionStorage.setItem(flightConstant.ADD_ON_GCA_ARRIVAL_SERVICES, JSON.stringify(this.selectedArrivalServices));

    this.bookingGcaService();
  }

  bookingGcaService(){
    this.getQuoteData();
    this.checkingPrice = true;
    this.gcaService.getQuote(this.searchQuoteForm).subscribe(
      res => {
        this.checkingPrice = false;
        this.checkingPriceSuccessful = true;
        this.quoteCreateRes = res;
      }, e => {
        console.log(e);
        this.checkingPrice = false;
        this.checkingPriceSuccessful = false;
      }
    )
  }

  getQuoteData() {
    this.searchQuoteForm = new GcaQuoteReq();
    let departureQuoteReq: DepartureQuoteReq = this.getDepartureQuoteReq();
    let arrivalQuoteReq = new ArrivalQuoteReq();
    arrivalQuoteReq.arrival_date = this.datePipe.transform(this.searchFlightForm.departuring, "yyyy-MM-ddTHH:MM:ss.000");
    arrivalQuoteReq.meeting_date = this.datePipe.transform(this.searchFlightForm.departuring, "yyyy-MM-ddTHH:MM:ss.000");
    arrivalQuoteReq.terminal_id = this.terminalListArrival[0].terminal_id;
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
              field.value = this.searchFlightForm.adults + this.searchFlightForm.children;
              arrivalService.fields.push(field);
            }
            if(fields.name === gcaServiceField.bags){
              const field = new FieldReq();
              field.name = gcaServiceField.bags;
              field.value = 1;
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
    // this.searchQuoteForm.flightNumber = this.departureFlight.flight.flightSegments[0].flightNumber;
    this.searchQuoteForm.flightNumber = 'BA123';
    this.searchQuoteForm.promo_code = "";
    this.searchQuoteForm.pax = this.buildData();
    const validSearchQuote = this.validQuoteReq(this.searchQuoteForm);
    if(validSearchQuote){
      sessionStorage.setItem(gcaConstant.SEARCH_QUOTE, JSON.stringify(this.searchQuoteForm));
    } else {
      this.quoteCreateRes = null;
    }
  }
  getDepartureQuoteReq(): DepartureQuoteReq {
    let departureQuoteReq = new DepartureQuoteReq();
    departureQuoteReq.departure_date = this.datePipe.transform(this.searchFlightForm.departuring, "yyyy-MM-ddTHH:MM:ss.000");
    departureQuoteReq.meeting_date = this.datePipe.transform(this.searchFlightForm.departuring, "yyyy-MM-ddTHH:MM:ss.000");
    departureQuoteReq.terminal_id = this.terminalListDeparture[0].terminal_id;
    departureQuoteReq.connection = false;
    departureQuoteReq.contact_point = new ContactPoint();
    departureQuoteReq.contact_point.name = "John";
    departureQuoteReq.contact_point.contact = "+251911947669";
    departureQuoteReq.special_notes = "Need translator";
    departureQuoteReq.services = [];
    if(this.selectedDepartureServices.length > 0){
      this.selectedDepartureServices.forEach(selectedService => {
        const departureService = new Service(selectedService.service_id);
        departureService.fields =  [];
        (selectedService.fields as Array<any>).forEach(
          fields => {
            if(fields.name === gcaServiceField.pax){
              const field = new FieldReq();
              field.name = gcaServiceField.pax;
              field.value = this.searchFlightForm.adults + this.searchFlightForm.children;
              departureService.fields.push(field);
            }
            if(fields.name === gcaServiceField.bags){
              const field = new FieldReq();
              field.name = gcaServiceField.bags;
              field.value = 1;
              departureService.fields.push(field);
            }
          }
        )
        departureQuoteReq.services.push(departureService);
      })
    }
    return departureQuoteReq;
  }
  validQuoteReq(req: GcaQuoteReq): boolean{
    const departureServiceLength = req.departure.services.length;
    const arrivalServiceLength = req.arrival.services.length;
    if((departureServiceLength + arrivalServiceLength) === 0){
      // this.alertify.error("Need to select at least one service");
      return false;
    }
    return true;
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
    paxReq.meta.adult = 1;
    paxReq.meta.child = 0;
    paxReq.meta.infant = 0;
    const bags = new Bags(0, 0, 1)
    paxReq.meta.bags = bags;
    paxReq.passengers = passengers;
    return paxReq;
  }
}
