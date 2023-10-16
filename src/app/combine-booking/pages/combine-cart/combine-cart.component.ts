import {Component, OnInit} from '@angular/core';
import {CardPaymentModel} from 'src/app/model/hotel/hotel-payment/card-payment.model';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';

import {SearchFlightForm} from 'src/app/model/flight/search-flight-form';
import {LoginRegisterDialogComponent} from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import {LoginForm} from 'src/app/model/auth/login-register/login-form';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import {AlertifyService} from 'src/app/service/alertify.service';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {SelectedFlight} from 'src/app/model/flight/selected-flight';
import {appConstant, SERVICENAME} from 'src/app/app.constant';
import * as FlightListActions from '../../../flight/store/flight-list.actions';
import * as fromApp from '../../../store/app.reducer';
import {FlightPaymentData} from 'src/app/model/flight/payment/flight-payment-data';
import {OfferPriceRes} from 'src/app/model/flight/offer-price/offer-price-res';
import {passwordMatcher} from 'src/app/shared/validator/password-match.validator';
import {OfferItemSelected} from 'src/app/model/flight/offer-price/request/offer-item-selected';
import {BookingContact} from 'src/app/model/common/booking-contact';
import {PaymentService} from 'src/app/service/payment/payment.service';
import {adminConstant} from 'src/app/admin/userGroup-constant';
import {UserInfoInsurance} from 'src/app/model/insurance/user-info-insurance.req';
import {PassegerInfo} from 'src/app/model/flight/payment-info/passeger.info';
import {DatePipe} from '@angular/common';
import {Observable, Observer, of} from 'rxjs';
import {CountryRes} from 'src/app/model/common/country/country-res';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {SearchCountryService} from 'src/app/service/search-country.service';
import {combineBookingConstant, demoFlightData} from '../../combine-booking.constant';
import {HotelInfo} from 'src/app/model/hotel/hotel-list/hotel-info';
import {RateDetailList} from 'src/app/model/hotel/hotel-list/rate-detail-list';
import {HotelShoppingReq} from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import {AvailablePropertyRes} from 'src/app/model/hotel/hotel-cart/available-property-res';
import {CombineBookingService} from 'src/app/service/combine/combine-booking.service';
import {VcnRequest} from 'src/app/model/flocash/response/vcn-request';
import {Utils} from 'src/app/shared/utils';
import {hotelConstant, hotelProvider} from 'src/app/hotel/hotel.constant';
import {HotelPackageDetailRes} from '../../../model/packages/consumer/hotel-package-detail-res';
import {DepositStep1} from '../../../model/wallet/deposit/deposit-step-1';
import {depositConstant} from '../../../wallet/deposit-money/deposit.constant';

@Component({
  selector: 'app-combine-cart',
  templateUrl: './combine-cart.component.html',
  styleUrls: ['./combine-cart.component.css']
})
export class CombineCartComponent implements OnInit {
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
  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  isEnoughBalance = false;
  country = '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  isCollapsed: boolean[];
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  bsConfigDatePicker: Partial<BsDatepickerConfig>;
  user: UserDetail;
  loginData: LoginForm;
  formSubmitError: boolean;
  initialForm: boolean;
  countryCode: string;
  cardPayment: CardPaymentModel;
  userInfo: PassegerInfo[];
  masks: any;
  adultCount: number;
  childrenCount: number;

  searchFlightForm: SearchFlightForm;
  typeFlight: string;
  departureFlight: SelectedFlight;

  returnFlight: SelectedFlight;

  nextFlights: SelectedFlight[];
  offerPrices: OfferPriceRes;
  flightPrice: number;
  flightTaxes: number;
  totalTripPrice: number;
  totalTaxes: number;
  currency: string;
  executionId: string;
  loadMoreFlight = true;
  minDate = new Date(2000, 1, 1);
  maxDate = new Date();
  flightOrderRequest: FlightPaymentData;
  bookingForUser: boolean;
  userIsBooking: string;
  countries: CountryRes[];

  isAgent: boolean;
  isVcnPayment: boolean;
  merchantExist: boolean;

