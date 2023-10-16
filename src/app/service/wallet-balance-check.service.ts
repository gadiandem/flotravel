import {Injectable, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {appConstant} from '../app.constant';
import {adminConstant} from '../admin/userGroup-constant';
import {UserDetail} from '../model/auth/user/user-detail';

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceCheckService {
  private userSub: Subscription;
  user: UserDetail;

  constructor(private store: Store<fromApp.AppState>) {
    this.userSub = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.user = user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      });
  }
}
