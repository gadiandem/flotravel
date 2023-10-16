import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {CardPaymentModel} from 'src/app/model/insurance/card-payment.req';
import {UserInfoInsurance} from 'src/app/model/insurance/user-info-insurance.req';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {LoginForm} from 'src/app/model/auth/login-register/login-form';
import {AvailablePropertyRes} from 'src/app/model/hotel/hotel-cart/available-property-res';
import {LoginRegisterDialogComponent} from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import {Product} from 'src/app/model/insurance/quote/product';
import {insuranceConstant} from '../insurance.constant';
import {appConstant, appDefaultData, SERVICENAME} from 'src/app/app.constant';
import {SearchQouteRequest} from 'src/app/model/insurance/search-quote.request';
import * as InsuranceActions from '../../insurance/store/insurance.actions';
import * as fromApp from '../../store/app.reducer';
import {UserInfo} from 'src/app/model/common/user-info';
import {BookingContact} from 'src/app/model/common/booking-contact';
import {passwordMatcher} from 'src/app/shared/validator/password-match.validator';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {adminConstant} from 'src/app/admin/userGroup-constant';
import {Observable, Observer, of} from 'rxjs';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {CountryRes} from 'src/app/model/common/country/country-res';
import {SearchCountryService} from 'src/app/service/search-country.service';
import {DashboardService} from 'src/app/service/dashboard/dashboard.service';
import {DepositStep1} from '../../model/wallet/deposit/deposit-step-1';
import {depositConstant} from '../../wallet/deposit-money/deposit.constant';
import {hotelConstant} from '../../hotel/hotel.constant';

@Component({
  selector: 'app-insurance-cart',
  templateUrl: './insurance-cart.component.html',
  styleUrls: ['./insurance-cart.component.css'],
})
export class InsuranceCartComponent implements OnInit {
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
  country = '';
  searching = false;
  searchFailed = false;
  errorMessage = '';
  fetching: boolean;
  fetchFailed: boolean;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  formSubmitError: boolean;

  masks: any;
  cardPayment: CardPaymentModel;
  userInfo: UserInfoInsurance[];
  user: UserDetail;
  loginData: LoginForm;

  searchQuoteForm: SearchQouteRequest;
  startDate: Date;
  endDate: Date;
  currency: string;
  cartData: AvailablePropertyRes;
  selectedQuoteProduct: Product;

  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  bookingForUser = false;
  userIsBooking = '';
  maxDate = new Date();
  isVcnPayment: boolean;
  isAgent: boolean;
  customerAmount: number;
  adultsCount: number;
  childCount: number;
  infantCount: number;
  countries: CountryRes[];
  countryCode: string;

