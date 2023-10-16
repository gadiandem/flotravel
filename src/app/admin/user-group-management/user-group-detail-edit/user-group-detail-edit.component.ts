import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appConstant, defaultData } from 'src/app/app.constant';

import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { UserGroupDetail } from 'src/app/model/auth/user-group/user-group-detail';
import { User } from 'src/app/model/auth/user/user';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserGroupService } from 'src/app/service/admin/user-group/user-group.service';
import { UserService } from 'src/app/service/admin/user/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { SessionStorageService } from 'src/app/service/session-storage.service';
import * as fromApp from '../../../store/app.reducer';
import { adminConstant } from '../../userGroup-constant';

@Component({
  selector: "app-user-group-detail",
  templateUrl: "./user-group-detail-edit.component.html",
  styleUrls: ["./user-group-detail-edit.component.css"],
})
export class UserGroupDetailEditComponent implements OnInit {
  userGroupId: string;
  isLoading: boolean;
  userGroupDetail: UserGroupDetail;
  userList: User[];
  userGroupValue: UserGroup;
  formSubmitError: boolean;
  formUserError: boolean;
  account: UserDetail;
  userGroups: UserGroup[];

  userGroupForm: FormGroup;
  isShowFormUser: boolean;
  userForm: FormGroup;
  tempUser: User;
  isNewUserGroup: boolean;
  editUserMode: boolean;
  userGroupEditable: boolean;
  defaultData: string;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private userManage: UserService,
    private userGroupManage: UserGroupService,
    private sessionStorageService: SessionStorageService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.formSubmitError = false;
    this.formUserError = false;
    this.isShowFormUser = false;
    this.userGroupEditable = false;
    this.defaultData = defaultData.noImage;
    this.userGroups = this.sessionStorageService.get(adminConstant.USER_GROUP_LIST, []);
    this.activeRoute.params.subscribe((params: Params) => {
      this.userGroupId = params["userGroupId"];
    });
    this.store.select("auth").subscribe((authState) => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }

      console.log("userGroupId: " + this.userGroupId);
      if (this.account != null) {
        this.loadUserGroupDetail();
      }
    });
    this.initUserGroupForm();
  }

  loadUserGroupDetail() {
    this.userGroupManage
      .getUserGroupDetail(this.userGroupId, this.account.id)
      .subscribe(
        (res: UserGroupDetail) => {
          this.userGroupDetail = res;
          this.sessionStorageService.set(adminConstant.USER_GROUP_DETAIL, res);
          this.userGroupValue = res.userGroup;
          if (!this.userGroupValue.primary) {
            this.userGroupEditable = true;
          }
          console.log("primary: " + this.userGroupValue.primary);
          this.updateUserGroupData(res.userGroup);
          this.userList = res.userList;
          this.isLoading = false;
        },
        (e) => {
          this.isLoading = false;
          console.log(e);
        }
      );
  }
  initUserGroupForm() {
    this.userGroupForm = new FormGroup({
      // rank: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      value: new FormControl("", Validators.required),
      icon: new FormControl("", Validators.required),
      primary: new FormControl(false, Validators.required),
    });
  }
  private updateUserGroupData(userGroup: UserGroup) {
    this.userGroupForm.patchValue({
      // rank: userGroup.rank,
      value: userGroup.value,
      // primary: userGroup.primary,
      icon: userGroup.icon,
    });
  }
  private initUserCreateForm() {
    this.userForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      mobile: new FormControl("", Validators.required),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      userGroup: new FormControl('', Validators.required),
      profileImg: new FormControl(""),
      enabled: new FormControl(""),
      expired: new FormControl(""),
      locked: new FormControl(""),
    });
  }
  private updateUserEditForm(user: User) {
    this.userForm.patchValue({
      email: user.email,
      mobile: user.mobile,
      firstName: user.firstName,
      lastName: user.lastName,
      userGroup: user.userGroupIds,
      profileImg: user.profileImg,
      enabled: user.enabled,
      expired: user.expired,
      locked: user.locked,
    });
  }

  addUser() {
    this.isShowFormUser = true;
    this.tempUser = null;
    this.editUserMode = false;
    this.formUserError = false;
    this.initUserCreateForm();
  }
  editUser(user: User) {
    this.isShowFormUser = true;
    this.tempUser = user;
    this.editUserMode = true;
    this.initUserCreateForm();
    this.updateUserEditForm(user);
    console.log("edit user: " + JSON.stringify(user));
  }

  onImgError(event) {
    event.target.src = this.defaultData;
  }

  saveUser() {
    if (this.userForm.valid) {
      const d = this.userForm.value;
      const userInfo: User = this.tempUser;
      userInfo.email = d.email;
      userInfo.mobile = d.mobile;
      userInfo.firstName = d.firstName;
      userInfo.lastName = d.lastName;
      userInfo.userGroupIds = [d.userGroup];
      userInfo.enabled = d.enabled;
      userInfo.expired = d.expired;
      userInfo.locked = d.locked;
      userInfo.profileImg = d.profileImg;
      if (this.editUserMode) {
        this.userManage.editUser(userInfo, this.account.id).subscribe(
          (res: User) => {
            // this.notify = true;
            // this.message = `User ${res.name} update succeeful:`;
            this.alertify.success(`User ${res.firstName} update succeeful:`);
            console.log("user edited: " + JSON.stringify(res));
            this.loadUserGroupDetail();
          },
          (e) => {
            console.log(e);
            this.alertify.error(`${e.error.message}`);
          }
        );
      } else {
        userInfo.password = d.password;
        userInfo.agentId = this.account.agentId;
        this.userManage.createNewUser(userInfo, this.account.id, "").subscribe(
          (res: User) => {
            console.log("user save: " + JSON.stringify(res));
            // this.notify = true;
            // this.message = `User ${res.name} save succeeful:`;
            this.alertify.success(`User ${res.firstName} save succeeful`);
            this.loadUserGroupDetail();
          },
          (e) => {
            console.log(e);
            this.alertify.error(`${e.error.message}`);
          }
        );
      }
      console.log("save user: " + JSON.stringify(d));
      this.isShowFormUser = false;
    } else {
      this.formUserError = true;
      return;
    }
  }

  removeUser(userId: string) {
    this.alertify.confirm("Are you sure you want to delete this User?", () => {
      this.userManage.deleteUser(this.account.id, userId).subscribe(
        (res: any) => {
          // console.log('delete success!');
          this.alertify.success(`User is deleted succeeful`);
          this.loadUserGroupDetail();
        },
        (e) => {
          this.alertify.error(e.error.message);
          console.log("there is some error!!!");
        }
      );
    });
  }

  saveUserGroup() {
    if (this.userGroupForm.valid) {
      const d: UserGroup = this.userGroupForm.value;
      if (this.userGroupEditable) {
        console.log("agent update: " + JSON.stringify(d));
        d.id = this.userGroupValue.id;
        this.userGroupManage.editUserGroup(d, this.account.id).subscribe(
          (res: UserGroup) => {
            this.alertify.success(`Group ${res.value} save succeeful`);
            console.log("agent updated: " + JSON.stringify(res));
          },
          (e) => {
            this.alertify.error(`${e.error.message}`);
            console.log(e);
          },
          () => this.route.navigate(["/admin/userGroup"])
        );
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  cancelUserForm() {
    this.isShowFormUser = false;
  }
  closeUserForm(event: boolean){
    console.log(event);
    this.isShowFormUser = !event;
  }
}
