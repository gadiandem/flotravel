import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { FlocashOrderResponse } from 'src/app/model/flocash/response/flocash-order.response';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PackagesHistoryService } from 'src/app/service/packages/packages-history.service';
import { packagesConstant } from '../../packages.constant';

@Component({
  selector: 'app-package-pending-update',
  templateUrl: './package-pending-update.component.html',
  styleUrls: ['./package-pending-update.component.css']
})
export class PackagePendingUpdateComponent implements OnInit {

  packageOrderForm: FormGroup;
  orderUpdate: FlocashOrderResponse;
  packageOrderId: string;
  user: UserDetail;
  isLoading = false;
  formSubmitError: boolean;
  errorMessage: string;
  isUpdating = false;
  traceNumber: string
  constructor(private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private alertify: AlertifyService,
              private packageHistoryService: PackagesHistoryService) {
  }

  ngOnInit() {
    this.errorMessage = '';
    this.traceNumber = sessionStorage.getItem(packagesConstant.PACKAGES_REFUND_TRACENUMBER);
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.formSubmitError = false;
    this.initForm();
    this.activeRoute.params.subscribe((params: Params) => {
      this.packageOrderId = params['orderId'];
      console.log("packageOrderId: " + this.packageOrderId);
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.packageHistoryService.getPackageOrderRefund(this.traceNumber, this.user.id)
          .subscribe(
            (res: FlocashOrderResponse) => {
              this.isLoading = false;
              this.orderUpdate = res;
              if (res) {
                this.updateFormWithData();
              }
            }, e => {
              this.isLoading = false;
              console.log(JSON.stringify(e));
              this.errorMessage = e.error.message;
            }
          );
      } else {
        this.router.navigate(['/login']);
      }

    });
  }


  private initForm() {
    this.packageOrderForm = this.fb.group({
      amount: ['', [Validators.required]],
      capturedAmount: ['', [Validators.required]],
      refundedAmount: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      currencyName: ['', [Validators.required]],
      custom: ['', [Validators.required]],
      itemName: ['', [Validators.required]],
      itemPrice: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      orderId: ['', [Validators.required]],
      tracking: ['', [Validators.required]],
      traceNumber: ['', [Validators.required]],
      partnerMessage: ['', [Validators.required]],
      status: ['', [Validators.required]],
      statusDesc: ['', [Validators.required]],
      paymentChannel: ['', [Validators.required]],
    });
  }

  updateFormWithData() {
    this.packageOrderForm.patchValue({
      amount: this.orderUpdate.amount,
      capturedAmount: this.orderUpdate.capturedAmount,
      refundedAmount: this.orderUpdate.refundedAmount,
      orderDate: this.orderUpdate.orderDate,
      currency: this.orderUpdate.currency,
      currencyName: this.orderUpdate.currencyName,
      custom: this.orderUpdate.custom,
      itemName: this.orderUpdate.item_name,
      itemPrice: this.orderUpdate.item_price,
      quantity: this.orderUpdate.quantity,
      orderId: this.orderUpdate.orderId,
      tracking: this.orderUpdate.tracking,
      traceNumber: this.orderUpdate.traceNumber,
      partnerMessage: this.orderUpdate.partnerMessage,
      status: this.orderUpdate.status,
      statusDesc: this.orderUpdate.statusDesc,
      paymentChannel: this.orderUpdate.paymentChannel,
    });
  }

  updaterRefundTransaction() {
    if (!this.errorMessage && !this.isLoading) {
      this.alertify.confirm('Are you sure you want to update this order?', () => {
        this.isUpdating = true;
        this.packageHistoryService.updatePackageOrderRefund(this.traceNumber, this.user.id, this.packageOrderId).subscribe(
          (res: any) => {
            this.alertify.success(`update success:!!!`);
            this.isUpdating = false;
            this.router.navigateByUrl('packages/history');
          }, e => {
            this.alertify.error(`${e.error.message}`);
            this.isUpdating = false;
            this.router.navigateByUrl('packages/history');
          }
        );
      });
    }
  }
}
