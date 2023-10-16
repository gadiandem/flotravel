import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from "../../../store/app.reducer";
import { UserListRes } from 'src/app/model/auth/user/userListRes';
import { UserService } from 'src/app/service/admin/user/user.service';
import { appConstant } from 'src/app/app.constant';
import { UserDetail } from 'src/app/model/auth/user/user-detail';

@Component({
  selector: 'app-agency-booking',
  templateUrl: './agency-booking.component.html',
  styleUrls: ['./agency-booking.component.css']
})
export class AgencyBookingComponent implements OnInit {

  userList:UserListRes[];
  isload: boolean;
  isCheck: boolean;
  currentUser: UserDetail;

  @Output()
  userSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  agencyBooking: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private userService: UserService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select("auth").subscribe((authState) => {
      this.currentUser = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    });
    this.getUserList();
  }

  getUserList(){
    this.isload = true;
    this.userService.getUserList(this.currentUser.id).subscribe(
      (res: UserListRes[]) => {
        this.isload = false;
        this.userList = res;
      }, e => {
        this.isload = false;
        console.log(e);
      }
    )
  }

  enableAgencyBooking(event: any){
      this.isCheck = event.target.checked;
      this.agencyBooking.emit(this.isCheck);
  }

  onAgentSelected(value: any){
    console.log(value);
    this.userSelected.emit(value);
  }

}
