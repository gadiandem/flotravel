import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from '../../../model/hotel/hotel-payment/user-info.model';
import {CardPaymentModel} from '../../../model/thing-to-do/tour-payment/card-payment-model';
import {UserDetail} from '../../../model/auth/user/user-detail';
import {DepositRes} from '../../../model/wallet/deposit/deposit-res';
import {DepositOrderRes} from '../../../model/wallet/deposit/deposit-order-res';
import {DepositFeeRes} from '../../../model/wallet/deposit/fee/deposit-fee-res';
import {DepositStep1} from '../../../model/wallet/deposit/deposit-step-1';
import {OptionInfo} from '../../../model/wallet/deposit/option-info';
import {UserInfoRes} from '../../../model/wallet/profile/user-info-res';
import {PayerWallet} from '../../../model/wallet/deposit/payer';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as TracemeActions from 'src/app/traceme/store/traceme.actions';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import * as FlightActions from 'src/app/flight/store/flight-list.actions';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';
import * as PackagesActions from 'src/app/packages/store/packages.actions';
import * as HotelCollectionActions from 'src/app/special-packages/store/special-packages.actions';
import {DepositService} from '../../../service/wallet/deposit.service';
import {depositConstant} from '../../../wallet/deposit-money/deposit.constant';
import {DEPOSIT_STATUS, REDIRECTMETHOD, REQUESTSTATUS} from '../../../wallet/wallet.constant';
import { appConstant, SERVICENAME } from 'src/app/app.constant';
import { tracemeConstant } from 'src/app/traceme/traceme.constant';
import { flightConstant } from 'src/app/flight/flight.constant';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { packagesConstant } from 'src/app/packages/packages.constant';
import { specialPackagesConstant } from 'src/app/special-packages/special-packages.constant';

@Component({
  selector: 'app-bank-deposit-result',
  templateUrl: './bank-deposit-result.component.html',
  styleUrls: ['./bank-deposit-result.component.css']
})
export class BankDepositResultComponent implements OnInit {
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  userInfo: UserInfoModel[];
  cardPayment: CardPaymentModel;
  user: UserDetail;
  userId: string;
  paymentRes: DepositRes;
  depositOrder: DepositOrderRes;
  account: UserDetail;
  depositFeeRes: DepositFeeRes;

  initialRequest: boolean;

  depositStep1: DepositStep1;
  selectedPaymentOption: OptionInfo;
  accountProfile: UserInfoRes;
  initialLoadData = true;
  customerInfo: PayerWallet;

