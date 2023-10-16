import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { Agent } from 'src/app/model/auth/agency/agency';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import * as fromApp from '../../store/app.reducer';
import { adminConstant } from '../userGroup-constant';
import { appConstant, defaultData } from 'src/app/app.constant';

@Component({
  selector: 'app-agency-management',
  templateUrl: './agency-management.component.html',
  styleUrls: ['./agency-management.component.css'],
})
export class AgencyManagementComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true })
  dataBinding: DataBindingDirective;
  public gridData: Agent[];
  public gridView: Agent[];
  isLoading: boolean;

  agencyCreate: Agent;
  accountInfo: UserDetail;
  defaultData: string;
  constructor(
    private agencyManage: AgencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.defaultData = defaultData.noImage;
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.accountInfo = user;
        if (this.accountInfo == null) {
          this.accountInfo = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        }
        if (this.accountInfo != null) {
          this.chooseComponentRender(this.accountInfo);
        }
      });
  }

  chooseComponentRender(accountInfo: UserDetail) {
    let isSAdmin = false;
    let isAdmin = false;
    accountInfo.userGroups.forEach((group) => {
      if (group.value === adminConstant.SADMIN) {
        isSAdmin = true;
      }
      if (group.value === adminConstant.ADMIN) {
        isAdmin = true;
      }
    });
    if (isSAdmin) {
      this.getAgencyList();
    }
    if (isAdmin) {
      this.router.navigate(['./', accountInfo.agentId], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  getAgencyList() {
    this.isLoading = true;
    this.agencyManage.getAgencyList(this.accountInfo.id).subscribe(
      (res: Agent[]) => {
        if (res != null) {
          res.forEach((e) => {
            const parent: Agent = res.find((child) => child.id === e.parent);
            if (parent != undefined) {
              e.parent = parent.name;
            } else {
              e.parent = 'Parent Agency';
            }
          });
          this.gridData = res;
          this.gridView = this.gridData;
          sessionStorage.setItem('agentList', JSON.stringify(res));
          this.isLoading = false;
        }
      },
      (e) => {
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
            value: inputValue,
          },
          {
            field: 'agency',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'parent',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'owner',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  createNewAgency() {
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }

  editAgency(id: string) {
    this.router.navigate(['./edit', id], { relativeTo: this.activatedRoute });
  }

  deleteAgency(id: string) {
    this.alertify.confirm('Are you sure you want to delete this Agent?', () => {
      this.agencyManage.deleteAgency(id, this.accountInfo.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getAgencyList();
        },
        (e) => {
          this.alertify.error('There is some error');
        }
      );
    });
  }
}
