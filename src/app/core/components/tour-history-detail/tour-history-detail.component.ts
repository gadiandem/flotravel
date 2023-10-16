import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TourCancelDialogComponent } from '../../../extras/tour-cancel-dialog/tour-cancel-dialog.component';
import { appConstant } from 'src/app/app.constant';
import { ExtrasHistoryDetailRS } from 'src/app/model/thing-to-do/extra-detail-history-res';

@Component({
  selector: 'app-tour-history-detail',
  templateUrl: './tour-history-detail.component.html',
  styleUrls: ['./tour-history-detail.component.css']
})
export class TourHistoryDetailComponent implements OnInit {

  tourId: string;
  extraDetail: ExtrasHistoryDetailRS;
  currency: string;
  user: UserDetail;
  isLoading = false;
  isCancelling = false;
  bsModalRef: BsModalRef;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private tourService: TourListService,
    private modalService: BsModalService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    // this.tourDetail = JSON.parse(sessionStorage.getItem('tourBookingDetail'));
    if (this.extraDetail != null) {
      this.currency = this.extraDetail.currencyName || 'USD';
    }
    this.activeRoute.params.subscribe((params: Params) => {
      this.tourId = params['tourId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.tourService.tourlHistoryBookingDetail(this.tourId).subscribe(
          (res: ExtrasHistoryDetailRS) => {
            this.extraDetail = res;
            // this.currency = res.currency;
            this.isLoading = false;
          }, e => {
            this.isLoading = false;
          }
        );
      } else {
        this.router.navigate(['/login']);
      }

    });
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(TourCancelDialogComponent);
    this.bsModalRef.content.event.subscribe(res => {
      console.log('reason: ' + res);
      this.cancelBooking(res);
    });
  }
  cancelBooking(statement?: string) {
    this.isCancelling = true;
    this.tourService.tourCancelBooking(this.extraDetail.id, statement).subscribe(
      (res: PaymentTour) => {
        this.isCancelling = false;
        // console.log('res: ' + JSON.stringify(res));
        this.alertify.success('Cancel booking successful!');
        this.router.navigate(['/tour/history']);
      }, e => {
        this.isCancelling = false;
        console.log(e);
      }
    );
  }
}