  statusRequest: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>,
    private depositService: DepositService
  ) {
  }

  ngOnInit() {
    this.initialRequest = true;
    this.fetchFailed = false;
    this.fetching = true;
    this.depositStep1 = JSON.parse(
      sessionStorage.getItem(depositConstant.DEPOSIT_STEP_1)
    );
    this.selectedPaymentOption = JSON.parse(
      sessionStorage.getItem(depositConstant.SELECTED_PAYMENT_OPTION)
    );
    this.customerInfo = JSON.parse(
      sessionStorage.getItem(depositConstant.CUSTOMER_INFO)
    );
    this.cardPayment = JSON.parse(
      sessionStorage.getItem(depositConstant.CARD_PAYMENT)
    );
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user || JSON.parse(sessionStorage.getItem(appConstant.ACCOUNT_INFO));
    });
    this.store.select('wallet').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.accountProfile = data.merchantProfileRes;
      this.depositFeeRes = data.depositFeeRes;
      this.paymentRes = data.depositRes;
      if (this.paymentRes && this.paymentRes.order && !data.loading) {
        this.processResponse();
      } else {
        if (this.paymentRes && this.paymentRes.errorId) {
          this.fetchFailed = true;
          this.errorMes = `${this.paymentRes.errorId} - ${this.paymentRes.errorCode} - ${this.paymentRes.errorMessage}`;
        }
      }
    });
  }

  processResponse() {
    this.depositOrder = this.paymentRes.order;
    if (this.initialLoadData) {
      const depositStatus = this.depositOrder.status;
      switch (depositStatus) {
        case DEPOSIT_STATUS['0009']:
          this.statusRequest = REQUESTSTATUS.PENDING;
          this.onRedirect();
          break;
        case DEPOSIT_STATUS['0004']:
          this.statusRequest = REQUESTSTATUS.PENDING;
          break;
        case DEPOSIT_STATUS['0003']:
          this.errorMes = this.depositOrder.status + this.depositOrder.statusDesc;
          this.fetchFailed = true;
          break;
        case DEPOSIT_STATUS['0000']:
          this.fetchFailed = true;
          break;
        case DEPOSIT_STATUS['0010']:
          this.onRedirectCreditCard();
          this.fetchFailed = false;
          break;
        case DEPOSIT_STATUS['0012']:
          this.fetchFailed = false;
          break;
        default:
          this.fetchFailed = false;
          break;
      }
    }
    this.initialLoadData = false;
  }

  onRedirectCreditCard() {
    this.route.navigate(['../card-info'], {relativeTo: this.activeRoute});
  }

  onRedirect() {
    const method = this.depositOrder.redirect.method;
    switch (method.toUpperCase()) {
      case REDIRECTMETHOD.POST:
        console.log('post request to page: ' + this.depositOrder.redirect.url);
        this.sentPostRequest();
        break;
      case REDIRECTMETHOD.GET:
        console.log('redirect to page: ' + this.depositOrder.redirect.url);
        window.open(this.depositOrder.redirect.url, '_blank');
        break;
    }
  }

  sentPostRequest() {
    this.depositService.postRedirect(this.depositOrder.redirect.params, this.depositOrder.redirect.url).subscribe(
      (res: any) => {
        console.log(res);
      }, e => {
        console.log(e);
      }
    );
  }

  proceed() {
    const depositStatus = this.depositOrder.status;
      switch (depositStatus) {
        case DEPOSIT_STATUS['0000']:
          this.redirectAfterDeposit();
          break;
        case DEPOSIT_STATUS['0012']:
          this.redirectAfterDeposit();
          break;
        default:
          this.route.navigate(['../poll-transaction'], {
            relativeTo: this.activeRoute,
          });
          break;
      }
  }
  redirectAfterDeposit() {
    const servicePendingDeposit = sessionStorage.getItem(depositConstant.SERVICE_PENDING);
    switch (servicePendingDeposit) {
      case SERVICENAME.TRACEME:
        this.traceMeGenerateVcn();
        this.route.navigate(['/traceme/updateOtp']);
        break;
      case SERVICENAME.HOTEL:
        this.hotelGenerateVcn();
        this.route.navigate(['/hotel/updateOtp']);
        break;
      case SERVICENAME.NCT:
        this.flightGenerateVcn();
        this.route.navigate(['/flight/updateOtp']);
        break;
      case SERVICENAME.INSURANCE:
        this.insuranceGenerateVcn();
        this.route.navigate(['/insurance/updateOtp']);
        break;
      case SERVICENAME.PACKAGE:
        this.packagesGenerateVcn();
        this.route.navigate(['/packages/updateOtp']);
        break;
      case SERVICENAME.SPECIAL_PACKAGE:
        this.specialPackagesGenerateVcn();
        this.route.navigate(['/special-packages/updateOtp']);
        break;
      default:
        console.log('There is no service is deposit pending to redirect');
    }
  }
  traceMeGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_VCN_GENERATE));
    this.store.dispatch(new TracemeActions.GetVcnStart({...requestVcn}));

  }

  hotelGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_VCN_GENERATE));
    this.store.dispatch(new HotelActions.GetVcnStart({...requestVcn}));

  }

  flightGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_VCN_GENERATE));
    this.store.dispatch(new FlightActions.GetVcnStart({...requestVcn}));
  }

  insuranceGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(insuranceConstant.INSURANCE_VCN_GENERATE));
    this.store.dispatch(new InsuranceActions.GetVcnStart({...requestVcn}));
  }

  packagesGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(packagesConstant.PACKAGE_VCN_GENERATE));
    this.store.dispatch(new PackagesActions.GetVcnStart({...requestVcn}));
  }

  specialPackagesGenerateVcn() {
    const requestVcn = JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_VCN_GENERATE));
    this.store.dispatch(new HotelCollectionActions.GetVcnStart({...requestVcn}));
  }
}
