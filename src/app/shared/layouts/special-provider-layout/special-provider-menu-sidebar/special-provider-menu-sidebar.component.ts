import {Component, OnInit, Renderer2} from '@angular/core';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import {appConstant} from 'src/app/app.constant';

@Component({
  selector: 'app-special-provider-menu-sidebar',
  templateUrl: './special-provider-menu-sidebar.component.html',
  styleUrls: ['./special-provider-menu-sidebar.component.css']
})
export class SpecialProviderMenuSidebarComponent implements OnInit {
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
