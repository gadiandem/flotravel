import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlightBookingHistoryService } from '../../service/flight/flight-history.service';
import { UserDetail } from '../../model/auth/user/user-detail';
import { FlocashPaymentFlight } from '../../model/flight/history/flocash-payment-flight';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../../service/alertify.service';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { flightConstant, orderChangeType } from '../flight.constant';
import * as FlightListActions from '../store/flight-list.actions';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { OrderExchangeReq } from 'src/app/model/flight/order-exchange-req';
import { FlightServiceReq } from 'src/app/model/flight/services/service-request';
import { appConstant } from 'src/app/app.constant';
import { map } from 'rxjs/operators';
import { PassegerInfo } from 'src/app/model/flight/payment-info/passeger.info';

@Component({
  selector: 'app-flight-modify-booking',
  templateUrl: './flight-modify-booking.component.html',
  styleUrls: ['./flight-modify-booking.component.css']
})
export class FlightModifyBookingComponent implements OnInit {
  bookingDetail: FlocashPaymentFlight;
  bookingId: string;
  isLoading = true;
  user: UserDetail;
  currency: string;
  typeFlight: string = 'Oneway';
  isCollapsed: boolean;
  formSubmitError: boolean;
  cancellationForm: FormGroup;
  customerInfos: PassegerInfo[];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightHistoryService: FlightBookingHistoryService,
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.initForm();
    this.formSubmitError = false;
    this.isCollapsed = true;
    this.bookingDetail = new FlocashPaymentFlight();
    this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      if (user) {
        this.user = user;
        sessionStorage.setItem(appConstant.ACCOUNT_INFO, JSON.stringify(user));
      }
        });
    let flightBookingDetail: FlocashPaymentFlight = JSON.parse(sessionStorage.getItem('flightBookingDetail'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['flightKey'] || flightBookingDetail.id;
      const userId = this.user.id;
      if (userId != null) {
        this.flightHistoryService.flightHistoryBookingDetail(this.bookingId).subscribe(
          (res: FlocashPaymentFlight) => {
            this.bookingDetail = res;
            if(res){
              sessionStorage.setItem(flightConstant.CUSTOMERS_INFO,JSON.stringify(res.customerInfos));
            }
            if (res != null) {
              this.currency = res.currencyName;
              if (res.returnFlight) {
                this.typeFlight = 'Round Trip'
              }
              if (res.nextFlights) {
                this.typeFlight = 'Multi City'
              }
              this.isLoading = false;
            }
            setTimeout(() => {
              this.isLoading = false;
            }, 2000);
          }, e => {
            this.isLoading = false;
            console.log(e);
          }
        );
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  initForm() {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }

  showStatementModify() {
    this.isCollapsed = !this.isCollapsed;
  }


  fullOrder() {
    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.flightDetail = this.bookingDetail;
    bookingData.orderId = this.bookingDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.FULL_CHANGE;
    bookingData.orderItemRef = this.bookingDetail.orderItemID;
    bookingData.provider = 5;
    sessionStorage.setItem(flightConstant.FLIGHT_CHANGE, JSON.stringify(bookingData));
    this.router.navigate(['/dashboard/flight-reshop']);
  }

  partialChange() {

    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.flightDetail = this.bookingDetail;
    bookingData.orderId = this.bookingDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.PARTIAL_CHANGE;
    bookingData.orderItemRef = this.bookingDetail.orderItemID;
    bookingData.provider = 5;
    sessionStorage.setItem(flightConstant.FLIGHT_CHANGE, JSON.stringify(bookingData));
    this.router.navigate(['/dashboard/flight-reshop']);
  }


  addService() {
    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.orderId = this.bookingDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.ADD_SERVICE;
    bookingData.orderItemRef = this.bookingDetail.orderItemID;
    bookingData.provider = 5;
    bookingData.flightDetail = this.bookingDetail;
    const services: FlightServiceReq = new FlightServiceReq();
    services.offerID = this.bookingDetail.orderIdOfNDC;
    services.ownerCode = this.bookingDetail.ownerOfNDC;
    services.offerItemID = this.bookingDetail.orderItemID;
    services.provider = 5;
    services.orderChange = bookingData;
    sessionStorage.setItem(flightConstant.FLIGHT_CHANGE, JSON.stringify(bookingData));
    this.store.dispatch(new FlightListActions.SearchFlightServicesStart(services));
    this.router.navigate(['flight/flight-services']);

  }

  deferredPaymentChange() {
    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.orderId = this.bookingDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.DEFERRED_PAYMENT;
    bookingData.orderItemRef = this.bookingDetail.orderItemID;
    bookingData.provider = 5;
    sessionStorage.setItem(flightConstant.FLIGHT_CHANGE, JSON.stringify(bookingData));
    this.router.navigate(['/dashboard/flight-reshop']);
  }


  orderSplit() {
    const bookingData: OrderChangeReq = new OrderChangeReq();
    bookingData.orderId = this.bookingDetail.orderIdOfNDC;
    bookingData.changeType = orderChangeType.ORDER_SPLIT;
    bookingData.orderItemRef = this.bookingDetail.orderItemID;
    bookingData.provider = 5;

    const exchageData: OrderExchangeReq = new OrderExchangeReq();
    exchageData.orderChange = bookingData;
    exchageData.customerInfos = this.bookingDetail.customerInfos;
    exchageData.travellers = this.bookingDetail.travellers;
    exchageData.provider = 5;

    this.store.dispatch(new FlightListActions.BookingFlightChange(exchageData));
    this.router.navigate(['/flight/flight-change']);
  }

}
