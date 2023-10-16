import {Component, OnInit} from '@angular/core';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

import {CardPaymentModel} from 'src/app/model/insurance/card-payment.req';
import {UserInfo} from 'src/app/model/common/user-info';
import {TraceMeData} from 'src/app/model/traceme/finalise/traceme-data';
import * as fromApp from '../../store/app.reducer';
import * as TracemeActions from '../../traceme/store/traceme.actions';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {LoginForm} from 'src/app/model/auth/login-register/login-form';
import {passwordMatcher} from 'src/app/shared/validator/password-match.validator';
import {appConstant, appDefaultData, SERVICENAME} from 'src/app/app.constant';
import {adminConstant} from 'src/app/admin/userGroup-constant';
import {LoginRegisterDialogComponent} from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {tracemeConstant} from '../traceme.constant';
import {BookingContact} from 'src/app/model/common/booking-contact';
import {TraceMeShoppingReq} from 'src/app/model/traceme/shopping/traceme-shopping-req';
import {Observable, Observer, of} from 'rxjs';
import {CountryRes} from 'src/app/model/common/country/country-res';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {SearchCountryService} from 'src/app/service/search-country.service';
import {DepositStep1} from '../../model/wallet/deposit/deposit-step-1';
import {depositConstant} from '../../wallet/deposit-money/deposit.constant';

@Component({
  selector: 'app-traceme-cart',
  templateUrl: './traceme-cart.component.html',
  styleUrls: ['./traceme-cart.component.css']
})
export class TracemeCartComponent implements OnInit {
  messages: any = {
    validDate: 'valid\ndate',
    monthYear: 'mm/yyyy',
  };
  placeholders: any = {
    number: '•••• •••• •••• ••••',
    name: 'Full Name',
    expiry: '••/••',
    cvc: '•••',
  };

  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  formSubmitError: boolean;
  masks: any;
  cardPayment: CardPaymentModel;
  userInfo: UserInfo;
  user: UserDetail;
  loginData: LoginForm;
  selectedQuote: TraceMeData;
  searchTracemeReq: TraceMeShoppingReq;

  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  bookingForUser = false;
  userIsBooking = '';
  isVcnPayment: boolean;
  isAgent: boolean;

