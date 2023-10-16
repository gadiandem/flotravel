import { Component, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';

import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { UserInfoRes } from 'src/app/model/wallet/profile/user-info-res';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css'],
})
export class MenuSidebarComponent implements OnInit {
  user: UserDetail;
  isManageMoneyCollapsed: boolean;
  isBankAccountCollapsed: boolean;
  isTransactionsCollapsed: boolean;
  itemActive: string;
  accountProfile: UserInfoRes;
  constructor(private renderer: Renderer2,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.isManageMoneyCollapsed = true;
    this.isBankAccountCollapsed = true;
    this.isTransactionsCollapsed = true;
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.store.select('wallet').subscribe(data => {
      this.accountProfile = data.merchantProfileRes;
    });
  }

  toggleClass(event: any, className: string, itemActive: string) {
    const hasClass = event.currentTarget.classList.contains(className);
    this.updateItemActive(itemActive);
    if (hasClass) {
      this.renderer.removeClass(event.currentTarget, className);
      this.renderer.removeClass(event.currentTarget, 'menu-is-opening');
    } else {
      this.renderer.addClass(event.currentTarget, className);
      this.renderer.addClass(event.currentTarget, 'menu-is-opening');
    }
  }

  updateItemActive(itemActive: string) {
    this.itemActive = itemActive;
    if (itemActive === 'manageMoney') {
      this.isManageMoneyCollapsed = !this.isManageMoneyCollapsed;
    }
    if (itemActive === 'bankAccount') {
      this.isBankAccountCollapsed = !this.isBankAccountCollapsed;
    }
    if (itemActive === 'transactions') {
      this.isTransactionsCollapsed = !this.isTransactionsCollapsed;
    }
  }
}
