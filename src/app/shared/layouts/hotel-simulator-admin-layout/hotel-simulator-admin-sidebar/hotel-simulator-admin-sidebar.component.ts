import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserDetail } from '../../../../model/auth/user/user-detail';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { appConstant } from '../../../../app.constant';

@Component({
  selector: 'app-hotel-simulator-admin-sidebar',
  templateUrl: './hotel-simulator-admin-sidebar.component.html',
  styleUrls: ['./hotel-simulator-admin-sidebar.component.css']
})
export class HotelSimulatorAdminSidebarComponent implements OnInit {
  user: UserDetail;
  itemActive: string;
  // accountProfile: UserInfoRes;
  constructor(private renderer: Renderer2,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    // this.store.select('wallet').subscribe(data => {
    //   this.accountProfile = data.merchantProfileRes;
    // })
  }
}
