import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appConstant, BOOKINGSTATUS, SERVICENAME } from 'src/app/app.constant';
import { RedirectReq } from 'src/app/model/flocash/redirect/redirect-req';
import { PaymentBookingResult } from 'src/app/model/gca/payment-booking-result/payment-booking-result';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { FlocashPaymentTraceMe } from 'src/app/model/traceme/history/traceme-history-item';
import { FlocashRedirectService } from 'src/app/service/flocash-redirect.service';

@Component({
  selector: 'app-redirect-process',
  templateUrl: './redirect-process.component.html',
  styleUrls: ['./redirect-process.component.css']
})
export class RedirectProcessComponent implements OnInit {

  serviceName: string;
  traceNumber: string;
  status: string;
  txnref: string;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  currency: string;
  redirectRes: any;
  redirectResult: any;
  tracemePaymentRes: FlocashPaymentTraceMe;
  gcaPaymentRes: PaymentBookingResult;
  packagePaymentRes: OrderPackageCreateRes;
  specialPackagePaymentRes: OrderPackageCreateRes;
  paymentStatus: boolean;
  bookingStatus: boolean;
  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private flocashRedirect: FlocashRedirectService) { }

  ngOnInit() {
    this.fetching = true;
    this.fetchFailed = false;
    this.errorMes = '';
    this.currency = 'USD';
    this.serviceName = sessionStorage.getItem(appConstant.REDIRECT_SERVICE_NAME);
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.traceNumber = params['traceNumber'];
      if (this.traceNumber) {
        this.processRedirect();
      }
    });
  }

   processRedirect() {
    const redirectData = new RedirectReq();
    redirectData.traceNumber = this.traceNumber;
    redirectData.serviceName = this.serviceName;
    this.flocashRedirect.flotravelRedirect(redirectData).subscribe(
      res => {
        console.log(res);
        this.prcessRedirectRes(res);
        this.fetching = false;
      }, e => {
        console.log(e);
        this.fetchFailed = true;
        this.fetching = false;
      }
    );
  }

  prcessRedirectRes(res: any) {
    if (res && res.code === '200') {
      this.serviceName = res.result.serviceName;
      if (this.serviceName === SERVICENAME.TRACEME) {
          this.tracemePaymentRes = res.result.traceMeBooking;
          if (this.tracemePaymentRes.bookingStatus !== BOOKINGSTATUS.CONFIRM) {
            this.errorMes = this.tracemePaymentRes.partnerMessage + ': ' + this.tracemePaymentRes.statusDesc;
            this.fetchFailed = true;
          }
      } else if (this.serviceName === SERVICENAME.GCA) {
        this.gcaPaymentRes = res.result.gcaBooking;
        if (this.gcaPaymentRes.bookingStatus !== BOOKINGSTATUS.CONFIRM) {
          this.errorMes = this.gcaPaymentRes.partnerMessage + ': ' + this.gcaPaymentRes.statusDesc;
          this.fetchFailed = true;
        }
      } else if (this.serviceName === SERVICENAME.NCT) {
        this.packagePaymentRes = res.result.packageBooking;
        if (this.packagePaymentRes.bookingStatus !== BOOKINGSTATUS.CONFIRM) {
          this.errorMes = this.packagePaymentRes.partnerMessage + ': ' + this.packagePaymentRes.statusDesc;
          this.fetchFailed = true;
        }
      } else if (this.serviceName === SERVICENAME.SPECIAL_PACKAGE) {
        this.specialPackagePaymentRes = res.result.specialPackageBooking;
        if (this.specialPackagePaymentRes.bookingStatus !== BOOKINGSTATUS.CONFIRM) {
          this.errorMes = this.specialPackagePaymentRes.partnerMessage + ': ' + this.specialPackagePaymentRes.statusDesc;
          this.fetchFailed = true;
        }
      }
      // this.redirectResult = this.redirectRes.result;
    }
  }
}


