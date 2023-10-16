import { Component, OnInit } from '@angular/core';
import { FlocashPaymentFlight } from 'src/app/model/flight/history/flocash-payment-flight';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FlightBookingHistoryService } from 'src/app/service/flight/flight-history.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-flight-history-detail',
  templateUrl: './flight-history-detail.component.html',
  styleUrls: ['./flight-history-detail.component.css']
})
export class FlightHistoryDetailComponent implements OnInit {
  bookingDetail: FlocashPaymentFlight;
  bookingId: string;
  isLoading = false;
  user: UserDetail;
  startRate = 1;
  currency: string;
  isCollapsed: boolean[];
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private flightHistoryService: FlightBookingHistoryService) { }

  ngOnInit() {
    this.isCollapsed = [true];
    this.bookingDetail = new FlocashPaymentFlight();
    this.user = JSON.parse(localStorage.getItem('accountInfo'));
    this.activeRoute.params.subscribe((params: Params) => {
      this.bookingId = params['flightId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.flightHistoryService.flightHistoryBookingDetail(this.bookingId).subscribe(
          (res: FlocashPaymentFlight) => {
            this.bookingDetail = res;
            this.startRate = 4;
            if (res != null) {
              this.currency = res.currencyName;
            } else {
              this.router.navigate(['/']);
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
