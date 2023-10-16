import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as GcaActions from '../store/gca.actions';
import * as fromApp from '../../store/app.reducer';
import { GcaListRes } from '../../model/gca/shopping/response/gca-list-res';
import { SearchGcaForm } from '../../model/gca/shopping/request/search-gca-form';
import { TerminalGca } from '../../model/gca/shopping/response/terminal-gca';
import { ContactPoint, DepartureQuoteReq } from '../../model/gca/quote/request/departure-quote-req';
import { gcaConstant, gcaServiceField } from '../gca.constant';
import { AlertifyService } from '../../service/alertify.service';
import { GcaItemResult } from 'src/app/model/gca/shopping/response/gca-item-result';
import { Meta } from '../../model/gca/common/meta';
import { Service } from '../../model/gca/common/service';
import { GcaSearchDialogComponent } from '../gca-search-dialog/gca-search-dialog.component';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import {DateTime} from '../date-time';
import { FieldReq } from 'src/app/model/gca/quote/request/field-req';
import { ServiceTerminalGca } from 'src/app/model/gca/shopping/response/service-terminal-gca';
import { SelectedTerminal } from 'src/app/model/gca/common/selected-terminal';

@Component({
  selector: 'app-gca-list-departure',
  templateUrl: './gca-list-departure.component.html',
  styleUrls: ['./gca-list-departure.component.css'],
})
export class GcaListDepartureComponent implements OnInit {
  @ViewChild('popoverRef', { static: false })
  private _popoverRef: PopoverDirective;
  time: Date;
  date: Date;
  dateTime: Date;
  isDateVisible = true;
  isMeridian = false;
  formSubmitError: boolean;
  minDate = new Date();

  isCollapsed: boolean[];
  searchGcaForm: SearchGcaForm;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  tryFetchData = true;
  gcaListRes: GcaListRes;
  terminalListDeparture: TerminalGca[];
  terminalListDepartureView: TerminalGca[];
  gcaData: GcaItemResult;

  adults: number;
  children: number;
  infants: number;
  meta: Meta;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  selectedDepartureServices: ServiceTerminalGca[];
  selectedDepartureTerminal: SelectedTerminal;

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
    this.meta = JSON.parse(sessionStorage.getItem(gcaConstant.GCA_PASSENGER_NUMBER));
    if (this.meta) {
      this.adults = this.meta.adult;
      this.children = this.meta.child;
      this.infants = this.meta.infant;
    }

