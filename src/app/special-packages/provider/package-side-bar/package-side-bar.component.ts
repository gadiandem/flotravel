import { Component, OnInit } from '@angular/core';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-package-side-bar',
  templateUrl: './package-side-bar.component.html',
  styleUrls: ['./package-side-bar.component.css']
})
export class PackageSideBarComponent implements OnInit {
  user: UserDetail;
  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
  }

}
