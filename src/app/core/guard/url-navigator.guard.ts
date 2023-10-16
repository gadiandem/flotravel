import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, RouterStateSnapshot,
    Router
} from '@angular/router';
import {LoginService} from '../../service/login/login.service';

@Injectable()
export class URLNavigatorGuard {
    private firstNavigation = true;
    constructor(private router: Router, private loginService: LoginService) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (!this.loginService.authenticated) {
          console.log("Login failed!");
          this.router.navigateByUrl("/auth/login");
        }
        // if (this.firstNavigation) {
        //     this.firstNavigation = false;
        //     if (route.component != DashboardComponent) {
        //         this.router.navigate(['/']);
        //         return false;
        //     }
        // }
        return true;
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //     if (!this.userService.isGuest()) {
    //       return true;
    //     } else {
    //       this.router.navigate(['/login'], {
    //         queryParams: {
    //           return: state.url
    //         }
    //       });
    //       return false;
    //     }
    //   }
}
