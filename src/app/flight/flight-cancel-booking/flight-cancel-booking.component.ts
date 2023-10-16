import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlightBookingHistoryService } from '../../service/flight/flight-history.service';
import { UserDetail } from '../../model/auth/user/user-detail';
import { FlocashPaymentFlight } from '../../model/flight/history/flocash-payment-flight';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../../service/alertify.service';


@Component({
  selector: 'app-flight-cancel-booking',
  templateUrl: './flight-cancel-booking.component.html',
  styleUrls: ['./flight-cancel-booking.component.css']
})
export class FlightCancelBookingComponent implements OnInit {
  bookingDetail: FlocashPaymentFlight;
  bookingId: string;
  isLoading = true;
  user: UserDetail;
  currency: string;
  typeFlight: string = 'Oneway';
  isCollapsed: boolean;
  formSubmitError: boolean;
  cancellationForm: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private flightHistoryService: FlightBookingHistoryService,
    private fb: FormBuilder,
    private alertify: AlertifyService
  ){}

  ngOnInit() {
    this.initForm();
    this.formSubmitError = false;
    this.isCollapsed = true;
    this.bookingDetail = new FlocashPaymentFlight();
    this.user = JSON.parse(localStorage.getItem('accountInfo'));
    if(sessionStorage.getItem('flightBookingDetail')){
    let flightBookingDetail: FlocashPaymentFlight = JSON.parse(sessionStorage.getItem('flightBookingDetail'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['flightKey'] || flightBookingDetail.id;
      const userId = this.user.id;
      if (userId != null) {
        this.flightHistoryService.flightHistoryBookingDetail(this.bookingId).subscribe(
          (res: FlocashPaymentFlight) => {
            this.bookingDetail = res;
            if (res != null) {
              this.currency = res.currencyName;
              if (res.returnFlight) {
                this.typeFlight = 'Round Trip'
              }
              if (res.nextFlights) {
                this.typeFlight = 'Multi City'
              }
              this.isLoading = false;
            } else {
              this.router.navigate(['/']);
            }
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
  }

  initForm() {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }

  showStatementCancel() {
    this.isCollapsed = !this.isCollapsed;
  }

  cancel(){
    if (this.cancellationForm.valid) {
      const d: any = this.cancellationForm.value;
      const reason: string = d.reason;
      this.isLoading = true;
      this.flightHistoryService.flightCancelBooking(this.bookingDetail, this.bookingDetail.id, reason).subscribe(
        (res: FlocashPaymentFlight) => {
          this.alertify.warning('Cancel booking in processing!');
          this.router.navigate(['/flight/history']);
        }, e => {
          this.alertify.error(e.error.message);
          this.router.navigate(['/flight/history']);
        }
      );
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
