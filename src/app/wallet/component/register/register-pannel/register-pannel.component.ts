import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {Location} from '@angular/common';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions, BsModalRef, BsModalService, } from "ngx-bootstrap/modal";
import { Observable, Observer, of } from 'rxjs';

import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { appConstant } from 'src/app/app.constant';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import { PrivacyPolicyModalComponent } from '../privacy-policy-modal/privacy-policy-modal.component';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import { CreateCustomerReq } from 'src/app/model/wallet/register/create-customer-req';
import * as fromApp from 'src/app/store/app.reducer';
import * as WalletActions from 'src/app/wallet/store/wallet.actions';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/model/wallet/profile/user-info';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { CreateCustomerRes } from 'src/app/model/wallet/register/create-customer-res';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserCreateRequest } from 'src/app/model/wallet/register/user-create-req';
import { StateListRes } from 'src/app/model/common/country/state-list-res';
import { StateInfo } from 'src/app/model/common/country/state-info';

@Component({
  selector: "app-register-pannel",
  templateUrl: "./register-pannel.component.html",
  styleUrls: ["./register-pannel.component.css"],
})
export class RegisterPannelComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  registerForm: FormGroup;
  
  searchCountry='';
  country$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  countryCode: string;
  currencyCode: string;
  countryName: string;
  currencyName: string;
  errorMessage: string[] = [];

  currencies: CurrencyNewRes[];
  account: UserDetail;

  stateList: StateInfo[];
  constructor(private modalService: BsModalService,
    private searchCountryService: SearchCountryService,
    private _location: Location,
     private fb: FormBuilder,
     private walletService: WalletKycService,
     private dateAdapter: NgbDateAdapter<string>,
     private alertify: AlertifyService,
     private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.autoCompleteCountry();
    this.store.select('auth').subscribe(authState => {
      this.account = authState.user;
      if (!this.account) {
        this.account = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      }
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: ["", Validators.required],
          confirmPassword: ["", Validators.required],
        },
        { validator: passwordMatcher }
      ),
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      postalCode: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      country: ["", Validators.required],
      mobile: ["", Validators.required],
      language: ["", Validators.required],
      currency: ["", Validators.required],
    });
  }

  autoCompleteCountry() {
    // this.sugFlyFrom$ = this.searchAutoComplement(1);
    this.country$ = new Observable((observer: Observer<string>) => {
      observer.next(this.searchCountry);
    }).pipe(
      debounceTime(300),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchCountryService.searchCountry(this.searchCountry).pipe(
            map((data: CountryRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  
  selectResidenceCountry(selectedCountry: CountryRes) {
    console.log(selectedCountry.name + ' - ' + selectedCountry.code);
    this.countryCode = selectedCountry.code;
    this.countryName = selectedCountry.name;
    this.fetchStates(this.countryCode);
  }

  fetchStates(countryCode: string){
    this.searchCountryService.getStatus(countryCode).subscribe(
      (res: StateListRes) => {
        if(res.states){
          this.stateList = res.states;
        } else {
          this.alertify.error(`Create Customer ${res.errorCode} - ${res.errorMessage} error`)
        }
      }, e => {

      }
    )
  }

  privacyDetail() {
    const modelCount = this.modalService.getModalsCount();
    this.bsConfig.class = "modal-xl";
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      PrivacyPolicyModalComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = "Close";
  }

  register() {
    if (this.registerForm.valid) {
      const d = this.registerForm.value;
      console.log(JSON.stringify(d));
      const createCustomerReq = new CreateCustomerReq();
      const user = new UserCreateRequest();
      user.type = 'M';
      user.firstName = d.firstName;
      user.lastName = d.lastName;
      user.email = d.email;
      user.password = d.passwordGroup.password;
      user.retypePassword = d.passwordGroup.confirmPassword;
      user.address = d.address;
      user.city = d.city;
      user.state = d.state;
      user.postalCode = d.postalCode;
      user.dateOfBirth = d.dateOfBirth;
      user.country = this.countryCode || d.country;
      user.mobile = d.mobile;
      user.language = d.language;
      user.currency = d.currency;

      createCustomerReq.user = user;
      // console.log(JSON.stringify(createCustomerReq));
      this.walletService.register(createCustomerReq, this.account.id).subscribe(
        (res: CreateCustomerRes) => {
          console.log(JSON.stringify(res));
          if(res.errorId){
            this.alertify.error(`Create Customer ${res.errorCode} - ${res.errorMessage} error`)
            this.errorMessage = [`Create Customer ${res.errorCode} - ${res.errorMessage} error`]
          } else{
            this.alertify.success(`Create Customer ${res.user.name} successful`);
            this.errorMessage = [];
            this._location.back();
          }
        }, e => {
          this.alertify.error(`Create Customer ${e.error || e.error.messsage || e.message} error`);
          this.errorMessage = [`Create Customer ${e.error || e.error.messsage || e.message} error`]
        }
      )
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
