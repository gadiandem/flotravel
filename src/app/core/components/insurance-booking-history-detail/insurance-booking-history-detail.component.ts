import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appConstant } from "src/app/app.constant";
import { TourCancelDialogComponent } from "src/app/extras/tour-cancel-dialog/tour-cancel-dialog.component";

import { UserDetail } from "src/app/model/auth/user/user-detail";
import { FlocashPaymentInsurance } from "src/app/model/insurance/subscription-policy/response/flocash-payment.insurance";
import { PaymentTour } from "src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour";
import { AlertifyService } from "src/app/service/alertify.service";
import { InsuranceService } from "src/app/service/insurance/insurance.service";
import { insuranceConstant } from "../../../insurance/insurance.constant";

@Component({
  selector: "app-insurance-booking-history-detail",
  templateUrl: "./insurance-booking-history-detail.component.html",
  styleUrls: ["./insurance-booking-history-detail.component.css"],
})
export class InsuranceBookingHistoryDetailComponent implements OnInit {
  insuranceId: string;
  insuranceDetail: FlocashPaymentInsurance;
  currency: string;
  user: UserDetail;
  isLoading = false;
  bsModalRef: BsModalRef;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService,
    private modalService: BsModalService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.insuranceDetail = JSON.parse(
      sessionStorage.getItem(insuranceConstant.HISTORY_INSURANCE_SELECTED)
    );
    if (this.insuranceDetail != null) {
      this.currency = this.insuranceDetail.currencyName || "USD";
    }
    this.activeRoute.params.subscribe((params: Params) => {
      this.insuranceId = params["insuranceId"];
      const userId = this.user.id;
      if (userId != null) {
        this.isLoading = true;
        this.insuranceService
          .getInsurancePaymentHistoryDetail(this.insuranceId)
          .subscribe(
            (res: FlocashPaymentInsurance) => {
              this.insuranceDetail = res;
              // this.currency = res.currency;
              this.isLoading = false;
            },
            (e) => {
              this.isLoading = false;
            }
          );
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(TourCancelDialogComponent);
    this.bsModalRef.content.event.subscribe((res) => {
      console.log("reason: " + res);
      this.cancelBooking(res);
    });
  }
  cancelBooking(statement?: string) {
    // this.insuranceService.cancelPolicy(this.insuranceDetail.id, statement);
    // .subscribe(
    //   (res: any) => {
    //     console.log('res: ' + JSON.stringify(res));
    //     this.alertify.success('Cancel booking successful!');
    //     this.router.navigate(['/insurance/history']);
    //   }, e => {
    //     console.log(e);
    //   }
    // );
    this.insuranceService
      .cancelPolicy2(this.insuranceDetail.id, statement, this.insuranceDetail.item_name)
      .subscribe(
        (res: FlocashPaymentInsurance) => {
          console.log("res: " + JSON.stringify(res));
          this.alertify.success("Cancel booking successful!");
          this.router.navigate(["/insurance/history"]);
        },
        (e) => {
          console.log(e);
        }
      );
  }

  updateInsurance() {
    this.router.navigate(["update", this.insuranceDetail.policyId], {
      relativeTo: this.activeRoute,
    });
  }
}
