import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import { appConstant } from 'src/app/app.constant';
import { MerchantModel } from 'src/app/model/auth/merchant/merchant-model';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { adminConstant } from '../userGroup-constant';
import { MerchantService } from 'src/app/service/admin/merchant/merchant.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  public gridData: MerchantModel[];
  public gridView: MerchantModel[];
  isLoading: boolean;
  accountInfo: UserDetail;
  agentId: string;
  mercahntCreate: MerchantModel;
  canInitialize: boolean;
  constructor(private merchantService: MerchantService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.canInitialize = false;
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
    let isAdmin =false;

    if (accountInfo.userGroups ) {
      accountInfo.userGroups.forEach(group => {
        if(group.value === adminConstant.ADMIN || group.value === adminConstant.SADMIN){
          isAdmin = true;
        }
      })
      if(isAdmin){
        this.getMerchantList();
      }
    } else {
      this.router.navigate(['edit', accountInfo.id], { relativeTo: this.activatedRoute });
    }
  }
  getMerchantList() {
    if (!this.accountInfo.agentId) {
      this.agentId = '';
    } else {
      this.agentId = this.accountInfo.agentId;
    }
    this.isLoading = true;
    this.merchantService.getMerchantList(this.accountInfo.id).subscribe(
      (res: MerchantModel[]) => {
        if(res.length == 0){
          this.canInitialize = true;
        }
        this.gridData = res;
        this.gridView = this.gridData;
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  createMerchant() {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  editMerchant(id: string) {
    console.log(id);
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

  initialMerchant(){
    this.merchantService.initialMerchant(this.accountInfo.id).subscribe(
      (res: any) => {
        this.alertify.success(`initialize merchant success:!!!`);
        this.getMerchantList();
      }, e => {
        this.alertify.error(`${e.error.message}`);
      }
    )
  }
  deleteMerchant(merchant: MerchantModel) {
    console.log(JSON.stringify(merchant));
    this.alertify.confirm('Are you sure you want to delete this Merchant?', () => {
      this.merchantService.deleteMerchant(merchant.id, this.accountInfo.id).subscribe(
        (res: any) => {
          this.alertify.success(`delete success:!!!`);
          this.getMerchantList();
        }, e => {
          this.alertify.error(`${e.error.message}`);
        }
      );
    });
  }
}