    this.store.select('gcaList').subscribe((d) => {
      this.fetching = d.loading;
      this.fetchFailed = d.failure;
      this.searchGcaForm = d.searchGcaForm;
      this.gcaListRes = d.searchGcaResult;
      this.errorMes = d.errorMessage;
      if (this.gcaListRes && this.gcaListRes.result.data) {
        this.gcaData = this.gcaListRes.result;
        this.terminalListDeparture = [];
        this.gcaListRes.result.data.forEach((item) => {
          if (
            item.iata === this.searchGcaForm.flights[0].departure_airport.iata
          ) {
            item.terminals.forEach((terminal) => {
              this.terminalListDeparture.push(terminal);
            });
          }
        });
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
    if (this.terminalListDeparture && this.terminalListDeparture.length > 0) {
      this.terminalListDepartureView = [...this.terminalListDeparture];
      if (this.selectedDepartureTerminal) {
        this.filterTerminal(this.selectedDepartureTerminal.terminalId);
      }
    }

    if (this.searchGcaForm && this.searchGcaForm.flights[0].departure_date) {
      // this.departingDate = new Date(this.searchGcaForm.flights[0].departure_date);
      // this.date =
      //   this.time =
        this.dateTime =
          new Date(this.searchGcaForm.flights[0].departure_date);
      // this.dateBefore = new Date(
      //   new Date(this.searchGcaForm.flights[0].departure_date).setDate(
      //     this.departingDate.getDate() - 1
      //   )
      // );
      // this.dateAfter = new Date(
      //   new Date(this.searchGcaForm.flights[0].departure_date).setDate(
      //     this.departingDate.getDate() + 1
      //   )
      // );
    }
  }

  fetchGcaList() {
    this.store.dispatch(
      new GcaActions.SearchGcaStart({ data: this.searchGcaForm })
    );
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

  openModalWithComponent() {
    const initialState = {
      searchGcaForm: Object.assign({}, this.searchGcaForm),
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      GcaSearchDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res) => {
      this.searchGcaForm = res;
      this.fetchGcaList();
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
    // https://valor-software.com/ngx-bootstrap/#/timepicker#dynamic
    // Check component DemoTimepickerDynamicComponent  -> clear() method;  void 0 evaluates to undefined
    this.time = void 0;
    this.date = void 0;
    this.dateTime = void 0;
  }
  //

  addService(terminalId: string, selectedService: any) {
    if (!this.selectedDepartureTerminal) {
      this.filterTerminal(terminalId);
    }
    this.terminalListDeparture.forEach(t => {
      if (t.terminal_id === terminalId) {
        const selectedTerminal = new SelectedTerminal();
        selectedTerminal.terminalId = terminalId;
        selectedTerminal.terminalName = t.terminal_name;
        this.selectedDepartureTerminal = selectedTerminal;
      }
    });
    if (this.selectedDepartureServices.indexOf(selectedService) === -1) {
      this.selectedDepartureServices.push(selectedService);
    }
  }

  removeService(index: number) {
    this.selectedDepartureServices.splice(index, 1);
    if (this.selectedDepartureServices.length === 0) {
      this.selectedDepartureTerminal = null;
      this.refreshData();
    }
  }

  filterTerminal(terminalId: string) {
    this.terminalListDepartureView = this.terminalListDeparture.filter(
      (t) => t.terminal_id === terminalId
    );
  }

  continueBooking() {
    sessionStorage.setItem(gcaConstant.SELECTED_DEPARTURE_SERVICES, JSON.stringify(this.selectedDepartureServices));
    sessionStorage.setItem(gcaConstant.SELECTED_DEPARTURE_TERMINAL, JSON.stringify(this.selectedDepartureTerminal));
    const departureQuoteReq: DepartureQuoteReq = new DepartureQuoteReq();
    departureQuoteReq.departure_date = this.datepipe.transform(
      this.dateTime,
      'yyyy-MM-ddTHH:MM:ss.000'
    );
    const meetingDateTime: Date = this.dateTime;
    meetingDateTime.setHours(meetingDateTime.getHours() - 2);
    departureQuoteReq.meeting_date = this.datepipe.transform(
      meetingDateTime,
      'yyyy-MM-ddTHH:MM:ss.000'
    );
    departureQuoteReq.terminal_id = this.selectedDepartureTerminal ? this.selectedDepartureTerminal.terminalId :
      this.terminalListDeparture[0].terminal_id;
    departureQuoteReq.connection = false;
    departureQuoteReq.contact_point = new ContactPoint();
    departureQuoteReq.contact_point.name = 'John';
    departureQuoteReq.contact_point.contact = '+251911947669';
    departureQuoteReq.special_notes = 'Need translator';
    departureQuoteReq.services = [];
    if (this.selectedDepartureServices.length > 0) {
      this.selectedDepartureServices.forEach((selectedService) => {
        const departureService = new Service(selectedService.service_id);
        departureService.fields = [];
        (selectedService.fields as Array<any>).forEach((fields) => {
          if (fields.name === gcaServiceField.pax) {
            const field = new FieldReq();
            field.name = gcaServiceField.pax;
            field.value = this.meta.adult + this.meta.child + this.meta.infant;
            departureService.fields.push(field);
          }
          if (fields.name === gcaServiceField.bags) {
            const field = new FieldReq();
            field.name = gcaServiceField.bags;
            field.value =
              this.meta.bags.large +
              this.meta.bags.medium +
              this.meta.bags.small;
            departureService.fields.push(field);
          }
        });
        departureQuoteReq.services.push(departureService);
      });
    }
    console.log(departureQuoteReq);
    sessionStorage.setItem(
      gcaConstant.DEPARTURE_QUOTE_REQ,
      JSON.stringify(departureQuoteReq)
    );
    this.route.navigate(['../gcaListArrival'], {
      relativeTo: this.activatedRoute,
    });
  }
}