  merchantExist: boolean;
  isEnoughBalance = false;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public searchCountryService: SearchCountryService,
    public store: Store<fromApp.AppState>,
    private paymentService: PaymentService,
    private dashboardService: DashboardService,
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.merchantExist = false;
    this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.cardPayment = new CardPaymentModel();
    this.formSubmitError = false;
    this.customerAmount = 0;
    this.currency = sessionStorage.getItem(insuranceConstant.INSURANCE_CURRENCY) || appDefaultData.DEFAULT_CURRENCY;
    this.isVcnPayment = false;
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.initForm();
    this.userInfo = JSON.parse(sessionStorage.getItem(insuranceConstant.USER_INFO)) || [];
    this.cardPayment = JSON.parse(sessionStorage.getItem(insuranceConstant.CARD_PAYMENT));
    this.selectedQuoteProduct = JSON.parse(
      sessionStorage.getItem(insuranceConstant.PRODUCT_SELECTED)
    );
    if (this.userInfo.length > 0 && this.cardPayment) {
      this.updateFormWithData();
    }
    this.searchQuoteForm = JSON.parse(
      sessionStorage.getItem(insuranceConstant.QUOTE_SEARCH_FORM)
    );
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));

    this.store.select('insuranceList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      // this.selectedQuoteProduct =  data.selectedPackage || JSON.parse(sessionStorage.getItem(insuranceConstant.PACKAGE_LIST));
    });
    this.store.select('auth').subscribe((authState) => {
      this.user = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        this.isAgent =
          (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
    });
    this.refeshData();
  }

  updateProfile() {
    this.route.navigate(['/admin/user/profile/', this.user.id], {
      relativeTo: this.activeRoute,
    });
  }

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
      this.isEnoughBalance = this.checkWalletBalance(false);

    }

  }

  getCountryCode(country: any) {
    this.countryCode = country.code;
    // console.log('country: ' + this.countryCode);
  }

  onSelectCountry(value: any) {
    let countrySelected = this.countries.filter(item => item.code === value);
    this.countryCode = countrySelected[0].code;
    this.country = countrySelected[0].name;
  }
  onOpenDatepicker(event: any, datepicker: any){
    datepicker.toggle(true);
  }
  refeshData() {
    this.customerAmount = this.searchQuoteForm.travellers.adt + this.searchQuoteForm.travellers.chd + this.searchQuoteForm.travellers.inf;
    for (let i = 1; i < this.customerAmount; i++) {
      this.addMoreCustomer();
    }
    this.adultsCount = this.searchQuoteForm.travellers.adt;
    this.childCount = this.searchQuoteForm.travellers.chd;
    this.infantCount = this.searchQuoteForm.travellers.inf;
    this.startDate = new Date(this.searchQuoteForm.startDate);
    this.endDate = new Date(this.searchQuoteForm.endDate);
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
  }

  private initForm() {
    this.customersForm = this.fb.group({
      customerInfo: this.fb.array([this.buildFirstCustomerInfo()]),
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

  private updateFormWithData() {
    if (this.userInfo) {
      this.customersForm.patchValue({
        customerInfo: this.userInfo,
      });
    }
    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
      cvv: this.cardPayment.cvv,
    });
    if (this.userInfo) {
      this.userForm.patchValue({
        email: this.user.email,
      });
    }
  }

  buildFirstCustomerInfo(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthDate: [this.minuYears(new Date(), 18), Validators.required],
      country: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(15)]],
      isNotify: [true],
      passport: ['', Validators.required],
    });
  }

  get customerInfo(): FormArray {
    return this.customersForm.get('customerInfo') as FormArray;
  }

  addMoreCustomer(): void {
    this.customerInfo.push(this.buildAdditionalCustomer());
  }

  buildAdditionalCustomer(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
    });
  }

  minuYears(date: Date, years: number): Date {
    date.setFullYear(date.getFullYear() - years);
    return date;
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

  buyNow(route?: boolean) {
    if (
      this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)
    ) {
      const d: any = this.customersForm.value;
      sessionStorage.setItem(
        insuranceConstant.USER_INFO,
        JSON.stringify(this.customersForm.value.customerInfo)
      );
      const cardPaymentSave: CardPaymentModel = Object.assign(
        {},
        this.cardPaymentForm.value
      );
      cardPaymentSave.cvv = null;
      sessionStorage.setItem(
        insuranceConstant.CARD_PAYMENT,
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
      this.searchQuoteForm.residenceCountry = this.countryCode;
      if (!this.isVcnPayment) {
        const paymentReq = this.paymentService.buildSubscriptionRequest(
          this.searchQuoteForm,
          this.isVcnPayment,
          cardPayment,
          this.customersForm.value.customerInfo,
          this.selectedQuoteProduct,
          bookingContact,
          this.currency,
          accountBooking,
          this.bookingForUser,
          this.userIsBooking
        );
        this.store.dispatch(
          new InsuranceActions.SubscriptionStart({
            data: paymentReq
          })
        );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activeRoute,
        });
      } else {
        const data = {
          searchQuoteForm: this.searchQuoteForm,
          vcnPayment: this.isVcnPayment,
          merchantPayment: this.user.merchantPayment,
          cardPayment,
          customerInfos: this.customersForm.value.customerInfo,
          selectedQuoteProduct: this.selectedQuoteProduct,
          bookingContact,
          currency: this.currency,
          accountBooking,
          bookingForUser: this.bookingForUser,
          userIsBooking: this.userIsBooking,
          // countryCode: this.countryCode
        };
        const vcnRequestCache = sessionStorage.getItem(insuranceConstant.INSURANCE_VCN_GENERATE);
        if (!vcnRequestCache) {
          sessionStorage.setItem(insuranceConstant.INSURANCE_VCN_GENERATE, JSON.stringify({data: {...data}}));
        }
        // validate balance
        if(!route){
          const canGenerateVcn = this.checkWalletBalance(true);
          if (canGenerateVcn) {
            this.store.dispatch(
              new InsuranceActions.GetVcnStart({
                data: {
                  ...data
                },
              })
            );
            this.route.navigate(['../updateOtp'], {
              relativeTo: this.activeRoute,
            });
          }
        }
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  checkWalletBalance(direct: boolean): boolean {
    console.log('check balance!!');
    const balanceCheck = this.user.walletBalance.find(item => item.currency == this.currency);
    if (balanceCheck && +balanceCheck.balance < this.selectedQuoteProduct.prices.priceAfterDiscountInclTax) {
      if(direct){
        this.route.navigate(['/bank-deposit/start']);
        // deposit step 1
        const depositStart = new DepositStep1();
        depositStart.countryCode = this.countryCode;
        depositStart.currencyCode = this.currency;
        depositStart.countryName = this.country;
        depositStart.currencyName = this.currency;
        depositStart.amount = this.selectedQuoteProduct.prices.priceAfterDiscountInclTax;
        sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.NCT);
        sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
      }
      return false;
    } else {
      return true;
    }
  }

  goToBankDeposit(){
    this.buyNow(true);
    if(this.countryCode && this.currency && this.country){
      this.route.navigate(['/bank-deposit/start']);
      // deposit step 1
      const depositStart = new DepositStep1();
      depositStart.countryCode = this.countryCode;
      depositStart.currencyCode = this.currency;
      depositStart.countryName = this.country;
      depositStart.currencyName = this.currency;
      depositStart.amount = this.selectedQuoteProduct.prices.priceAfterDiscountInclTax;
      sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.HOTEL);
      sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}

