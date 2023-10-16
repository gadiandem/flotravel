import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/service/admin/user/user.service';
import {DataBindingDirective, GridDataResult} from '@progress/kendo-angular-grid';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';

import { User } from 'src/app/model/auth/user/user';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import * as fromApp from '../../store/app.reducer';
import { UserListRes } from 'src/app/model/auth/user/userListRes';
import { appConstant } from 'src/app/app.constant';
import { adminConstant } from '../userGroup-constant';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true })
  dataBinding: DataBindingDirective;
  public gridData: UserListRes[];
  gridView: GridDataResult;
  skip = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading: boolean;
  accountInfo: UserDetail;
  agentId: string;

  userCreate: User;
  constructor(private userManage: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.accountInfo = user;
        if (this.accountInfo == null) {
          this.accountInfo = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        }
        if (this.accountInfo != null) {
          this.chooseComponentRender(this.accountInfo);
        }
      });
    // this.getUserList();

  }
  chooseComponentRender(accountInfo: UserDetail) {
    let isAdmin = false;

    if (accountInfo.userGroups ) {
      accountInfo.userGroups.forEach(group => {
        if (group.value === adminConstant.ADMIN || group.value === adminConstant.SADMIN) {
          isAdmin = true;
        }
      });
      if (isAdmin) {
        this.getUserList();
      }
    } else {
      this.router.navigate(['edit', accountInfo.id], { relativeTo: this.activatedRoute });
    }
  }
  getUserList(searchText?: string) {
    if (!this.accountInfo.agentId) {
      this.agentId = '';
    } else {
      this.agentId = this.accountInfo.agentId;
    }
    this.isLoading = true;
    this.userManage.getUserListPagination(this.currentPage, this.pageSize, searchText).subscribe(
      (res: any) => {
        // console.log('getdata: ' + res.status);
        this.gridData = res;
        this.gridView = {
          data: res.data,
          total: res.count
        };
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }
  pageChange(event: any): void {
    this.skip = event.skip;
    const page = this.skip / this.pageSize;
    this.currentPage = page;
    this.getUserList();
  }

  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.getUserList(inputValue);
    this.gridView.data = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'agentName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'email',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  createNewUser() {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  editUser(id: string) {
    console.log(id);
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }


  deleteUser(user: UserListRes) {
    console.log(JSON.stringify(user));
    this.alertify.confirm('Are you sure you want to delete this Agent?', () => {
      this.userManage.deleteUser(this.accountInfo.id, user.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getUserList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }
}
