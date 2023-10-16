import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from "@angular/router";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserDetail } from "../../model/auth/user/user-detail";
import * as fromApp from "src/app/store/app.reducer";
import { Store } from "@ngrx/store";
import { appConstant } from "../../app.constant";

@Injectable({
  providedIn: "root",
})
export class WalletGuard implements CanLoad {
  account: UserDetail;
  constructor(private router: Router) {}

  //   canActivate(
  //     route: ActivatedRouteSnapshot,
  //     state: RouterStateSnapshot
  //   ): boolean {
  //     this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
  //     // if (this.firstNavigation) {
  //     //     this.firstNavigation = false;
  //     //     if (route.component != DashboardComponent) {
  //     //         this.router.navigate(['/']);
  //     //         return false;
  //     //     }
  //     // }
  //     return true;
  //   }

  canLoad(route: Route, segments: UrlSegment[]) {
    this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    if (!this.account) {
      return true;
    } else {
      return false;
    }
  }
}
