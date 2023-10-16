import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appConstant } from 'src/app/app.constant';

import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserGroupService } from 'src/app/service/admin/user-group/user-group.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-user-group-detail-create',
  templateUrl: './user-group-detail-create.component.html',
  styleUrls: ['./user-group-detail-create.component.css']
})
export class UserGroupDetailCreateComponent implements OnInit {
  userGroupForm: FormGroup;
  formSubmitError: boolean;
  account: UserDetail;

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private userGroupManage: UserGroupService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.formSubmitError = false;
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
    this.initUserGroupForm();
  }
  initUserGroupForm() {
    this.userGroupForm = new FormGroup({
      // rank: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      value: new FormControl('', Validators.required),
      icon: new FormControl('', Validators.required)
    });
  }
  onImgError(event) {
    event.target.src = "./assets/no-image.png";
  }
  saveUserGroup() {
    if (this.userGroupForm.valid) {
      const d: UserGroup = this.userGroupForm.value;

        this.userGroupManage.createNewUserGroup(d, this.account.id).subscribe(
          (res: UserGroup) => {
            this.alertify.success(`Group ${res.value} create succeeful`);
            this.route.navigate(['../'], { relativeTo: this.activeRoute });
          }, e => {
            this.alertify.error(`There is some error!!!`);
            console.log(e);
          }, () => this.route.navigate(['/admin/userGroup'])
        );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
