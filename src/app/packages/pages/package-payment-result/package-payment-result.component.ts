import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {CardPaymentModel} from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import {UserInfoModel} from 'src/app/model/hotel/hotel-payment/user-info.model';
import * as fromApp from '../../../store/app.reducer';
import * as PacakgesActions from '../../store/packages.actions';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {packagesConstant} from '../../packages.constant';
import {appConstant, FLOCASH_CREATE_ORDER_STATUS, REDIRECTMETHOD, REQUESTSTATUS, defaultData} from 'src/app/app.constant';
import {PaymentInfo} from 'src/app/model/flocash/payment-info';
import {OrderPackageCreateReq} from 'src/app/model/packages/consumer/order-package-create-req';
import {OrderPackageCreateRes} from 'src/app/model/packages/consumer/order-package-create-res';
import {HotelPackageDetailRes} from 'src/app/model/packages/consumer/hotel-package-detail-res';
import {SupplementPackageRes} from 'src/app/model/packages/consumer/supplement-package-res';
import {TourPackageRes} from 'src/app/model/packages/consumer/tour-package-res';
import {TransferPackageRes} from 'src/app/model/packages/consumer/transfer-pacakge-res';
import {PackageShoppingRes} from 'src/app/model/packages/consumer/package-shopping-res';
import {SummaryPackageRes} from 'src/app/model/packages/consumer/summary-package-res';
import {SummaryPackageReq} from 'src/app/model/packages/consumer/summary-package-req';
import {insuranceConstant} from 'src/app/insurance/insurance.constant';
import {SubscribePolicyData} from 'src/app/model/insurance/subscription-policy/subscribe-policy-data';
import {thingToDoConstant} from 'src/app/extras/thing-to-do.constant';
import {demoFlightData} from 'src/app/flight/flight.constant';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-package-payment-result',
    templateUrl: './package-payment-result.component.html',
    styleUrls: ['./package-payment-result.component.css'],
})
export class PackagePaymentResultComponent implements OnInit, OnDestroy {
    fetching: boolean;
    fetchFailed: boolean;
    errorMes: string;
    sub: Subscription;

    summaryReq: SummaryPackageReq;
    selectedPackage: PackageShoppingRes;
    selectedRoom: HotelPackageDetailRes;
    selectedSupplements: SupplementPackageRes[];
    selectedTours: TourPackageRes[];
    selectedTransfers: TransferPackageRes[];
    packageSummaryRes: SummaryPackageRes;

    userInfo: UserInfoModel[];
    cardPayment: CardPaymentModel;
    user: UserDetail;
    userId: string;
    paymentRes: OrderPackageCreateRes;
    orderPackage: OrderPackageCreateReq;
    currency: string;

    initialRequest: boolean;
    statusRequest: string;
    defaultData: string;

    constructor(
        private activeRoute: ActivatedRoute,
        private route: Router,
        private store: Store<fromApp.AppState>
    ) {
    }

    ngOnInit() {
        window.scroll(0, 0);
        this.defaultData = defaultData.noImage;
        this.initialRequest = true;
        this.fetchFailed = false;
        this.fetching = true;
        this.currency = packagesConstant.METADATA_CURRENCY;
        this.userInfo = JSON.parse(sessionStorage.getItem(packagesConstant.USER_INFO)) || [];
        this.orderPackage = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_PAYMENT_REQ));
        this.selectedSupplements = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_SUPPLEMENT)) || [];
        this.selectedTours = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TOUR)) || [];
        this.selectedTransfers = JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_TRANSFER)) || [];
        this.sub = this.store.select('packagesList').subscribe((data) => {
            this.fetching = data.loading;
            this.fetchFailed = data.failure;
            this.errorMes = data.errorMessage;
            this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_PACKAGE));
            this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(packagesConstant.SELECTED_ROOM));
            this.packageSummaryRes = data.packageSummaryRes || JSON.parse(sessionStorage.getItem(packagesConstant.SUMMARY_RESULT));
            this.paymentRes = data.packagesPaymentRes;
            if (this.selectedPackage && this.selectedPackage.id) {
                this.currency = this.selectedPackage.currency;
            }
            if (this.paymentRes) {
                this.handlerBookingResult(this.paymentRes);
            }
            this.summaryReq = data.packageSummaryReq || JSON.parse(sessionStorage.getItem(packagesConstant.SUMMARY_REQ));

            if (data.agentVcn && this.initialRequest) {
                this.initialRequest = false;
                this.packagesBooking();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    packagesBooking() {
        const paymentInfo: PaymentInfo = JSON.parse(
            sessionStorage.getItem(appConstant.paymentInfo)
        );
        if (paymentInfo) {
            const packagesPaymentReq: OrderPackageCreateReq = JSON.parse(
                sessionStorage.getItem(packagesConstant.PACKAGES_PAYMENT_REQ)
            );
            paymentInfo.vcnPayment = paymentInfo.vcnPayment;
            paymentInfo.traceNumber = paymentInfo.traceNumber;
            paymentInfo.otpValue = paymentInfo.otpValue;
            paymentInfo.currency = packagesPaymentReq.paymentInfo.currency;
            paymentInfo.price = packagesPaymentReq.paymentInfo.price;
            paymentInfo.payer = packagesPaymentReq.paymentInfo.payer;
            paymentInfo.name = packagesPaymentReq.paymentInfo.name;
            packagesPaymentReq.paymentInfo = paymentInfo;

            this.store.dispatch(
                new PacakgesActions.PaymentPackagesStart({data: packagesPaymentReq})
            );
        } else {
            this.fetchFailed = true;
            this.errorMes = 'vcn payment not available';
        }
    }

    handlerBookingResult(bookingRes: OrderPackageCreateRes) {
        const paymentStatus = bookingRes.status;
        switch (paymentStatus) {
            case FLOCASH_CREATE_ORDER_STATUS['0009']:
                this.statusRequest = REQUESTSTATUS.PENDING;
                sessionStorage.setItem(appConstant.REDIRECT_SERVICE_NAME, bookingRes.serviceName);
                this.onRedirect(bookingRes.redirect);
                break;
            case FLOCASH_CREATE_ORDER_STATUS['0004']:
                this.statusRequest = REQUESTSTATUS.PENDING;
                break;
        }
    }

    onRedirect(redirect: any) {
        const method = redirect.method;
        switch (method.toUpperCase()) {
            case REDIRECTMETHOD.POST:
                console.log('post request to page: ' + redirect.url);
                this.sentPostRequest(redirect);
                break;
            case REDIRECTMETHOD.GET:
                console.log('redirect to page: ' + redirect.url);
                window.open(redirect.url, '_blank');
                break;
        }
    }

    sentPostRequest(redirect: any) {
        sessionStorage.setItem(appConstant.REDIRECT, JSON.stringify(redirect));
        this.route.navigate(['../redirect'], {
            relativeTo: this.activeRoute,
        });
    }

}
