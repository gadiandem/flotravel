import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {appConstant} from 'src/app/app.constant';
import {ModalOptions, BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {Agent} from 'src/app/model/auth/agency/agency';
import {AgentInfo} from 'src/app/model/auth/agency/agent-info';
import {Tariff} from 'src/app/model/auth/agency/tariff';
import {UserGroup} from 'src/app/model/auth/agency/user-group';
import {User} from 'src/app/model/auth/user/user';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {AgencyService} from 'src/app/service/admin/agency/agency.service';
import {UserService} from 'src/app/service/admin/user/user.service';
import {AlertifyService} from 'src/app/service/alertify.service';
import * as fromApp from '../../../store/app.reducer';
import {adminConstant} from '../../userGroup-constant';
import {UserCreatePannelComponent} from 'src/app/shared/component/user-create-pannel/user-create-pannel.component';
import {AgentCreatePannelComponent} from 'src/app/shared/component/agent-create-pannel/agent-create-pannel.component';
import {AgencySellingCurrencyResponse} from '../../../model/auth/agency/selling-currency/agency-selling-currency-response';
import {SellingCurrencyService} from '../../../service/admin/agency/selling-currency/selling-currency.service';
import {CountryRes} from '../../../model/common/country/country-res';
import {SellingCurrency} from '../../../model/auth/agency/selling-currency/selling-currency';
import {AgencySellingCurrencyRequest} from '../../../model/auth/agency/selling-currency/agency-selling-currency-request';
import {map} from 'rxjs/operators';
import {Location} from '@angular/common';

@Component({
  selector: 'app-agent-detail-edit',
  templateUrl: './agent-detail-edit.component.html',
  styleUrls: ['./agent-detail-edit.component.css'],
})
export class AgentDetailEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  agentId: string;
  isLoading: boolean;
  agentDetail: Agent;
  agentList: Agent[];
  userGroupList: UserGroup[];
  formSubmitError: boolean;
  formUserError: boolean;
  account: UserDetail;
  isSAdmin = false;
  agentForm: FormGroup;
  userList: User[];
  subAgents: Agent[];
  userForm: FormGroup;
  sellingCurrencyResponse: AgencySellingCurrencyResponse;
  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  countries: CountryRes[];
  loadingSellingCurrencyDetail = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private _location: Location,
    private userManage: UserService,
    private agencyManage: AgencyService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private modalService: BsModalService,
    private sellingCurrencyService: SellingCurrencyService
  ) {
  }

  ngOnInit() {
    this.formSubmitError = false;
    this.formUserError = false;
    this.bsConfig = new ModalOptions();
    this.agentList = JSON.parse(sessionStorage.getItem('agentList'));
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.activeRoute.params.subscribe((params: Params) => {
      this.agentId = params['agentId'];
      if (this.agentId !== '0') {
        this.isLoading = true;
        if (this.agentList != null) {
          this.agentDetail = this.agentList.find((a) => {
            return a.id === this.agentId;
          });
        }
      } else {
        this.agentDetail = new Agent();
        this.agentDetail.agentInfo = new AgentInfo();
      }
    });
    this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.account = user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.account && this.account.userGroups) {
          this.account.userGroups.forEach(group => {
            if (group.value === adminConstant.SADMIN) {
              this.isSAdmin = true;
            }
          });
        }
      });
    this.store.select('auth').subscribe((authState) => {
      this.account = authState.user;
      if (this.account == null) {
        this.account = JSON.parse(
          localStorage.getItem(appConstant.ACCOUNT_INFO)
        );
      }
      if (this.account != null) {
        this.loadAgent();
      }
    });
    this.initAgentForm();
  }

  loadSellingCurrency() {
    this.loadingSellingCurrencyDetail = true;
    this.sellingCurrencyService.getSellingCurrencyDetail(this.account.id, this.agentDetail.owner).subscribe(
      (res) => {
        this.loadingSellingCurrencyDetail = false;
        this.sellingCurrencyResponse = res;
        sessionStorage.setItem(adminConstant.SELLING_CURRENCY, JSON.stringify(res));
      }, (e) => {
        this.loadingSellingCurrencyDetail = false;
        this.alertify.error(`There is some error!!!`);
      }
    );
  }

  createSellingCurrencyForAgency() {
    this.route.navigate(['/admin/agency/selling-currency/create']);
  }

  editSellingCurrency(code: string) {
    sessionStorage.setItem(adminConstant.SELLING_CURRENCY_CODE, code);
    this.route.navigate(['/admin/agency/selling-currency/edit']);
  }

  deleteSellingCurrency(sellingCurrency: SellingCurrency) {
    const request = new AgencySellingCurrencyRequest();
    request.sellingCurrency = sellingCurrency;
    request.email = this.agentDetail.owner;
    this.sellingCurrencyService.deleteSellingCurrency(this.account.id, request).subscribe(
      (res: any) => {
        this.alertify.success(`Delete success!!!`);
        this.loadSellingCurrency();
      }, (e) => {
        this.alertify.error('There is some error');
      });
  }

  convertToCountryName(countryCode: string): string {
    if (countryCode) {
      const countrySelected = this.countries.filter(item => item.code === countryCode);
      return countrySelected[0].name;
    }
    return '';
  }

  loadAgent() {
    this.subscription = this.agencyManage
      .getAgency(this.agentId, this.account.id)
      .subscribe(
        (res: Agent) => {
          this.agentDetail = res;
          if (!this.agentDetail.tariff) {
            this.agentDetail.tariff = new Tariff();
          }
          sessionStorage.setItem(
            adminConstant.AGENTDETAIL,
            JSON.stringify(res)
          );
          this.userGroupList = res.userGroupList;
          this.userList = res.userList;
          this.subAgents = res.subAgents;
          this.updateAgentFormData();
          if (this.isSAdmin) {
            this.loadSellingCurrency();
          }
          this.isLoading = false;
        },
        (e) => {
          this.isLoading = false;
        }
      );
  }

  private updateAgentFormData() {
    if (this.agentDetail.agentInfo) {
      this.agentForm.patchValue({
        agentInfo: {
          address: this.agentDetail.agentInfo.address,
          logo: this.agentDetail.agentInfo.logo,
          website: this.agentDetail.agentInfo.website,
        }
      });
    }

    this.agentForm.patchValue({
      name: this.agentDetail.name,
    });
  }

  private initAgentForm() {
    this.agentForm = new FormGroup({
      agentInfo: new FormGroup({
        address: new FormControl('', Validators.required),
      }), name: new FormControl('', Validators.required),
      userList: new FormArray([
        new FormGroup({
          email: new FormControl(''),
          name: new FormControl(''),
        }),
      ]),
    });
  }

  addSubAgent(agentInfo: Agent) {
    this.agencyManage.createNewSubAgency(agentInfo, this.account.id).subscribe(
      (res: Agent) => {
        this.alertify.success(`SubAgent ${res.name} create succeeful!`);
        this.loadAgent();
      },
      (e) => {
        this.alertify.error(`There is some error!!!`);
      }
    );
  }

  editSubAgent(agentInfo: Agent) {
    this.agencyManage.editSubAgency(agentInfo, this.account.id).subscribe(
      (res: Agent) => {
        this.alertify.success(`SubAgent ${res.name} update succeeful!`);
        this.loadAgent();
      },
      (e) => {
        this.alertify.error(`${e.error.message}`);
        console.log(e);
      }
    );
  }

  // removeSubAgent(agentId: string) {
  //   this.alertify.confirm('Are you sure you want to delete this Agent?', () => {
  //     this.agencyManage
  //       .deleteSubAgency(agentId, this.account.id, this.agentDetail.id)
  //       .subscribe(
  //         (res: any) => {
  //           this.alertify.success(`Agent is deleted succeeful`);
  //           this.loadAgent();
  //         },
  //         (e) => {
  //           this.alertify.error('There is some error!!!');
  //         }
  //       );
  //   });
  // }

  userGroupName(userGroupId: string): string {
    if (this.userGroupList != null) {
      const userGroup = this.userGroupList.find(
        (u: UserGroup) => u.id === userGroupId
      );
      if (userGroup != undefined) {
        return userGroup.value;
      }
    }
    return null;
  }

  addUser(user: User) {
    this.userManage
      .createNewUser(user, this.account.id, this.agentId)
      .subscribe(
        (res: User) => {
          this.loadAgent();
          this.alertify.success(`User ${res.firstName} save succeeful`);
        },
        (e) => {
          this.loadAgent();
          this.alertify.error(`${e.error.message}`);
        }
      );
  }

  editUser(user: User) {
    this.userManage.editUser(user, this.account.id).subscribe(
      (res: User) => {
        this.alertify.success(`User ${res.firstName} update succeeful:`);
        this.loadAgent();
      },
      (e) => {
        this.loadAgent();
        this.alertify.error(`${e.error.message}`);
      }
    );
  }

  // removeUser(userId: string) {
  //   this.alertify.confirm('Are you sure you want to delete this User?', () => {
  //     this.userManage.deleteUser(this.account.id, userId).subscribe(
  //       (res: any) => {
  //         // console.log('delete success!');
  //         this.alertify.success(`User is deleted succeeful`);
  //         this.loadAgent();
  //       },
  //       (e) => {
  //         this.alertify.error('There is some error!!!');
  //         this.loadAgent();
  //       }
  //     );
  //   });
  // }

  saveAgent() {
    if (this.agentForm.valid) {
      const d: Agent = this.agentForm.value;
      const agentInfo: Agent = this.agentDetail;
      // agentInfo.agentId = d.agentId;
      const agentInfoDetail = new AgentInfo();
      agentInfoDetail.address = d.agentInfo.address;
      agentInfo.agentInfo = agentInfoDetail;
      agentInfo.name = d.name;
      this.agencyManage.editAgency(agentInfo, this.account.id).subscribe(
        (res: Agent) => {
          this.alertify.success(`Agent ${res.name} save succeeful`);
        },
        (e) => {
          this.alertify.error(`${e.error.message}`);
          console.log(e);
        },
        () => this._location.back()
      );
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openAgentComponent(agent?: Agent) {
    const initialState = {
      agentDetail: Object.assign({}, this.agentDetail),
      account: this.account,
      editAgent: agent,
    };

    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      AgentCreatePannelComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res) => {
      if (agent) {
        this.editSubAgent(res);
      } else {
        this.addSubAgent(res);
      }
    });
  }

  openUserComponent(user?: User) {
    const initialState = {
      userGroups: [...this.agentDetail.userGroupList],
      agentId: this.agentDetail.id,
      editUser: user,
    };

    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      UserCreatePannelComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res) => {
      if (user) {
        this.editUser(res);
      } else {
        this.addUser(res);
      }
    });
  }
}
