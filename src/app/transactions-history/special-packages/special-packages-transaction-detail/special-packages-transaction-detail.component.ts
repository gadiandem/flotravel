import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {Location} from '@angular/common';

import { appConstant } from 'src/app/app.constant';
import { HistoryOrderPackageDetailRes } from 'src/app/model/packages/consumer/history-package-order-detail-res';
import { OrderPackageCreateRes } from 'src/app/model/packages/consumer/order-package-create-res';
import { TourCancelDialogComponent } from 'src/app/extras/tour-cancel-dialog/tour-cancel-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { specialPackagesConstant } from 'src/app/special-packages/special-packages.constant';
import { SpecialPackagesHistoryService } from 'src/app/service/packages/special-packages-history.service';

@Component({
  selector: 'app-special-packages-transaction-detail',
  templateUrl: './special-packages-transaction-detail.component.html',
  styleUrls: ['./special-packages-transaction-detail.component.css']
})
export class SpecialPackagesTransactionDetailComponent implements OnInit {

  packageOrderId: string;
  orderPackageDetail: HistoryOrderPackageDetailRes;
  currency: string;
  user: UserDetail;
  isLoading = false;
  isCancelling = false;
  bsModalRef: BsModalRef;

  packageOrderForm: FormGroup;
  formSubmitError: boolean;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private fb: FormBuilder,
    private packagesService: SpecialPackagesHistoryService,
    private modalService: BsModalService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.packageOrderId = params['bookingId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.packagesService.orderPackageDetail(this.packageOrderId).subscribe(
          (res: HistoryOrderPackageDetailRes) => {
            this.orderPackageDetail = res;
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
    this.packageOrderForm = this.fb.group({
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
    this.packagesService.packagesCancelBooking(this.orderPackageDetail.id, statement).subscribe(
      (res: OrderPackageCreateRes) => {
        this.isCancelling = false;
        // console.log('res: ' + JSON.stringify(res));
        this.alertify.warning('Cancel booking in processing!');
        // this.router.navigate(['/packages/history']);
        this._location.back();
      }, e => {
        this.isCancelling = false;
        console.log(e);
        this.alertify.error(e.error.message);
      }
    );
  }

  getOrderUpdate(){
    if (this.packageOrderForm.valid) {
      const d: any = this.packageOrderForm.value;
      console.log(JSON.stringify(d));
      sessionStorage.setItem(specialPackagesConstant.PACKAGES_REFUND_TRACENUMBER, d.traceNumber);
      this.router.navigate(['/specialPackages/history', this.packageOrderId,'update']);
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

}

