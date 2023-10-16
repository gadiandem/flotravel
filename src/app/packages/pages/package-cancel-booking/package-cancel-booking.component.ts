import { Component, OnInit } from '@angular/core';
import { OrderPackageCreateRes } from '../../../model/packages/consumer/order-package-create-res';
import { HistoryOrderPackageDetailRes } from '../../../model/packages/consumer/history-package-order-detail-res';
import { UserDetail } from '../../../model/auth/user/user-detail';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { PackagesHistoryService } from '../../../service/packages/packages-history.service';
import { AlertifyService } from '../../../service/alertify.service';
import { appConstant } from '../../../app.constant';
import { OrderListItem } from '../../../model/packages/consumer/order-list-item';
import { packagesConstant } from '../../packages.constant';
import { Location } from '@angular/common';

@Component({
  selector: 'app-package-cancel-booking',
  templateUrl: './package-cancel-booking.component.html',
  styleUrls: ['./package-cancel-booking.component.css']
})
export class PackageCancelBookingComponent implements OnInit {
  packageOrderId: string;
  orderPackageDetail: HistoryOrderPackageDetailRes;
  orderPackage: OrderListItem;
  currency: string;
  user: UserDetail;
  isLoading = false;
  isCancelling = false;

  cancellationForm: FormGroup;
  formSubmitError: boolean;
  isCollapsed: boolean;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private packageHistoryService: PackagesHistoryService,
    private alertify: AlertifyService
  ){}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.orderPackage = JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_ORDER_BOOKING)) || null;
    this.initForm();
    this.isCollapsed = true;
    this.activeRoute.params.subscribe((params: Params) => {
      this.packageOrderId = params['orderId'];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.packageHistoryService.orderPackageDetail(this.packageOrderId).subscribe(
          (res: HistoryOrderPackageDetailRes) => {
            this.orderPackageDetail = res;
            this.isLoading = false;
          }, e => {
            this.isLoading = false;
          }
        );
      } else {
        this.router.navigate(['/dashboard/packages']);
      }
    });
  }

  initForm() {
    this.cancellationForm = this.fb.group({
      reason: ['']
    });
  }

  showStatementCancel() {
    this.isCollapsed = !this.isCollapsed;
  }

  cancel() {
    if (this.cancellationForm.valid) {
      const d: any = this.cancellationForm.value;
      const reason: string = d.reason;
      this.packageHistoryService.packagesCancelBooking(this.orderPackageDetail.id, reason).subscribe(
        (res: OrderPackageCreateRes) => {
          this.alertify.warning('Cancel booking in processing!');
        }, e => {
          console.log(e);
          this.alertify.error(e.error.message);
        }, () => {
          this._location.back();
        }
      );
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  backPage(){
    this._location.back();
  }

  addDays(dateStr: string, days: number): Date {
    let date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date;
  }
}
