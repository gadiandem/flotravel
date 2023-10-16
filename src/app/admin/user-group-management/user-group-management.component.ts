import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators';
import { process } from '@progress/kendo-data-query';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import * as fromApp from '../../store/app.reducer';
import { UserGroupService } from 'src/app/service/admin/user-group/user-group.service';
import { UserGroup } from 'src/app/model/auth/agency/user-group';
import { adminConstant } from '../userGroup-constant';
import { SessionStorageService } from 'src/app/service/session-storage.service';
import { defaultData } from '../../app.constant';

@Component({
  selector: 'app-user-group-management',
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.css']
})
export class UserGroupManagementComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  public gridData: UserGroup[];
  public gridView: UserGroup[];
  isLoading: boolean;

  userGroupCreate: UserGroup;
  accountInfo: UserDetail;
  defaultData: string;
  constructor(private userGroupManage: UserGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private sessionStorageService: SessionStorageService,
    private store: Store<fromApp.AppState>) { }


  public ngOnInit(): void {
    this.isLoading = true;
    this.defaultData = defaultData.noImage;
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.accountInfo = user;
        if (this.accountInfo == null) {
          this.accountInfo = JSON.parse(localStorage.getItem('accountInfo'));
        }
        if (this.accountInfo != null) {
          let sAdmin = false;
          this.accountInfo.userGroups.forEach(group => {
            if(group.value === adminConstant.SADMIN){
              sAdmin = true;
            }
          })
          if(sAdmin){
            this.getUserGroupList();
          }
        }
      });
  }
  getUserGroupList() {
    this.isLoading = true;
    this.userGroupManage.getUserGroupList(this.accountInfo.id).subscribe(
      (res: UserGroup[]) => {
        // console.log('getdata: ' + res);
        if (res != null) {
          this.gridData = res;
          this.gridView = this.gridData;
          this.sessionStorageService.set(adminConstant.USER_GROUP_LIST, res);
        }
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'primary',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  createNewUserGroup() {
    // this.openModalWithComponent(null);
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  editUserGroup(id: string) {
    console.log(id);
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

  deleteUserGroup(id: string) {
    console.log(id);
    this.alertify.confirm('Are you sure you want to delete this Agent?', () => {
      this.userGroupManage.deleteUserGroup(id, this.accountInfo.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          console.log('delete success:!!!' + res);
          this.getUserGroupList();
        }, e => {
          this.alertify.error(e.error.message);
          console.log(e);
        }
      );
    });

  }
}
