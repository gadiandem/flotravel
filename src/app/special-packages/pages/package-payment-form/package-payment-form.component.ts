import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';

import { LoginRegisterDialogComponent } from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { CardPaymentModel } from 'src/app/model/thing-to-do/tour-payment/card-payment-model';
import * as fromApp from '../../../store/app.reducer';
import * as SpecialPackagesActions from '../../store/special-packages.actions';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { specialPackagesConstant } from '../../special-packages.constant';
import {appConstant, appDefaultData, SERVICENAME} from 'src/app/app.constant';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import { SessionStorageService } from 'src/app/service/session-storage.service';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { ExtraDetailAvailabilityCheckRS } from 'src/app/model/thing-to-do/availability-check/extra-detail-availability-check-res';
import { SummaryPackageRes } from 'src/app/model/packages/consumer/summary-package-res';
import { HotelPackageDetailRes } from 'src/app/model/packages/consumer/hotel-package-detail-res';
import { SupplementPackageRes } from 'src/app/model/packages/consumer/supplement-package-res';
import { TourPackageRes } from 'src/app/model/packages/consumer/tour-package-res';
import { TransferPackageRes } from 'src/app/model/packages/consumer/transfer-pacakge-res';
import { PackageShoppingReq } from 'src/app/model/packages/consumer/package-shopping-req';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import * as AuthActions from '../../../auth/store/auth.actions';
import { SummaryPackageReq } from 'src/app/model/packages/consumer/summary-package-req';
import { Observable, Observer, of } from 'rxjs';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { DepositStep1 } from '../../../model/wallet/deposit/deposit-step-1';
import { depositConstant } from '../../../wallet/deposit-money/deposit.constant';
import { hotelConstant } from '../../../hotel/hotel.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { SessionService } from 'src/app/service/session.expire';


@Component({
  selector: 'app-package-payment-form',
  templateUrl: './package-payment-form.component.html',
  styleUrls: ['./package-payment-form.component.css']
})
export class PackagePaymentFormComponent implements OnInit {
  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  formSubmitError: boolean;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  user: UserDetail;
  loginData: LoginForm;
  isAgent: boolean;
  isVcnPayment: boolean;
  paymentType: FormGroup;

  merchantExist: boolean;
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
  masks: any;
  // user: User;
  country = '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  isEnoughBalance = false;
  starRating = [0, 1, 2, 3, 4];
  searchPackageListReq: PackageShoppingReq;
  userInfo: UserInfoModel[];
  cardPayment: CardPaymentModel;
  duration: string;
  currency: string;

  summaryReq: SummaryPackageReq;
  selectedPackage: PackageShoppingRes;
  selectedRoom: HotelPackageDetailRes;
  selectedSupplements: SupplementPackageRes[];
  selectedTours: TourPackageRes[];
  selectedTransfers: TransferPackageRes[];
  packageSummaryRes: SummaryPackageRes;
  userDetail: UserInfoModel;
  itemPrice = 0;
  customerAmount: number;
  bookingForUser: boolean;
  userIsBooking: string;

