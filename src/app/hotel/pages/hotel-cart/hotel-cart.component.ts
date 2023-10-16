import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Observer, of } from 'rxjs';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import * as fromApp from 'src/app/store/app.reducer';
import * as HotelActions from 'src/app/hotel/store/hotel.actions';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { LoginRegisterDialogComponent } from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { appConstant, defaultData, SERVICENAME } from 'src/app/app.constant';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import { HotelCustomerInfo } from 'src/app/model/hotel/hotel-cart/hotelCustomerInfo';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { DepositStep1 } from 'src/app/model/wallet/deposit/deposit-step-1';
import { depositConstant } from 'src/app/wallet/deposit-money/deposit.constant';
import { WalletBalanceService } from 'src/app/core/services/wallet-balance.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { Product } from 'src/app/model/insurance/quote/product';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { SubscribePolicyData } from 'src/app/model/insurance/subscription-policy/subscribe-policy-data';
import { flightConstant } from 'src/app/flight/flight.constant';
import { SessionService } from 'src/app/service/session.expire';

@Component({
  selector: 'app-hotel-cart',
  templateUrl: './hotel-cart.component.html',
  styleUrls: ['./hotel-cart.component.css'],
})
export class HotelCartComponent implements OnInit {
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
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  country = '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage = '';

  formSubmitError: boolean;
  cardPayment: CardPaymentModel;
  hotelCustomersInfo: HotelCustomerInfo[];
  userInfo: UserInfoModel;
  user: UserDetail;
  loginData: LoginForm;

  searchHotelListForm: HotelShoppingReq;
  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  hotelSelected: HotelInfo;
  selectedRoom: RateDetailList;
  starRating: number[];
  currency: string;
  availableRoomProperty: AvailablePropertyRes;
  sessionId: string;
  tryFetchdata = true;

  isBooking = true;
  isEnoughBalance = false;
  isReserveBooking: boolean;
  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  numberOfNight = 1;
  numberOfRoom = 1;
  passwordMessage: string;
  bookingForUser: boolean;
  userIsBooking: string;
  isVcnPayment: boolean;
  isAgent: boolean;

  merchantExist: boolean;
  countries: CountryRes[];
  countryCode: string;

