import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import * as fromApp from '../../../../store/app.reducer';
import * as AuthActions from '../../../../auth/store/auth.actions';
import { map } from 'rxjs/operators';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant, supplierSimulatorOption } from 'src/app/app.constant';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: "main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.css"],
})
export class MainHeaderComponent implements OnInit {
  navbarOpen = false;

  isSAdmin = false;
  enableAgent: boolean;
  user: UserDetail;
  isDemo: boolean;
  enableDemo: boolean;
  hotelSupplierSimulator: string;
  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private arlertify: AlertifyService,
    public translate: TranslateService
  ) {
    translate.setDefaultLang ('en');
    translate.use('en');
  }

  ngOnInit() {
    this.enableAgent = false;
    this.isDemo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
    this.enableDemo = environment.demo || false;
    this.hotelSupplierSimulator = localStorage.getItem(appConstant.HOTEL_SIMULATOR_SUPPLIER) || supplierSimulatorOption.DISABLE;
    this.store
      .select("auth")
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.user =
          user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user && this.user.userGroups) {
          this.user.userGroups.forEach((group) => {
            if (group.value === adminConstant.ADMIN) {
              this.enableAgent = true;
            }
            if (group.value === adminConstant.SADMIN) {
              this.enableAgent = true;
              this.isSAdmin = true;
            }
          });
          // this.enableAgent = this.user.userGroups.rank < 3;
          // this.isSAdmin = this.user.userGroups.rank == 1;
        }
      });
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  toggleDemo() {
    if (!this.isDemo) {
      localStorage.setItem(appConstant.DEMO, JSON.stringify(true));
    } else {
      localStorage.removeItem(appConstant.DEMO);
    }
    this.isDemo = !this.isDemo;
  }
  logout() {
    this.user = null;
    console.log("current url: " + this.route.snapshot);
    // sessionStorage.clear();
    this.store.dispatch(new AuthActions.Logout(""));
  }

  commissionNav() {
    if ( this.isSAdmin) {
      this.router.navigate(['/commission/flotravel']);
    } else if (this.enableAgent) {
      this.router.navigate(['/commission/agent']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  walletNav(){
    if((this.user.walletCredential && this.user.walletCredential.apiUser && this.user.walletCredential.apiPassword) || this.user.active){
      this.router.navigate(['/wallet']);
    } else{
      this.arlertify.error("This account does not yet have a wallet, check with flotravel admin for more info");
      return;
      // if(this.user.walletCredential){
      //   sessionStorage.setItem('walletLoginError', 'The wallet credentail not correct')
      // }
      // this.router.navigate(['/wallet/login']);
    }
  }

  profileNav() {
    if (this.isSAdmin) {
      this.router.navigate(["/admin/super/profile", this.user.id]);
    } else {
      this.router.navigate(["/admin/user/profile", this.user.id]);
    }
  }

  agentNav() {
    if (this.isSAdmin) {
      this.router.navigate(["/admin/agency"]);
    } else if (this.enableAgent) {
      this.router.navigate(["/admin/agency/edit", this.user.agentId]);
    } else {
      this.router.navigate(["/", this.user.id]);
    }
  }

  userNav() {
    if (this.enableAgent || this.isSAdmin) {
      this.router.navigate(["/admin/user"]);
    } else if (this.user) {
      this.router.navigate(["/admin/user/edit", this.user.id]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  homePage() {
    this.router.navigate(["/dashboard"]);
  }
}