  extraAvailabilityCheckResult: ExtraDetailAvailabilityCheckRS;
  countryName: string;
  countries: CountryRes[];
  countryCode: string;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private modalService: BsModalService,
    public searchCountry: SearchCountryService,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private store: Store<fromApp.AppState>,
    private paymentService: PaymentService,
    private alertify: AlertifyService,
    private sessionTimer: SessionService, //calls session expire handler
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.formSubmitError = false;
    this.bsConfig = new ModalOptions();
    this.cardPayment = new CardPaymentModel();
    this.customerAmount = 0;
    this.isVcnPayment = false;
    this.merchantExist = false;
    this.initForm();
    this.autoCompleteCountry();
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.userDetail = JSON.parse(sessionStorage.getItem(specialPackagesConstant.USER_INFO));
    this.selectedSupplements = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_SUPPLEMENT)) || [];
    this.selectedTours = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TOUR)) || [];
    this.selectedTransfers = JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_TRANSFER)) || [];
    this.store.select('specialPackagesList').subscribe((data) => {
      this.searchPackageListReq = data.searchPackageListReq
        || JSON.parse(sessionStorage.getItem(specialPackagesConstant.PACKAGE_SHOPPING_REQ));
      if (!this.searchPackageListReq || !this.searchPackageListReq.destination) {
        this.route.navigate(['/dashboard/specialPackages']);
      }
      this.selectedPackage = data.selectedPackages || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_PACKAGE));
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SELECTED_ROOM));
      this.summaryReq = data.packageSummaryReq || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SUMMARY_REQ));

      this.packageSummaryRes = data.packageSummaryRes || JSON.parse(sessionStorage.getItem(specialPackagesConstant.SUMMARY_RESULT));
      if (this.packageSummaryRes && this.packageSummaryRes.totalPrice) {
        this.itemPrice = this.packageSummaryRes.totalPrice;
        this.isEnoughBalance = this.checkWalletBalance(false);
      } else {
        this.route.navigate(['/dashboard/specialPackages']);
      }
      this.currency = this.selectedPackage.currency;
    });
    this.store.select('auth').subscribe((authState) => {
      this.user =
        authState.user ||
        JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
    });

    this.userInfo = JSON.parse(sessionStorage.getItem(specialPackagesConstant.USER_INFO)) || [];
    this.cardPayment = JSON.parse(sessionStorage.getItem(specialPackagesConstant.CARD_PAYMENT));
    this.initFormWithData();

  }

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }

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
        { validator: passwordMatcher }
      ),
      createAccount: false,
    });
  }

  get customerInfo(): FormArray {
    return this.customersForm.get('customerInfo') as FormArray;
  }

  addMoreCustomer(): void {
    this.customerInfo.push(this.buildAdditionalCustomer());
  }

  buildFirstCustomerInfo(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      mobile: [undefined, [Validators.required]],
      isNotify: [true],
    });
  }

  buildAdditionalCustomer(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
    });
  }

  private initFormWithData() {
    if (this.cardPayment) {
      this.cardPaymentForm.patchValue({
        cardNo: this.cardPayment.cardNo,
        cardName: this.cardPayment.cardName,
        expiry: this.cardPayment.expiry,
      });
    }
    if (this.userInfo) {
      this.customersForm.patchValue({
        customerInfo: this.userInfo
      });
    }
    if (this.userDetail) {
      this.userForm.patchValue({
        email: this.userDetail.email,
      });
    }
    if (this.userInfo && this.userInfo.length > 0) {
      const selectCountry = this.countries.find((country) => country.code == this.userInfo[0].country);
      if (selectCountry) {
        this.getCountryCode(selectCountry);
      }
    }
  }
  onSelectCountry(value: any) {
    const countrySelected = this.countries.filter(item => item.code === value);
    this.countryCode = countrySelected[0].code;
    this.country = countrySelected[0].name;
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

  openTerminal() {
    window.open(appConstant.TERMS_AND_CONDITIONS, '_blank');
  }

  updateProfile() {
    this.route.navigate(['/admin/user/profile/', this.user.id], {
      relativeTo: this.activeRoute,
    });
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

  getCountryCode(country: any) {
    this.countryCode = country.code;
    this.country = country.name;
  }

  buyNow(route?: boolean) {
    this.convertMobile(this.customersForm.value.customerInfo);
    if (this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)) {
      // if (this.user != null) {
      this.sessionStorageService.set(
        specialPackagesConstant.USER_INFO,
        this.customersForm.value.customerInfo
      );

      this.sessionStorageService.set(
        specialPackagesConstant.CARD_PAYMENT,
        this.cardPaymentForm.value
      );
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
        const paymentReq = this.paymentService.buildPackagesPaymentRequest(this.cardPaymentForm.value,
          this.isVcnPayment,
          null,
          this.currency,
          this.customersForm.value.customerInfo,
          bookingContact,
          accountBooking,
          this.bookingForUser || false,
          this.userIsBooking || accountBooking,
          this.selectedPackage,
          this.packageSummaryRes,
          this.country,
          this.countryCode,
          null,
          null
        );
        this.store.dispatch(
          new SpecialPackagesActions.PaymentPackagesStart({
            data: paymentReq
            // data: paymentReq
          })
        );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activeRoute,
        });
      } else {
        const data = {
          cardPayment: this.cardPaymentForm.value,
          vcnPayment: this.isVcnPayment,
          merchantPayment: this.user.merchantPayment,
          currency: this.currency,
          amount: +this.itemPrice.toFixed(2),
          customerRoomInfos: this.customersForm.value.customerInfo,
          tourBookingContact: bookingContact,
          accountBooking,
          bookingForUser: this.bookingForUser || false,
          userIsBooking: this.userIsBooking || accountBooking,
          selectedPackage: this.selectedPackage,
          summary: this.packageSummaryRes,
          countryName: this.country,
          countryCode: this.countryCode
        };
        const vcnRequestCache = sessionStorage.getItem(specialPackagesConstant.PACKAGE_VCN_GENERATE);
        if (!vcnRequestCache) {
          sessionStorage.setItem(specialPackagesConstant.PACKAGE_VCN_GENERATE, JSON.stringify({data: {...data}}));
        }
        if (!route) {
          // validate balance
          const canGenerateVcn = this.checkWalletBalance(true);
          if (canGenerateVcn) {
            this.store.dispatch(new SpecialPackagesActions.GetVcnStart({data: {...data}}));
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

  getCountryName(country: any) {
    const countryModel: CountryRes = country;
    this.countryName = countryModel.name;
  }

  checkWalletBalance(direct: boolean): boolean {
    console.log('check balance!!');
    const balanceCheck = this.user.walletBalance.find(item => item.currency == this.currency);

    if (balanceCheck && +balanceCheck.balance < this.itemPrice) {
      if (direct) {
        this.route.navigate(['/bank-deposit/start']);
        // deposit step 1
        const depositStart = new DepositStep1();
        depositStart.countryCode = this.countryCode;
        depositStart.currencyCode = this.currency;
        depositStart.countryName = this.country;
        depositStart.currencyName = this.currency;
        depositStart.amount = this.itemPrice;
        sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.SPECIAL_PACKAGE);
        sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
      }
      return false;
    } else {
      return true;
    }
  }

  goToBankDeposit() {
    this.buyNow(true);
    if (this.countryCode && this.currency && this.country) {
      this.route.navigate(['/bank-deposit/start']);
      // deposit step 1
      const depositStart = new DepositStep1();
      depositStart.countryCode = this.countryCode;
      depositStart.currencyCode = this.currency;
      depositStart.countryName = this.country;
      depositStart.currencyName = this.currency;
      depositStart.amount = this.itemPrice;
      sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.SPECIAL_PACKAGE);
      sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  convertMobile(passengerList: any): void {
    passengerList.map((p, i) => {
      if (p.mobile) {
        const phoneModel: any = p.mobile;
        p.mobile = phoneModel.nationalNumber ? phoneModel.nationalNumber.replaceAll(' ', '') : phoneModel;
      }
    });
  }
}