  country = '';
  countryCode: string;
  countries: CountryRes[];
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  currency: string;
  maxDate = new Date();
  merchantExist: boolean;
  isEnoughMoney: boolean;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public store: Store<fromApp.AppState>,
    private paymentService: PaymentService,
    public searchCountry: SearchCountryService,
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.isEnoughMoney = false;
    this.merchantExist = false;
    this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.cardPayment = new CardPaymentModel();
    this.formSubmitError = false;
    this.autoCompleteCountry();
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.userInfo = JSON.parse(sessionStorage.getItem(tracemeConstant.USER_INFO));
    this.selectedQuote = JSON.parse(sessionStorage.getItem(tracemeConstant.SELECTED_QUOTE));
    this.isVcnPayment = false;
    this.initForm();
    this.updateFormWithData();
    this.store.select('tracemeList').subscribe((data) => {
      this.searchTracemeReq = data.searchTracemeReq || JSON.parse(sessionStorage.getItem(tracemeConstant.TRACEME_LIST_REQ));
      this.currency = data.searchTracemeResult.quotes[0].currency;
    });
    this.store.select('auth').subscribe((authState) => {
      this.user = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.updateUserEmailInfo();
        this.isAgent =
          (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
    });
  }

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }

  }

  getCountryCode(country: any) {
    this.countryCode = country.code;
    this.country = country.name;
  }

  updateProfile() {
    this.route.navigate(['/admin/user/profile/', this.user.id], {
      relativeTo: this.activeRoute,
    });
  }

  private initForm() {
    this.customersForm = this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      country: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(15)]],
      isNotify: [true],
      passport: ['', Validators.required],
    });

    this.cardPaymentForm = this.fb.group({
      cardNo: ['', Validators.required],
      cardName: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', Validators.required],
    });
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: [''],
          confirmPassword: [''],
        },
        {validator: passwordMatcher}
      ),
      createAccount: false,
    });
  }

  updateFormWithData() {
    if (this.userInfo) {
      this.customersForm.patchValue({
        gender: this.userInfo.gender,
        firstName: this.userInfo.firstName,
        middleName: this.userInfo.middleName,
        lastName: this.userInfo.lastName,
        birthDate: this.userInfo.birthDate,
        country: this.userInfo.country,
        phoneNo: this.userInfo.phoneNo,
        isNotify: this.userInfo.isNofity,
        passport: this.userInfo.passport,
      });
    }
    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
      cvv: this.cardPayment.cvv,
    });
    if (this.userInfo) {
      const selectCountry = this.countries.find((country) => country.name == this.userInfo.country);
      if (selectCountry) {
        this.getCountryCode(selectCountry);
      }
    }
  }

  autoCompleteCountry() {
    // this.sugFlyFrom$ = this.searchAutoComplement(1);
    this.sugFlyFrom$ = new Observable((observer: Observer<string>) => {
      observer.next(this.country);
    }).pipe(
      debounceTime(500),
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.searchCountry.searchCountry(this.country).pipe(
            map((data: CountryRes[]) => {
              this.searchFailed = false;
              return data || [];
            }), tap(
              () => (this.searching = false),
              (err) => {
                // in case of http error
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || 'Something goes wrong';
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  openModalWithComponent() {
    const initialState = {
      // searchData: Object.assign({}, this.searchHotelForm),
    };
    // this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-sm';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      LoginRegisterDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res: UserDetail) => {
      this.loginData = res;
      this.user = res;
      console.log('!!data from cart: ' + JSON.stringify(this.loginData));
    });
  }

  useSelected(event: string) {
    this.userIsBooking = event;
  }

  agencyBooking(event: boolean) {
    this.bookingForUser = event;
  }

  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
  }

  buyNow() {
    if (
      this.customersForm.valid &&
      (this.cardPaymentForm.valid || this.isVcnPayment)
    ) {
      const d: any = this.customersForm.value;
      // if (this.user != null) {
      sessionStorage.setItem(tracemeConstant.USER_INFO, JSON.stringify(this.customersForm.value));
      const cardPaymentSave: CardPaymentModel = Object.assign(
        {},
        this.cardPaymentForm.value
      );
      cardPaymentSave.cvv = null;
      sessionStorage.setItem(
        tracemeConstant.CARD_PAYMENT,
        JSON.stringify(cardPaymentSave)
      );
      const cardPayment: CardPaymentModel = this.cardPaymentForm.value;
      // const userInfo: UserInfo = this.customersForm.value;
      const bookingContact = new BookingContact();
      bookingContact.email = this.userForm.value.email || this.user.email;
      bookingContact.createAccount = this.userForm.value.createAccount;
      bookingContact.password = this.userForm.value.passwordGroup.password;
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
      } else {
        accountBooking = null;
      }
      if (!this.isVcnPayment) {
        const paymentReq = this.paymentService.buildTracemeRequest(
          this.selectedQuote,
          this.isVcnPayment,
          cardPayment,
          this.customersForm.value,
          bookingContact,
          this.currency,
          accountBooking,
          this.bookingForUser,
          this.userIsBooking,
          this.countryCode
        );
        this.store.dispatch(
          new TracemeActions.PaymentTracemeStart({
            data: paymentReq
          })
        );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activeRoute,
        });
      } else {
        const data = {
          tracemeQuote: this.selectedQuote,
          cardPayment,
          vcnPayment: this.isVcnPayment,
          merchantPayment: this.user.merchantPayment,
          currency: this.currency,
          amount: +this.selectedQuote.quote.premium,
          customerInfo: this.customersForm.value,
          tracemeBookingContact: bookingContact,
          accountBooking,
          bookingForUser: this.bookingForUser,
          userIsBooking: this.userIsBooking,
          countryCode: this.countryCode
        };
        const vcnRequestCache = sessionStorage.getItem(tracemeConstant.TRACEME_VCN_GENERATE);
        if (!vcnRequestCache) {
          sessionStorage.setItem(tracemeConstant.TRACEME_VCN_GENERATE, JSON.stringify(data));
        }
        // validate balance
        const canGenerateVcn = this.checkWalletBalance(+this.selectedQuote.quote.premium);
        if (canGenerateVcn) {
          this.store.dispatch(
            new TracemeActions.GetVcnStart(data)
          );
          this.route.navigate(['../updateOtp'], {
            relativeTo: this.activeRoute,
          });
        }
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  checkWalletBalance(price: number): boolean {
    console.log('check balance!!');
    const balanceCheck = this.user.walletBalance.find(item => item.currency == this.currency);

    if (balanceCheck && +balanceCheck.balance < price) {
      this.route.navigate(['/bank-deposit/start'], {
        relativeTo: this.activeRoute,
      });
      // deposit step 1
      const depositStart = new DepositStep1();
      depositStart.countryCode = this.countryCode;
      depositStart.currencyCode = this.currency;
      depositStart.countryName = this.country;
      depositStart.currencyName = this.currency;
      depositStart.amount = price;
      sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.TRACEME);
      sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
      return false;
    } else {
      return true;
    }
  }

  updateUserEmailInfo() {
    if (this.user) {
      this.userForm.patchValue({
        email: this.user.email,
      });
    }
  }
}
