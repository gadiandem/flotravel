import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { TourCancelDialogComponent } from 'src/app/extras/tour-cancel-dialog/tour-cancel-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { packagesConstant } from 'src/app/packages/packages.constant';
import { GcaService } from 'src/app/service/gca/gca.service';
import { FlocashPaymentGca } from 'src/app/model/gca/history/gca-history-item';
import { GcaHistoryListReq } from 'src/app/model/gca/history/gca-history-list-req';

@Component({
  selector: 'app-gac-transactions-details',
  templateUrl: './gac-transactions-details.component.html',
  styleUrls: ['./gac-transactions-details.component.css']
})
export class GacTransactionsDetailsComponent implements OnInit {
  gcaBookingId: string;
  gcaBookingDetail: FlocashPaymentGca;
  currency: string;
  user: UserDetail;
  isLoading = false;
  isCancelling = false;
  bsModalRef: BsModalRef;

  gcaCancelForm: FormGroup;
  formSubmitError: boolean;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private fb: FormBuilder,
    private gcaService: GcaService,
    private modalService: BsModalService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.gcaBookingId = params['orderId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        const req = new GcaHistoryListReq();
        req.userId = userId;
        this.gcaService.getGcaHistoryDetail(this.gcaBookingId, req).subscribe(
          (res: FlocashPaymentGca) => {
            this.gcaBookingDetail = res;
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

  private initForm() {
    this.gcaCancelForm = this.fb.group({
      traceNumber: ['', [Validators.required]],
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
    // this.isCancelling = true;
    this.gcaService.camcelGcaRecord(this.gcaBookingDetail.id, statement).subscribe(
      (res: OrderPackageCreateRes) => {
        this.isCancelling = false;
        // console.log('res: ' + JSON.stringify(res));
        this.alertify.warning('Cancel booking in processing!');
        this._location.back();
      }, e => {
        this.isCancelling = false;
        console.log(e);
        this.alertify.error(`Cancel feature currently not support`);
        // this.alertify.error(e.error.message);
        this._location.back();
      }
    );
  }

  getOrderUpdate(){
    if (this.gcaCancelForm.valid) {
      const d: any = this.gcaCancelForm.value;
      console.log(JSON.stringify(d));
      sessionStorage.setItem(packagesConstant.PACKAGES_REFUND_TRACENUMBER, d.traceNumber);
      this.router.navigate(['/gca/history', this.gcaBookingId,'update']);
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

}