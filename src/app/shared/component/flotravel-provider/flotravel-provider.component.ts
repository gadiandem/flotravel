import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import * as fromApp from '../../../store/app.reducer';
import { User } from 'src/app/model/auth/user/user';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { UserListRes } from 'src/app/model/auth/user/userListRes';
import { UserService } from 'src/app/service/admin/user/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { map } from 'rxjs/operators';
import { appConstant } from 'src/app/app.constant';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { FlotravelProviderService } from 'src/app/service/admin/provider/flotravel-provider.service';
import { FlotravelProvider } from 'src/app/model/auth/provider/flotravel-provider';
import { UserCreatePannelComponent } from '../user-create-pannel/user-create-pannel.component';
import { ProviderPanelComponent } from '../provider-panel/provider-panel.component';

@Component({
  selector: 'app-flotravel-provider',
  templateUrl: './flotravel-provider.component.html',
  styleUrls: ['./flotravel-provider.component.css']
})
export class FlotravelProviderComponent implements OnInit {
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  public gridData: FlotravelProvider[];
  public gridView: FlotravelProvider[];
  isLoading: boolean;
  accountInfo: UserDetail;
  agentId: string;

  userCreate: User;
  constructor(private providerService: FlotravelProviderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.bsConfig = new ModalOptions();
    this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.accountInfo = user;
        if (this.accountInfo == null) {
          this.accountInfo = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        }
      });
    this.getProviderList();
  }
  getProviderList() {

    this.isLoading = true;
    this.providerService.getProviderList(this.accountInfo.id).subscribe(
      (res: FlotravelProvider[]) => {
        // console.log('getdata: ' + res.status);
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  createNewProvider(provider: FlotravelProvider) {
    this.providerService.createProvider(provider, this.accountInfo.id).subscribe(
      (res: FlotravelProvider) => {
        this.getProviderList();
        this.alertify.success(`Create  provider ${res.name} Success:!!!`);
      }, e => {
        this.alertify.error(`Create provider Error:!!!`);
      }
    )
  }

  editProvider(provider: FlotravelProvider) {
    this.providerService.editProvider(provider, this.accountInfo.id).subscribe(
      (res: FlotravelProvider) => {
        this.getProviderList();
        this.alertify.success(`Update  provider ${res.name} Success:!!!`);
      }, e => {
        this.alertify.error(`Update provider Error:!!!`);
      }
    )
  }

  deleteProvider(user: FlotravelProvider) {
    console.log(JSON.stringify(user));
    this.alertify.confirm('Are you sure you want to delete this provider?', () => {
      this.providerService.deleteProvider(this.accountInfo.id, user.id).subscribe(
        (res: any) => {
          this.getProviderList();
          this.alertify.success(`delete success:!!!`);
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }

  openProviderComponent(provider?: FlotravelProvider) {
    const initialState = {
      editProvider: provider,
    };

    this.bsConfig.initialState = initialState;
    this.bsConfig.class = "modal-lg";
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      ProviderPanelComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = "Close";

    this.bsModalRef.content.event.subscribe((res) => {
      if (provider) {
        this.editProvider(res);
      } else {
        this.createNewProvider(res);
      }
    });
  }

}