  isAxaInsurance: boolean;
  totalTripPrice: number;
  totalTripPriceCache: number;
  insuranceItemItem: Product;
  subscribePolicyData: SubscribePolicyData;
  defaultData: string;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    public searchCountry: SearchCountryService,
    private fb: FormBuilder,
    private hotelPaymentService: PaymentService,
    private walletBalanceService: WalletBalanceService,
    private alertify: AlertifyService,
    private sessionTimer: SessionService, //calls session expire handler
  ) {
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultData = defaultData.noImage;
    this.initForm();
    this.isAxaInsurance = false;
    this.totalTripPrice = 0;
    this.totalTripPriceCache = 0;
    this.isVcnPayment = false;
    this.merchantExist = false;
    this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.formSubmitError = false;
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.currency =
      sessionStorage.getItem(hotelConstant.CURRENCY) ||
      hotelConstant.METADATA_CURRENCY;
    this.hotelCustomersInfo = JSON.parse(sessionStorage.getItem(hotelConstant.CUSTOMERS_INFO));
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.userInfo = JSON.parse(sessionStorage.getItem(hotelConstant.CUSTOMERS_INFO));
    this.cardPayment = JSON.parse(sessionStorage.getItem(hotelConstant.CARD_PAYMENT));
    this.initFormWithData();
    this.store.select('hotel').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchHotelListForm = data.searchHotelListForm || JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
      if (!this.searchHotelListForm || !this.searchHotelListForm.destination) {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.hotelSelected = data.selectedHotel || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
      this.sessionId = data.sessionId || sessionStorage.getItem(hotelConstant.SESSION_ID);
      this.selectedRoom = data.selectedRoom || JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
      if (this.selectedRoom && this.selectedRoom.rooms) {
        this.numberOfRoom = this.selectedRoom.rooms.rooms.length;
        this.totalTripPrice = +this.selectedRoom.totalPrice;
        this.totalTripPriceCache = this.totalTripPrice;
        this.numberOfNight = this.selectedRoom.rooms.rooms[0].roomRate.initialPricePerNight.length;
      } else {
        this.route.navigate(['/dashboard/hotel']);
      }
      this.availableRoomProperty = data.avalableProperty || JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_ROOM_AVAILABILITY));
      if (this.availableRoomProperty != null) {
        console.log(this.isEnoughBalance);
        this.isEnoughBalance = this.checkWalletBalance();
        this.isBooking = this.availableRoomProperty.confirmBooking;
        this.isReserveBooking = this.availableRoomProperty.reserveBooking;
      }
    });
    if (this.numberOfRoom > 1) {
      for (let i = 1; i < this.numberOfRoom; i++) {
        this.addMoreCustomer();
      }
    }
    if (this.isAxaInsurance) {
      this.totalTripPriceCache += +this.insuranceItemItem.packagePrice;
      this.totalTripPrice += +this.insuranceItemItem.packagePrice;
    }
    this.store.select('auth').subscribe((authState) => {
      this.user = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
      this.refreshData();

    });
    this.userForm .get('createAccount')
      .valueChanges.subscribe((value) => this.setNotification(value));
  }

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }
  }

  updateProfile() {
    this.route.navigate(['/admin/user/profile/', this.user.id], {
      relativeTo: this.activeRoute,
    });
  }

  updateTotalPrice() {
    this.totalTripPriceCache = +this.totalTripPrice;
    if (this.isAxaInsurance) {
      this.totalTripPriceCache += +this.insuranceItemItem.packagePrice;
    }
  }
  getInsuranceItem(item: any) {
    this.insuranceItemItem = item;
  }

  getCountryCode(country: any) {
    this.countryCode = country.code;
    this.country = country.name;
  }

  onSelectCountry(value: any) {
    const countrySelected = this.countries.filter(item => item.code === value);
    this.countryCode = countrySelected[0].code;
    this.country = countrySelected[0].name;
  }

  insuranceUpdate(selection: boolean) {
    this.isAxaInsurance = selection;
    this.updateTotalPrice();
  }

  setNotification(createAccount: boolean): void {
    const password = this.userForm.get('passwordGroup.password');
    const confirmPassword = this.userForm.get('passwordGroup.confirmPassword');
    if (createAccount) {
      password.setValidators(Validators.required);
      confirmPassword.setValidators(Validators.required);
    } else {
      password.clearValidators();
      confirmPassword.clearValidators();
    }
    confirmPassword.updateValueAndValidity();
    password.updateValueAndValidity();
  }

  // checkAvailableRoomProperty() {
  //   this.store.dispatch(
  //     new HotelActions.CheckRoomAvailableStart({
  //       data: this.selectedRoom,
  //       sessionId: this.sessionId,
  //       hotelCode: +this.hotelSelected.code,
  //     })
  //   );
  // }

  refreshData() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.starRating = [];
    const getStar: number = Math.ceil(+this.hotelSelected.starRating);
    for (let i = 0; i < getStar; i++) {
      this.starRating.push(i);
    }
  }

  initForm() {
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

  private initFormWithData() {
    if (this.hotelCustomersInfo && this.hotelCustomersInfo.length > 0) {
      this.customersForm.patchValue({
        customerInfo: [...this.hotelCustomersInfo]
      });
    }
    // this.customersForm.setControl('customerInfo', this.fb.array([...this.hotelCustomersInfo]));
    if (this.cardPayment) {
      this.cardPaymentForm.patchValue({
        cardNo: this.cardPayment.cardNo,
        cardName: this.cardPayment.cardName,
        expiry: this.cardPayment.expiry,
      });
    }
    if (this.user) {
      this.userForm.patchValue({
        email: this.user.email,
      });
    }
    if (this.userInfo) {
      const selectCountry = this.countries.find((country) => country.code == this.userInfo.country);
      if (selectCountry) {
        this.getCountryCode(selectCountry);
      }
    }
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
      // passport: ['', Validators.required],
    });
  }

  buildAdditionalCustomer(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      country: [''],
      mobile: [undefined],
      isNotify: [false],
      // passport: [''],
    });
  }

  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
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
    });
  }

  useSelected(event: string) {
    this.userIsBooking = event;
  }

  agencyBooking(event: boolean) {
    this.bookingForUser = event;
  }

  buyNow(route?: boolean) {
    this.convertMobile(this.customersForm.value.customerInfo);
    if (
      this.customersForm.valid &&
      (this.cardPaymentForm.valid || this.isVcnPayment) &&
      this.userForm.valid
    ) {
      const d: any = this.customersForm.value;
      // if (this.user != null) {
      sessionStorage.setItem(
        hotelConstant.CUSTOMERS_INFO,
        JSON.stringify(this.customersForm.value.customerInfo)
      );
      sessionStorage.setItem(
        hotelConstant.CARD_PAYMENT,
        JSON.stringify(this.cardPaymentForm.value)
      );
      const hotelBookingContact = new BookingContact();
      hotelBookingContact.email = this.userForm.value.email || this.user.email;
      hotelBookingContact.createAccount = this.userForm.value.createAccount;
      hotelBookingContact.password = this.userForm.value.passwordGroup.password;
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
      } else {
        accountBooking = null;
      }
      if (this.isAxaInsurance) {
        const quoteResponse: QuoteResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_RESPONSE));
        const subscriptionData = new SubscribePolicyData();
        subscriptionData.currency = this.currency;
        subscriptionData.quoteCode = this.insuranceItemItem.quoteCode;
        subscriptionData.priceAfterDiscountIncTax =
          this.insuranceItemItem.packagePrice;
        subscriptionData.id = quoteResponse.id;
        subscriptionData.productName = this.insuranceItemItem.name;
        subscriptionData.guarantees = this.insuranceItemItem.guarantees;
        subscriptionData.quoteRequest = JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_SEARCH_FORM));
        subscriptionData.sessionId = quoteResponse.sessionId;
        this.subscribePolicyData = subscriptionData;
        sessionStorage.setItem(flightConstant.ADD_ON_INSURANCE, JSON.stringify(this.insuranceItemItem));
        sessionStorage.setItem(insuranceConstant.SUBSCRIBE_POLICY_DATA, JSON.stringify(subscriptionData));
      }
      if (!this.isVcnPayment) {
        const paymentReq = this.hotelPaymentService.buildHotelPaymentRequest(
          this.cardPaymentForm.value,
          this.isVcnPayment,
          this.currency,
          this.selectedRoom,
          this.customersForm.value.customerInfo,
          this.sessionId,
          this.availableRoomProperty,
          this.hotelSelected,
          hotelBookingContact,
          accountBooking,
          this.bookingForUser || false,
          this.userIsBooking || accountBooking,
          this.countryCode,
          this.totalTripPriceCache,
          this.subscribePolicyData
        );
        this.store.dispatch(
          new HotelActions.HotelPaymentStart({
            data: paymentReq,
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
          selectedRoom: this.selectedRoom,
          customerRoomInfos: this.customersForm.value.customerInfo,
          sessionId: this.sessionId,
          availableProperty: this.availableRoomProperty,
          hotelSelected: this.hotelSelected,
          hotelBookingContact,
          accountBooking,
          bookingForUser: this.bookingForUser || false,
          userIsBooking: this.userIsBooking || accountBooking,
          countryCode: this.countryCode,
          totalPrice: this.totalTripPriceCache
        };
        const vcnRequestCache = sessionStorage.getItem(hotelConstant.HOTEL_VCN_GENERATE);
        if (!vcnRequestCache) {
          sessionStorage.setItem(hotelConstant.HOTEL_VCN_GENERATE, JSON.stringify({ data: { ...data } }));
        }
        // validate balance
        if (!route) {
          const canGenerateVcn = this.checkWalletBalance(true);
          if (canGenerateVcn) {
            this.store.dispatch(
              new HotelActions.GetVcnStart({
                data: { ...data },
              })
            );
            this.route.navigate(['../updateOtp'], {
              relativeTo: this.activeRoute,
            });
          }
        }
      }
      // } else {
      //   this.route.navigate(["/auth"]);
      // }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  reserve() {
    if (
      this.customersForm.valid &&
      this.cardPaymentForm.valid &&
      this.userForm.valid
    ) {
      const d: any = this.customersForm.value;
      // if (this.user != null) {
      sessionStorage.setItem(
        hotelConstant.CUSTOMERS_INFO,
        JSON.stringify(this.customersForm.value.customerInfo)
      );
      sessionStorage.setItem(
        hotelConstant.CARD_PAYMENT,
        JSON.stringify(this.cardPaymentForm.value)
      );
      const hotelBookingContact = new BookingContact();
      hotelBookingContact.email =
        this.user.email || this.userForm.value.email;
      if (this.userForm.value.createAccount) {
        hotelBookingContact.password = this.userForm.value.password;
      }
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
      } else {
        accountBooking = null;
      }
      if (!this.isVcnPayment) {
        const paymentReq = this.hotelPaymentService.buildHotelPaymentRequest(
          this.cardPaymentForm.value,
          this.isVcnPayment,
          this.currency,
          this.selectedRoom,
          this.customersForm.value.customerInfo,
          this.sessionId,
          this.availableRoomProperty,
          this.hotelSelected,
          hotelBookingContact,
          accountBooking,
          this.bookingForUser || false,
          this.userIsBooking || accountBooking,
          this.countryCode,
          this.totalTripPriceCache,
          this.subscribePolicyData
        );
        this.store.dispatch(
          new HotelActions.HotelPaymentStart({
            data: paymentReq,
          })
        );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activeRoute,
        });
      } else {
        console.log('vcn');
        const data = {
          cardPayment: this.cardPaymentForm.value,
          vcnPayment: this.isVcnPayment,
          merchantPayment: this.user.merchantPayment,
          currency: this.currency,
          selectedRoom: this.selectedRoom,
          customerRoomInfos: this.customersForm.value.customerInfo,
          sessionId: this.sessionId,
          availableProperty: this.availableRoomProperty,
          hotelSelected: this.hotelSelected,
          hotelBookingContact,
          accountBooking,
          bookingForUser: this.bookingForUser || false,
          userIsBooking: this.userIsBooking || accountBooking,
          countryCode: this.countryCode,
          totalPrice: this.totalTripPriceCache
        };
        const vcnRequestCache = sessionStorage.getItem(hotelConstant.HOTEL_VCN_GENERATE);
        if (!vcnRequestCache) {
          sessionStorage.setItem(hotelConstant.HOTEL_VCN_GENERATE, JSON.stringify(data));
        }
        // validate balance
        const canGenerateVcn = this.checkWalletBalance(true);
        if (canGenerateVcn) {
          this.store.dispatch(
            new HotelActions.GetVcnStart({
              data: { ...data },
            })
          );
          this.route.navigate(['../updateOtp'], {
            relativeTo: this.activeRoute,
          });
        }
      }
      // } else {
      //   this.route.navigate(["/auth"]);
      // }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  checkWalletBalance(route = false): boolean {
    // const enoughMoney = this.walletBalanceService.checkWalletBalanceEnough(10, 'USD');
    // console.log('check balance!! ' + enoughMoney);
    const balanceCheck = this.user.walletBalance.find(item => item.currency == this.currency);
    if (balanceCheck && (+balanceCheck.balance < +this.selectedRoom.totalPrice)) {
      if (route) {
        this.route.navigate(['/bank-deposit/start']);
        // deposit step 1
        const depositStart = new DepositStep1();
        depositStart.countryCode = this.countryCode;
        depositStart.currencyCode = this.currency;
        depositStart.countryName = this.country;
        depositStart.currencyName = this.currency;
        depositStart.amount = +this.selectedRoom.totalPrice;
        sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.HOTEL);
        sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
      }
      return false;
    } else {
      return true;
    }
  }

  goToBankDeposit() {
    if (this.countryCode && this.currency && this.country) {
      this.buyNow(true);
      this.route.navigate(['/bank-deposit/start']);
      // deposit step 1
      const depositStart = new DepositStep1();
      depositStart.countryCode = this.countryCode;
      depositStart.currencyCode = this.currency;
      depositStart.countryName = this.country;
      depositStart.currencyName = this.currency;
      depositStart.amount = +this.selectedRoom.totalPrice;
      sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.HOTEL);
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
        p.mobile = phoneModel.nationalNumber.replaceAll(' ', '');
      }
    });
  }
}
