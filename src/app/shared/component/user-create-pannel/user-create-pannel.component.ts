import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { adminConstant } from 'src/app/admin/userGroup-constant';
import { appConstant } from 'src/app/app.constant';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { User } from 'src/app/model/auth/user/user';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { SessionStorageService } from 'src/app/service/session-storage.service';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-user-create-pannel',
  templateUrl: './user-create-pannel.component.html',
  styleUrls: ['./user-create-pannel.component.css']
})
export class UserCreatePannelComponent implements OnInit {
  userForm: FormGroup;
  formUserError: boolean;
  account: UserDetail;

  userGroups: UserGroup[];
  event: EventEmitter<User> = new EventEmitter();
  editUser: User;
  agentId: string;

  constructor(
    public bsModalRef: BsModalRef,
    private alertify: AlertifyService,
    private sessionStorageService: SessionStorageService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    if(!this.userGroups){
      this.userGroups = this.sessionStorageService.get(adminConstant.USER_GROUP_LIST, []);
    }
    this.initUserCreateForm();
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    if(this.editUser){
      this.updateUserEditForm(this.editUser);
    } else {
      this.editUser = new User();
    }
  }
  private initUserCreateForm() {
    this.userForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      mobile: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      userGroup: new FormControl('', Validators.required),
      profileImg: new FormControl("", Validators.required)
    });
  }

  onImgError(event) {
    event.target.src = "./assets/no-image.png";
  }

  updateUserEditForm(user: User) {
    this.userForm.patchValue({
      email: user.email,
      mobile: user.mobile,
      firstName: user.firstName,
      lastName: user.lastName,
      userGroup: user.userGroupIds[0],
      profileImg: user.profileImg,
      password: user.password
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = this.editUser;
      userInfo.email = d.email;
      userInfo.mobile = d.mobile;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.userGroupIds = [d.userGroup];
      userInfo.profileImg = d.profileImg;
      userInfo.password = d.password;
      this.event.emit(userInfo);
      this.bsModalRef.hide();
    } else {
      this.formUserError = true;
      return;
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  submit() {
    this.saveUser();
  }
}