  // aeroProvider: boolean;
  createBooking: any;
  provider: string;
  sessionId: string;
  hotelSelected: HotelInfo;
  selectedRoom: RateDetailList;
  selectedRoomNCT: HotelPackageDetailRes;
  searchHotelListForm: HotelShoppingReq;
  starRating: number[];
  numberOfNight = 1;
  numberOfRoom = 1;
  availableRoomProperty: AvailablePropertyRes;
  hotelProvider = hotelProvider;
  selectedHotelProvider: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    public searchCountry: SearchCountryService,
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private flightPaymentService: PaymentService,
    private combineService: CombineBookingService
  ) {
  }

  ngOnInit() {
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.currency = sessionStorage.getItem(hotelConstant.CURRENCY) ||
      hotelConstant.METADATA_CURRENCY;
    // this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.selectedHotelProvider = sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL_PROVIDER) || hotelProvider.NUITEE;
    this.sessionId = sessionStorage.getItem(combineBookingConstant.SESSION_ID);
    this.hotelSelected = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_HOTEL));
    this.selectedRoom = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_ROOM_DETAIL));
    this.selectedRoomNCT = JSON.parse(sessionStorage.getItem(combineBookingConstant.SELECTED_ROOM_DETAIL_NCT));
    this.searchHotelListForm = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_HOTEL_LIST_REQUEST));
    this.availableRoomProperty = JSON.parse(sessionStorage.getItem(combineBookingConstant.HOTEL_AVAILABILITY));
    if (this.selectedRoom) {
      this.numberOfRoom = this.selectedRoom.rooms.rooms.length;
      this.numberOfNight = this.selectedRoom.rooms.rooms[0].roomRate.initialPricePerNight.length;
    }
    if (this.selectedRoomNCT) {
      this.numberOfRoom = 1;
      this.numberOfNight = 1;
    }
    this.initialForm = true;
    this.isVcnPayment = false;
    this.merchantExist = false;
    this.user = new UserDetail();
    this.formSubmitError = false;
    this.isCollapsed = [true];
    this.bsConfig = new ModalOptions();
    this.autoCompleteCountry();
    this.bsConfigDatePicker = Object.assign({}, {
        containerClass: 'theme-red',
        dateInputFormat: 'DD-MM-YYYY',
        minDate: this.minDate,
        maxDate: this.maxDate,
        showWeekNumbers: false,
      }
    );
    this.totalTripPrice = 0;
    this.totalTaxes = 0;
    this.flightPrice = 0;
    this.flightTaxes = 0;
    this.executionId = sessionStorage.getItem(combineBookingConstant.EXECUTION_ID_HAHN_AIR) || demoFlightData.EXECUTION_ID;
    this.initForm();
    this.store.select('auth').subscribe((data) => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
    });
    this.userInfo = JSON.parse(sessionStorage.getItem(combineBookingConstant.CUSTOMERS_INFO)) || [];
    this.cardPayment = JSON.parse(sessionStorage.getItem(combineBookingConstant.CARD_PAYMENT));
    if (this.userInfo.length > 0 && this.cardPayment) {
      this.userInfo.map(customer => {
        if (customer.birthDate) {
          customer.birthDate = this.datePipe.transform(new Date(customer.birthDate), 'yyyy-MM-dd');
        }
        if (customer.expiryDate) {
          customer.expiryDate = this.datePipe.transform(new Date(customer.expiryDate), 'yyyy-MM-dd');
        }
        if (customer.issueDate) {
          customer.issueDate = this.datePipe.transform(new Date(customer.issueDate), 'yyyy-MM-dd');
        }
      });
      this.updateCustomerFormData();
    }
    this.refresh();
    // this.store.select("flightList").subscribe((data) => {
    //   this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(combineBookingConstant.DEPARTURE_FLIGHT));
    //   this.offerPrices = data.offerPrices || JSON.parse(sessionStorage.getItem(combineBookingConstant.OFFER_PRICE_RES));
    //   if (this.offerPrices) {
    //     this.totalTripPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value;
    //   }
    //   this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS));
    //   if (this.searchFlightForm) {
    //     this.adultCount = +this.searchFlightForm.adults;
    //     this.childrenCount = +this.searchFlightForm.children;
    //     this.typeFlight = this.searchFlightForm.typeFlight;
    //   }
    //   this.flightOrderRequest = data.flightBookingReq || JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_BOOKING_DATA));
    //   if (this.initialForm) {
    //     for (let i = 1; i < this.adultCount + this.childrenCount; i++) {
    //       this.onAddPasseger();
    //     }
    //   }
    //   if (this.departureFlight) {
    //     this.currency = this.departureFlight.offerItem.currency;
    //     this.totalTaxes += this.departureFlight.offerItem.taxes;
    //   }
    //   if (this.loadMoreFlight) {
    //     this.loadMoreSelectedFlight(data);
    //     this.loadMoreFlight = false;
    //   }
    // });
  }

  refresh() {
    this.isEnoughBalance = this.checkWalletBalance();
    this.departureFlight = JSON.parse(sessionStorage.getItem(combineBookingConstant.DEPARTURE_FLIGHT));
    this.offerPrices = JSON.parse(sessionStorage.getItem(combineBookingConstant.OFFER_PRICE_RES));
    if (this.offerPrices) {
      this.totalTripPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value;
      this.flightPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value;
    }
    this.searchFlightForm = JSON.parse(sessionStorage.getItem(combineBookingConstant.SEARCH_FLIGHTS_FORM));
    if (this.searchFlightForm) {
      this.adultCount = +this.searchFlightForm.adults;
      this.childrenCount = +this.searchFlightForm.children;
      this.typeFlight = this.searchFlightForm.typeFlight;
    }
    this.flightOrderRequest = JSON.parse(sessionStorage.getItem(combineBookingConstant.FLIGHT_BOOKING_DATA));
    if (this.initialForm) {
      for (let i = 1; i < this.adultCount + this.childrenCount; i++) {
        this.onAddPasseger();
      }
    }
    if (this.departureFlight) {
      this.currency = this.departureFlight.offerItem.currency;
      this.flightTaxes += this.departureFlight.offerItem.taxes;
      this.totalTaxes += this.departureFlight.offerItem.taxes;
    }
    this.starRating = new Array();
    const getStar: number = Math.ceil(+this.hotelSelected.starRating);
    for (let i = 0; i < getStar; i++) {
      this.starRating.push(i);
    }
    if (this.selectedRoom) {
      console.log(this.selectedRoom.totalPrice);
      this.totalTripPrice += +this.selectedRoom.totalPrice || 0;
      this.totalTaxes += +this.selectedRoom.taxesAndFees.taxesAndFees[0].amount || 0;
    }
    if (this.selectedRoomNCT) {
      this.totalTripPrice += +this.hotelSelected.minPrice || 0;
    }
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

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }
  }

  updateProfile() {
    this.route.navigate(['/admin/user/profile/', this.user.id], {
      relativeTo: this.activatedRoute,
    });
  }

  private initForm() {
    this.customersForm = this.fb.group({
      passengerList: this.fb.array([this.buildFirstCustomerInfo()]),
    });

    this.cardPaymentForm = new FormGroup({
      cardNo: new FormControl('', Validators.required),
      cardName: new FormControl('', Validators.required),
      expiry: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
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

  buildFirstCustomerInfo(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      issueDate: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      isNotify: [''],
      passPort: ['', Validators.required],
    });
  }

  get passegerListControls() {
    return (this.customersForm.get('passengerList') as FormArray).controls;
  }

  getValidity(i) {
    return (this.customersForm.get('passengerList') as FormArray).controls[i]
      .invalid;
  }

  isRequired(i) {
    const t = (this.customersForm.get('passengerList') as FormArray).controls[i]
      .errors;
    if (t) {
      return (this.customersForm.get('passengerList') as FormArray).controls[i]
        .errors.required;
    } else {
      return false;
    }
  }

  onAddPasseger() {
    (this.customersForm.get('passengerList') as FormArray).push(
      new FormGroup({
        gender: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl('', Validators.required),
        birthDate: new FormControl(''),
        country: new FormControl('', Validators.required),
        phoneNo: new FormControl(''),
        passPort: new FormControl('', Validators.required),
      })
    );
  }

  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
  }

  private updateCustomerFormData() {
    this.customersForm.patchValue({
      passengerList: this.userInfo,
    });

    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
      cvv: this.cardPayment.cvv,
    });

    this.userForm.patchValue({
      userLoginName: '',
      userLoginpassword: '',
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

  openTerminal() {
    window.open(appConstant.TERMS_AND_CONDITIONS, '_blank');
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

  buyNow(route?: boolean) {
    if (this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)) {
      this.convertDate(this.customersForm.value.passengerList);
      const bookingData: FlightPaymentData = new FlightPaymentData();
      bookingData.offerItems = [];
      if (this.offerPrices) {
        const item = new OfferItemSelected();
        item.offerId = this.offerPrices.pricedOffer.offerID;
        item.owner = this.offerPrices.pricedOffer.owner;
        item.offerItemId = this.offerPrices.pricedOffer.offerItem[0].offerItemID;
        bookingData.offerItems.push(item);
        bookingData.offerPriceId = this.offerPrices.id;
      }
      bookingData.cardPayment = this.cardPaymentForm.value;
      bookingData.passegersInfo = this.customersForm.value.passengerList;
      bookingData.currency = this.currency;
      bookingData.executionId = this.executionId;
      bookingData.searchFlightForm = this.searchFlightForm;
      bookingData.totalPrice = +this.totalTripPrice.toPrecision(2);
      bookingData.bookingForUser = this.bookingForUser;
      bookingData.userIsBooking = this.userIsBooking || null;
      const flightBookingContact = new BookingContact();
      flightBookingContact.email =
        this.userForm.value.email || this.user.email;
      flightBookingContact.createAccount = this.userForm.value.createAccount;
      flightBookingContact.password = this.userForm.value.passwordGroup.password;
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
      } else {
        accountBooking = null;
      }
      bookingData.accountBooking = accountBooking;
      bookingData.bookingContact = flightBookingContact;

      sessionStorage.setItem(combineBookingConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.passengerList));
      const cardPaymentSave: CardPaymentModel = Object.assign({}, this.cardPaymentForm.value);
      cardPaymentSave.cvv = '';
      sessionStorage.setItem(combineBookingConstant.CARD_PAYMENT, JSON.stringify(cardPaymentSave));
      if (!this.isVcnPayment) {
        this.flightPaymentService.buildCombineServicePaymentRequest(bookingData, this.selectedRoom, this.sessionId, this.availableRoomProperty, this.hotelSelected);
        // this.store.dispatch(
        //   new FlightListActions.BookingFlightStart(createOrderReq)
        // );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activatedRoute,
        });
      } else {
        const req = new VcnRequest();
        req.accountId = accountBooking;
        req.price = +this.totalTripPrice.toPrecision(2);
        req.currency = this.currency;
        this.combineService.requestVcn(req);
        bookingData.merchantPayment = this.user ? this.user.merchantPayment : null;
        bookingData.vcnPayment = this.isVcnPayment;
        this.flightPaymentService.buildCombineServicePaymentRequest(bookingData, this.selectedRoom, this.sessionId, this.availableRoomProperty, this.hotelSelected);
        // this.store.dispatch(new FlightListActions.GetVcnStart(bookingData));
        this.route.navigate(['../updateOtp'], {
          relativeTo: this.activatedRoute,
        });
      }

    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  convertDate(passengerList: any[]) {
    passengerList.map(p => {
      p.birthDate = this.datePipe.transform(p.birthDate, 'yyyy-MM-dd');
      if (p.expiryDate) {
        p.expiryDate = this.datePipe.transform(p.expiryDate, 'yyyy-MM-dd');
      }
      if (p.issueDate) {
        p.issueDate = this.datePipe.transform(p.issueDate, 'yyyy-MM-dd');
      }
    });
  }

  checkWalletBalance(route = false): boolean {
    // const enoughMoney = this.walletBalanceService.checkWalletBalanceEnough(10, 'USD');
    // console.log('check balance!! ' + enoughMoney);
    const totalPrice = (this.selectedHotelProvider === hotelProvider.NUITEE) ? +this.selectedRoom.totalPrice
      : this.selectedRoomNCT.pricePerNight;
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
    if (this.countryCode && this.currency && this.country && this.currency) {
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
}
