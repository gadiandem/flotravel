import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import * as fromApp from '../../../store/app.reducer';
import {DepositService} from '../../../service/wallet/deposit.service';
import {DepositRes} from '../../../model/wallet/deposit/deposit-res';
import {appConstant, SERVICENAME} from 'src/app/app.constant';
import {UserDetail} from '../../../model/auth/user/user-detail';
import {DEPOSIT_STATUS, walletConstant} from '../../../wallet/wallet.constant';
import {depositConstant} from '../../../wallet/deposit-money/deposit.constant';
import {tracemeConstant} from '../../../traceme/traceme.constant';
import * as TracemeActions from 'src/app/traceme/store/traceme.actions';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import * as FlightActions from 'src/app/flight/store/flight-list.actions';
import * as InsuranceActions from 'src/app/insurance/store/insurance.actions';
import * as PackagesActions from 'src/app/packages/store/packages.actions';
import * as HotelCollectionActions from 'src/app/special-packages/store/special-packages.actions';
import {AlertifyService} from 'src/app/service/alertify.service';
import {hotelConstant} from '../../../hotel/hotel.constant';
import {flightConstant} from '../../../flight/flight.constant';
import {insuranceConstant} from '../../../insurance/insurance.constant';
import {packagesConstant} from '../../../packages/packages.constant';
import {specialPackagesConstant} from '../../../special-packages/special-packages.constant';
import {FlocashCreateOrderResponse} from '../../../model/flocash/response/flocash-create-order.response';
import { FlocashOrderResponse } from 'src/app/model/flocash/response/flocash-order.response';

@Component({
  selector: 'app-polls-transaction',
  templateUrl: './polls-transaction.component.html',
  styleUrls: ['./polls-transaction.component.css']
})
export class PollsTransactionComponent implements OnInit, OnDestroy {
  sub: Subscription;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  paymentRes: DepositRes;
  user: UserDetail;

  constructor(private activeRoute: ActivatedRoute,
              private route: Router,
              private alertifyService: AlertifyService,
              private store: Store<fromApp.AppState>,
              private depositService: DepositService) {
  }

  ngOnInit() {
    this.fetching = true;
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.store.select('wallet').subscribe((data) => {
      this.paymentRes = data.depositRes || JSON.parse(sessionStorage.getItem(walletConstant.DEPOSIT_RES));
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
    this.sub = this.depositService.pollTransactionStatus(this.paymentRes.order.traceNumber, this.user.id).subscribe(
      (res: FlocashOrderResponse) => {
        if (res.status === DEPOSIT_STATUS['0000']) {
          this.redirectAfterDeposit();
        } else if(res.status == DEPOSIT_STATUS['0010']) {
          // redirect to card info
          this.redirectToCardInfo();
        } else {
          this.alertifyService.error(res.statusDesc);
          this.redirectErrorAfterDeposit();
        }
      }, e => {
        console.log(e);
        this.alertifyService.error('Deposit fail, try again or contact to flocash admin to approval request deposit!');
        this.redirectErrorAfterDeposit(e);
      }
    );
  }

  redirectToCardInfo() {
    this.route.navigate(['../card-info'], { relativeTo: this.activeRoute });
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
      case SERVICENAME.FLIGHT:
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
        this.route.navigate(['/specialPackages/updateOtp']);
        break;
      default:
        console.log('There is no service deposit pending to redirect');
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

  redirectErrorAfterDeposit(e?: any) {
    const servicePendingDeposit = sessionStorage.getItem(depositConstant.SERVICE_PENDING);
    switch (servicePendingDeposit) {
      case SERVICENAME.TRACEME:
        this.route.navigate(['/bank-deposit/result']);
        break;
      case SERVICENAME.HOTEL:
        this.route.navigate(['/bank-deposit/result']);
        break;
      case SERVICENAME.NCT:
        this.route.navigate(['/bank-deposit/result']);
        break;
      case SERVICENAME.INSURANCE:
        this.route.navigate(['/bank-deposit/result']);
        break;
      case SERVICENAME.PACKAGE:
        this.route.navigate(['/bank-deposit/result']);
        break;
      case SERVICENAME.SPECIAL_PACKAGE:
        this.route.navigate(['/bank-deposit/result']);
        break;
      default:
        console.log('Error deposit pending to redirect' + e);
    }
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
