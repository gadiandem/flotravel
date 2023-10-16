import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as AuthActions from '../../../../auth/store/auth.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/service/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import {appConstant, supplierSimulatorOption} from 'src/app/app.constant';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit, OnDestroy {
  navbarOpen = false;
  hotelSupplierSimulator: string;
  user: UserDetail;
  isSAdmin = false;
  private userSub: Subscription;
  enableAgent: boolean;

  isDemo: boolean;
  enableDemo: boolean;
  constructor(private router: Router, private store: Store<fromApp.AppState>,
              private arlertify: AlertifyService, public translate: TranslateService) {
    translate.setDefaultLang ('en');
    translate.use('en');
   }

  ngOnInit() {
    this.enableAgent = false;
    this.enableDemo = environment.demo || false;
    this.isDemo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
    this.hotelSupplierSimulator = localStorage.getItem(appConstant.HOTEL_SIMULATOR_SUPPLIER) || supplierSimulatorOption.DISABLE;
    this.userSub = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user && this.user.userGroups) {
          this.user.userGroups.forEach(group => {
            if (group.value === adminConstant.ADMIN) {
              this.enableAgent = true;
            }
            if (group.value === adminConstant.SADMIN) {
              this.enableAgent = true;
              this.isSAdmin = true;
            }
          });
          // this.enableAgent = this.user.userGroups.rank < 3;
          // this.isSAdmin = this.user.userGroups.rank === 1;
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
    // sessionStorage.clear();
    this.user = null;
    this.store.dispatch(
      new AuthActions.Logout('')
    );
    // this.route.navigate(['/']);
  }
  profileNav() {
    if (this.isSAdmin) {
      this.router.navigate(['/admin/super/profile', this.user.id]);
    } else {
      this.router.navigate(['/admin/user/profile', this.user.id]);
    }
  }
  agentNav() {
    if (this.isSAdmin) {
      this.router.navigate(['/admin/agency']);
    } else if (this.enableAgent) {
      this.router.navigate(['/admin/agency/edit', this.user.agentId]);
    } else {
      this.router.navigate(['/', this.user.id]);
    }
  }
  userNav() {
    if (this.enableAgent || this.isSAdmin) {
      this.router.navigate(['/admin/user']);
    } else if (this.user) {
      this.router.navigate(['/admin/user/edit', this.user.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
  homePage() {
    this.router.navigate(['/dashboard']);
  }

  walletNav() {
    if ((this.user.walletCredential && this.user.walletCredential.apiUser && this.user.walletCredential.apiPassword) || this.user.active) {
      this.router.navigate(['/wallet']);
    } else {
      this.arlertify.error('This account does not yet have a wallet, check with flotravel admin for more info');
      return;
      // if(this.user.walletCredential){
      //   sessionStorage.setItem('walletLoginError', 'The wallet credentail not correct')
      // }
      // this.router.navigate(['/wallet/login']);
    }
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

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
