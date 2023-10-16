import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {DatePipe, Location} from '@angular/common';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions, BsModalRef, BsModalService, } from "ngx-bootstrap/modal";
import { Observable, Observer, of } from 'rxjs';

import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { appConstant } from 'src/app/app.constant';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import { WalletKycService } from 'src/app/service/wallet/kyc.service';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserCreateRequest } from 'src/app/model/wallet/register/user-create-req';
import { StateListRes } from 'src/app/model/common/country/state-list-res';
import { StateInfo } from 'src/app/model/common/country/state-info';
import { PrivacyPolicyModalComponent } from 'src/app/wallet/component/register/privacy-policy-modal/privacy-policy-modal.component';
import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { Agent } from 'src/app/model/auth/agency/agency';
import { EmailExistValidationService } from 'src/app/shared/validator/email-exist.validator';
import { CustomerWithWalletReq } from 'src/app/model/wallet/register/customer-with-wallet-req';
import { AgentNameExistValidationService } from 'src/app/shared/validator/agent-name-exist.validator';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  loading: boolean = false;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;
  dateConfig: Partial<BsDatepickerConfig>;

  registerForm: FormGroup;
  dobDate = new Date();
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
  existingAgencies: Agent[];

  agentList: Agent[];
  constructor(private modalService: BsModalService,
    private agencyManage: AgencyService,
    private searchCountryService: SearchCountryService,
    private _location: Location,
     private fb: FormBuilder,
     private walletService: WalletKycService,
     private dateAdapter: NgbDateAdapter<string>,
     private alertify: AlertifyService,
     private dataPipe: DatePipe,
     private store: Store<fromApp.AppState>,
     private agentNameExistService: AgentNameExistValidationService,
     private emailExistValidationService: EmailExistValidationService) {
    
     }

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.dateConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD-MM-YYYY',
        dobDate: this.dobDate,
        showWeekNumbers: false,
      }
    );
    this.currencies = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.initForm();
    this.autoCompleteCountry();
    this.getAgencyList();
  }

  initForm() {
    this.registerForm = this.fb.group({
      agent: ["", { 
        asyncValidators: [this.agentNameExistService.agentNameExistValidator()],
        updateOn: 'blur'
      }],
      existingAgent: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailExistValidationService.emailExistValidator()],
        updateOn: 'change'
      }],
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
                  (err && err.message) || "Something went wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  
  selectResidenceCountry(selectedCountry: CountryRes) {
    //console.log(selectedCountry.name + ' - ' + selectedCountry.code);
    this.countryCode = selectedCountry.code;
    this.countryName = selectedCountry.name;
    this.fetchStates(this.countryCode);
  }

  getAgencyList() {
    this.agencyManage.getAgencyListNoValidate().subscribe(
      (res: Agent[]) => {
        if (res != null) {
          this.existingAgencies = res;
          sessionStorage.setItem('agentList', JSON.stringify(res));
        }
      },
      (e) => {
        console.log(e);
      }
    );
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
      this.loading = true;
      const d = this.registerForm.value;
      //console.log(JSON.stringify(d));
      const createCustomerReq = new CustomerWithWalletReq();
      const user = new UserCreateRequest();
      user.type = 'M';
      user.firstName = d.firstName;
      user.lastName = d.lastName;
      user.email = d.email;
      user.password = d.passwordGroup.password;
      user.retypePassword = d.passwordGroup.confirmPassword;
      user.address = d.address;
      user.city = d.city;
      const country_state = d.state.replace(/ /g, "").split("-");
      user.state = country_state[1] || '';
      
      user.postalCode = d.postalCode;
      let dateOfBirth = this.dataPipe.transform(d.dateOfBirth, 'dd/MM/yyyy');
      const dateConvert = this.convertDate(dateOfBirth);
      let dob = this.dataPipe.transform(dateConvert, 'dd/MM/yyyy');
      user.dateOfBirth = dob;
      user.country = this.countryCode || d.country;
      user.mobile = d.mobile;
      user.language = d.language;
      user.currency = d.currency;

      createCustomerReq.user = user;
      if(d.agent){
      createCustomerReq.agentName = d.agent;
      }
      if(d.existingAgent){
      createCustomerReq.agentName = d.existingAgent;
      }
      this.walletService.registerCustomerWithWallet(createCustomerReq).subscribe(
        (res: any) => {
          if(res.errorId){
            this.loading = false;
            this.alertify.error(`Create Customer ${res.errorCode} - ${res.errorMessage} error`)
            this.errorMessage = [`Create Customer ${res.errorCode} - ${res.errorMessage} error`]
          } else{
            this.loading = false;
            this.alertify.success(`Create Customer ${res.user.name} successful`);
            this.errorMessage = [];
            this._location.back();
          }
        }, e => {
          this.loading = false;
          this.alertify.error(`Create Customer ${e.error || e.error.messsage || e.message} error`);
        }
      )
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  convertDate(sourceDate: string): Date {
      const [day, month, year] = sourceDate.split("/")
      return new Date(+year, +month - 1, +day)
  }
}
