import { Component, OnInit } from '@angular/core';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-flight-transaction-detail',
  templateUrl: './flight-transaction-detail.component.html',
  styleUrls: ['./flight-transaction-detail.component.css']
})
export class FlightHistoryDetailComponent implements OnInit {
  bookingDetail: FlocashPaymentFlight;
  bookingId: string;
  isLoading = false;
  user: UserDetail;
  startRate = 1;
  currency: string;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private flightHistoryService: FlightBookingHistoryService) { }

  ngOnInit() {
    this.bookingDetail = new FlocashPaymentFlight();
    this.user = JSON.parse(localStorage.getItem('accountInfo'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['bookingId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.flightHistoryService.flightHistoryBookingDetail(this.bookingId).subscribe(
          (res: FlocashPaymentFlight) => {
           // console.log(res);
            this.bookingDetail = res;
            this.startRate = 4;
            if (res != null) {
              this.currency = res.currencyName;
            } else {
              this.router.navigate(['transactions/flight-transactions']);
            }
            this.isLoading = false;
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
