import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { LoginRegisterDialogComponent } from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { AlertifyService } from 'src/app/service/alertify.service';

import { UserDetail } from 'src/app/model/auth/user/user-detail';
import {
  demoFlightData,
  flightConstant,
  flightProvider,
  flightTypeValue,
  months
} from '../flight.constant';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { appConstant, appDefaultData, SERVICENAME } from 'src/app/app.constant';
import * as FlightListActions from './../../flight/store/flight-list.actions';
import * as fromApp from '../../store/app.reducer';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { OfferPriceRes } from 'src/app/model/flight/offer-price/offer-price-res';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import { OfferItemSelected } from 'src/app/model/flight/offer-price/request/offer-item-selected';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { PassegerInfo } from 'src/app/model/flight/payment-info/passeger.info';
import { DatePipe } from '@angular/common';
import { Observable, Subscription, of } from 'rxjs';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { Product } from 'src/app/model/insurance/quote/product';
import { SubscribePolicyData } from 'src/app/model/insurance/subscription-policy/subscribe-policy-data';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { AuthResponse } from 'src/app/model/insurance/get-token/auth.response';
import { QuoteCreatedRes } from 'src/app/model/gca/quote/response/quote-created-res';
import { hepstarConstant } from 'src/app/hepstar/hepstar.constant';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { DepositStep1 } from '../../model/wallet/deposit/deposit-step-1';
import { depositConstant } from '../../wallet/deposit-money/deposit.constant';
import { TermsAndConditionsComponent } from '../../shared/component/terms-and-conditions/terms-and-conditions.component';
import { OrderChangeReq } from 'src/app/model/flight/order-change';
import { SessionService } from 'src/app/service/session.expire';
import { ServiceListResponse } from 'src/app/model/flight/services/service-response';
import { AvailableServices } from 'src/app/model/flight/services/available-services';

@Component({
  selector: 'app-flight-payment-info',
  templateUrl: './flight-payment-info.component.html',
  styleUrls: ['./flight-payment-info.component.css'],
})
export class FlightPaymentInfoComponent implements OnInit, OnDestroy {

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
    private hepstarService: HepstarService,
    private cdRef: ChangeDetectorRef,
    private sessionTimer: SessionService, // calls session expire handler
  ) {
  }

  get passengerListControls() {
    return (this.customersForm.get('passengerList') as FormArray).controls;
  }
  sub: Subscription;
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

  country = '';
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  isCollapsed: boolean[];
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  user: UserDetail;
  loginData: LoginForm;
  formSubmitError: boolean;
  initialForm: boolean;
  isEnoughBalance = false;

  cardPayment: CardPaymentModel;
  userInfo: PassegerInfo[];
  masks: any;
  adultCount: number;
  childrenCount: number;
  infantCount: number;

  searchFlightForm: SearchFlightForm;
  typeFlight: string;
  departureFlight: SelectedFlight;

  returnFlight: SelectedFlight;

  nextFlights: SelectedFlight[];
  offerPrices: OfferPriceRes;
  offerItemSelected: OfferItemSelected[] = [];
  totalTripPrice: number;
  totalTripPriceCache: number;
  totalTaxes: number;
  totalBaseAmount: number;
  currency: string;
  executionId: string;
  loadMoreFlight = true;
  minDate = new Date(2000, 1, 1);
  maxDate = new Date();
  dob: Date = new Date();

  bookingForUser: boolean;
  userIsBooking: string;

  isAgent: boolean;
  isVcnPayment: boolean;
  merchantExist: boolean;
  bspBooking: boolean;

  isRefundProtect: boolean;
  isSmartDelay: boolean;
  isSmartDelayExist: boolean;
  isTraceme: boolean;
  isGcaAddon: boolean;
  isAxaInsurance: boolean;
  quoteId: number;
  refundProtectItem: any;
  smartDelayItem: any;
  tracemeItem: any;
  insuranceItemItem: Product;
  gcaBookingItem: QuoteCreatedRes;
  gcaBookingId: string;
  aeroProvider: boolean;
  floFlightProvider: boolean;
  hahnairProvider: boolean;
  createBooking !: any;
  fetching = false;
  countries: CountryRes[];
  countryCode: string;
  etProvider: boolean;
  qrProvider: boolean;
  baggageRules = '';

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Zambia, CountryISO.Nigeria];
  baggageInfoView: string[];
  orderChange: OrderChangeReq;
  selectedServices: AvailableServices[];
  servicesResponse: ServiceListResponse;

  passengerDoB: Date[] = [];
  allDates: number[] = [];
  dates: number[] = [];
  months: number[] = [];
  years: number[] = [];
  thirtyDaysMonths: number[] = [4, 6, 9, 11];

  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;
  val = null;
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.orderChange = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_CHANGE));
    this.aeroProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.AERO_CRS;
    this.floFlightProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.FLO_AIR;
    this.etProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.ET;
    this.qrProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.QR;
    this.hahnairProvider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.HAHN_AIR;
    this.selectedServices = JSON.parse(sessionStorage.getItem(flightConstant.SELECTED_FLIGHT_SEVICES));
    this.servicesResponse = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_SEVICES_RES));
    this.typeFlight = JSON.parse(sessionStorage.getItem(flightConstant.FLIGHT_TYPE));
    if (this.typeFlight == flightTypeValue.ROUND_TRIP) {
      this.returnFlight = JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
    }
    this.generateDates();
    this.dob = this.minuYears(new Date(), 18);
    this.initialForm = true;
    this.isVcnPayment = false;
    this.isRefundProtect = false;
    this.isSmartDelay = false;
    this.isTraceme = false;
    this.isAxaInsurance = false;
    this.isGcaAddon = false;
    this.merchantExist = false;
    this.user = new UserDetail();
    this.formSubmitError = false;
    this.isCollapsed = [true];
    this.bsConfig = new ModalOptions();
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.totalTripPrice = 0;
    this.totalTripPriceCache = 0;
    this.totalTaxes = 0;
    this.totalBaseAmount = 0;
    this.baggageInfoView = [];
    this.executionId = sessionStorage.getItem(flightConstant.EXECUTION_ID) || demoFlightData.EXECUTION_ID;
    this.initForm();
    if(this.orderChange){
    this.userInfo = JSON.parse(sessionStorage.getItem(flightConstant.CUSTOMERS_INFO)) || this.orderChange.flightDetail.customerInfos || [];
    }else{
      this.userInfo = JSON.parse(sessionStorage.getItem(flightConstant.CUSTOMERS_INFO))  || [];
    }
    this.store.select('auth').subscribe((data) => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
    });
    this.cardPayment = JSON.parse(sessionStorage.getItem(flightConstant.CARD_PAYMENT));
    this.sub = this.store.select('flightList').subscribe((data) => {
      this.departureFlight = data.departureFlight || JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
      if (!this.departureFlight && this.departureFlight.flight) {
        this.route.navigate(['/dashboard/flight']);
      }
      this.searchFlightForm = data.searchFlightForm || JSON.parse(sessionStorage.getItem(flightConstant.SEARCH_FLIGHTS));
      if (this.searchFlightForm) {
        this.adultCount = +this.searchFlightForm.adults;
        this.childrenCount = +this.searchFlightForm.children;
        this.infantCount = +this.searchFlightForm.infants;
        this.typeFlight = this.searchFlightForm.typeFlight;
      } else {
        if (!this.orderChange) {
          this.route.navigate(['/dashboard/flight']);
        }
      }
      this.offerPrices = data.offerPrices || JSON.parse(sessionStorage.getItem(flightConstant.OFFER_PRICE_RES));
      if (this.offerPrices && this.offerPrices.pricedOffer && this.offerPrices.pricedOffer.offerItem) {
        this.currency = this.offerPrices.currency || appDefaultData.DEFAULT_CURRENCY;
        this.totalTripPrice = this.offerPrices.pricedOffer.totalPrice.simpleCurrencyPrice.value;
        this.totalTripPriceCache = this.totalTripPrice;
        this.isEnoughBalance = this.checkWalletBalance();
        if (this.offerPrices.baggageInfo && this.offerPrices.baggageInfo.length > 0) {
          this.baggageInfoView = this.offerPrices.baggageInfo;
          this.baggageRules += this.offerPrices.baggageInfo.join().replace(',', ' ');
        }
        if (this.offerPrices.pricedOffer.offerItem.length > 0 && this.offerPrices.pricedOffer.offerItem[0].totalPriceDetail.taxes) {
          this.totalTaxes = this.offerPrices.pricedOffer.offerItem[0].totalPriceDetail.taxes.total.value;
        } else {
          this.totalTaxes = 0;
        }
        if (this.offerPrices.pricedOffer.offerItem.length > 0 && this.offerPrices.pricedOffer.offerItem[0].totalPriceDetail.baseAmount) {
          this.totalBaseAmount = this.offerPrices.pricedOffer.offerItem[0].totalPriceDetail.baseAmount.value;
        } else {
          this.totalBaseAmount = 0;
        }
      } else {
        if (!this.orderChange) {
          this.route.navigate(['/dashboard/flight']);
        }
      }
      if (this.initialForm) {
        for (let i = 1; i < this.adultCount + this.childrenCount + this.infantCount; i++) {
          this.onAddPassenger();
        }
      }
      if (this.selectedServices && this.orderChange) {
        this.totalBaseAmount = 0;
        this.totalTaxes = 0;
        this.totalTripPriceCache = 0;
        this.orderChange = Object.assign({}, this.orderChange);
        this.currency = this.selectedServices[0].alaCarteOfferItem.unitPrice.currency || appDefaultData.DEFAULT_CURRENCY;
        this.selectedServices.forEach(offer => {
          this.totalBaseAmount = this.totalBaseAmount + offer.alaCarteOfferItem.unitPrice.baseAmount;
          this.totalTaxes = this.totalTaxes + offer.alaCarteOfferItem.unitPrice.totalTaxAmount;
          this.totalTripPriceCache = this.totalTripPriceCache + offer.alaCarteOfferItem.unitPrice.totalAmount;
        });
         const departureFlight: SelectedFlight  = new SelectedFlight();
         departureFlight.flight = this.orderChange.flightDetail.departureFlight;
        this.departureFlight =  departureFlight;
        sessionStorage.setItem(flightConstant.DEPARTURE_FLIGHT, JSON.stringify(this.departureFlight));
        if (this.orderChange.flightDetail.returnFlight) {
          this.typeFlight === flightTypeValue.ROUND_TRIP;
          sessionStorage.setItem(flightConstant.FLIGHT_TYPE, flightTypeValue.ROUND_TRIP);
          const returnFlight: SelectedFlight  = new SelectedFlight();
          returnFlight.flight = this.orderChange.flightDetail.returnFlight;
         this.returnFlight =  returnFlight;
         sessionStorage.setItem(flightConstant.RETURN_FLIGHT, JSON.stringify(this.returnFlight));
        }
        this.orderChange.serviceOfferReq = this.selectedServices;
        this.isEnoughBalance = this.checkWalletBalance();
      }
      if (this.userInfo.length > 0) {
        this.userInfo.map(customer => {
          if (customer.birthDate) {
            customer.birthDate = new Date(customer.birthDate);
          }
        });
        this.updateCustomerFormData();
      }
      if (this.offerPrices && this.qrProvider) {
        this.offerItemSelected = [];
        this.offerPrices.pricedOffer.offerItem.forEach(offer => {
          const paxID: string[] = [];
          offer.service.forEach(service => {
            paxID.push(service.serviceID);
          });
          const item = new OfferItemSelected();
          item.offerId = this.offerPrices.pricedOffer.offerID;
          item.owner = this.offerPrices.pricedOffer.owner;
          item.offerItemId = offer.offerItemID;
          item.paxRefID = paxID;
          this.offerItemSelected.push(item);
        });
      }
      if (this.loadMoreFlight) {
        this.loadMoreSelectedFlight(data);
        this.loadMoreFlight = false;
      }
    });
    // this.loadingSkeleton();

  }

  onChange: any = () => { };
  onTouch: any = () => { };

  minuYears(date: Date, years: number): Date {
    date.setFullYear(date.getFullYear() - years);
    return date;
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
        { validator: passwordMatcher }
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
      birthDate: [this.minuYears(new Date(), 18), Validators.required],
      // address: ['', Validators.required],
      country: ['', Validators.required],
      phoneNo: [undefined, Validators.required],
      isNotify: [''],
      passPort: ['', Validators.required]
    });
  }
  updateFirstCustomerInfo(index: number): FormGroup {
    return this.fb.group({
      gender: this.userInfo[index].gender,
      firstName: this.userInfo[index].firstName,
      middleName:this.userInfo[index].middleName,
      lastName: this.userInfo[index].lastName,
      birthDate: this.userInfo[index].birthDate,
      // address: ['', Validators.required],
      country: this.userInfo[index].country,
      phoneNo: this.userInfo[index].phoneNo,
      isNotify: this.userInfo[index].notify,
      passPort: this.userInfo[index].passPort
    });
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

  onAddPassenger() {
    (this.customersForm.get('passengerList') as FormArray).push(
      new FormGroup({
        gender: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl('', Validators.required),
        birthDate: new FormControl(''),
        country: new FormControl('', Validators.required),
        phoneNo: new FormControl(''),
        passPort: new FormControl(''),
      })
    );
  }

  onOpenDatepicker(event: any, datepicker: any) {
    datepicker.toggle(true);
  }
  bspBookingUpdate() {
    console.log(this.bspBooking);
  }
  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
  }

  refundProtectUpdate(selection: boolean) {
    this.isRefundProtect = selection;
    this.updateTotalPrice();
  }

  smartDelayUpdate(selection: boolean) {
    this.isSmartDelay = selection;
    this.updateTotalPrice();
  }

  smartDelayExist(productExist: boolean) {
    this.isSmartDelayExist = productExist;
  }

  tracemeUpdate(selection: boolean) {
    this.isTraceme = selection;
    this.updateTotalPrice();
  }

  insuranceUpdate(selection: boolean) {
    this.isAxaInsurance = selection;
    this.updateTotalPrice();
  }

  getTracemeCard(item: any) {
    this.tracemeItem = item;
  }

  getInsuranceItem(item: any) {
    this.insuranceItemItem = item;
  }

  quoteIdUpdate(quoteId: number) {
    this.quoteId = quoteId;
  }

  getRefundProtectPackage(item: any) {
    this.refundProtectItem = item;
  }

  getSmartDelayPackage(item: any) {
    this.smartDelayItem = item;
  }

  getGcaBookingId(bookingId: string) {
    if (bookingId) {
      this.gcaBookingId = bookingId;
      this.isGcaAddon = true;
    } else {
      this.isGcaAddon = false;
    }
  }

  updateGcaBooking(bookingItem: QuoteCreatedRes) {
    console.log(bookingItem);
    this.gcaBookingItem = bookingItem;
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalTripPriceCache = +this.totalTripPrice;
    if (this.isTraceme) {
      this.totalTripPriceCache += +this.tracemeItem.premium;
    }
    if (this.isRefundProtect) {
      this.totalTripPriceCache += +this.refundProtectItem.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount;
      // console.log(this.totalTripPriceCache)
    }
    if (this.isSmartDelay) {
      this.totalTripPriceCache += +this.smartDelayItem.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount;
      // console.log(this.totalTripPriceCache)
    }
    if (this.isAxaInsurance) {
      this.totalTripPriceCache += +this.insuranceItemItem.packagePrice;
    }
    if (this.isGcaAddon) {
      this.totalTripPriceCache += +this.gcaBookingItem.gcaQuoteResult.billing.grand_total;
    }
    this.isEnoughBalance = this.checkWalletBalance();
  }


  private updateCustomerFormData() {
    (this.customersForm.controls['passengerList'] as FormArray).clear();;
    for(let index= 0; index < this.userInfo.length; index++){  
       (this.customersForm.controls['passengerList'] as FormArray).push(this.updateFirstCustomerInfo(index));
      }

  /**   this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo ,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
      cvv: this.cardPayment.cvv,
    }); **/

    this.userForm.patchValue({
      userLoginName: `${this.user.email}`,
      userLoginpassword: '',
    });
    this.onSelectCountry(this.userInfo[0].country);
  }

  onSelectCountry(value: any) {
    if (value) {
      const countrySelected = this.countries.filter(item => item.code === value);
      this.countryCode = countrySelected[0].code;
      this.country = countrySelected[0].name;
    }
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

  openTermsAndConditionComponent() {
    const initialState = {
      // searchData: Object.assign({}, this.searchHotelForm),
    };
    // this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-sm';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      TermsAndConditionsComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res: UserDetail) => {
      this.loginData = res;
      this.user = res;
      console.log('!!data from cart: ' + JSON.stringify(this.loginData));
    });
  }


  loadMoreSelectedFlight(data: any) {
    switch (this.typeFlight) {
      case flightTypeValue.ROUND_TRIP:
        this.isCollapsed.push(true);
        if (data.returnFlight) {
          this.returnFlight = data.returnFlight || JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
        } else {
          this.returnFlight = JSON.parse(
            sessionStorage.getItem(flightConstant.RETURN_FLIGHT)
          );
          if (this.returnFlight == null) {
            this.route.navigate(['/']);
          }
        }
        break;
      case flightTypeValue.MULTI_CITY:
        if (data.nextFlights.length !== 0) {
          this.nextFlights = [];
          this.nextFlights = data.nextFlights;
        } else {
          this.nextFlights = JSON.parse(
            sessionStorage.getItem(flightConstant.NEXT_FLIGHT)
          );
          if (this.nextFlights == null) {
            this.route.navigate(['/']);
          }
        }
        this.nextFlights.forEach((f) => {
          this.isCollapsed.push(true);
        });
        break;
    }
  }

  useSelected(event: string) {
    this.userIsBooking = event;
  }

  agencyBooking(event: boolean) {
    this.bookingForUser = event;
  }

  saveBooking() {
    this.convertMobile2(this.customersForm.value.passengerList);

    if (
      this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)
    ) {
      const bookingData: FlightPaymentData = new FlightPaymentData();
      this.convertDate(this.customersForm.value.passengerList);
      // this.mapDOB(this.customersForm.value.passengerList);
      bookingData.bookingHold = true;
      bookingData.bspBooking = this.bspBooking;
      // this.convertMobile(this.customersForm.value.passengerList);
      if (this.isRefundProtect) {
        bookingData.addonRefundProtect = true;
        const sessionId = sessionStorage.getItem(hepstarConstant.SESSION);
        bookingData.helpstarSession = sessionId;
        bookingData.refundProtectPrice =
          +(this.refundProtectItem.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount.toFixed(2));
        // this.totalTripPrice = this.totalTripPriceCache;
        const productCode = this.refundProtectItem.pricedProduct.productInformation.productCode;
        const passangerNumber = this.customersForm.value.passengerList.length || 1;
        const requestParameters = this.hepstarService.buildRequestParameters(this.searchFlightForm, this.totalTripPrice,
          productCode, passangerNumber, this.customersForm.value.passengerList);
        bookingData.requestParameters = requestParameters;
        sessionStorage.setItem(flightConstant.ADD_ON_REFUND_PROTECT, JSON.stringify(this.refundProtectItem));
      }
      if (this.isSmartDelay) {
        bookingData.addonSmartDelay = true;
        const sessionId = sessionStorage.getItem(hepstarConstant.SESSION);
        bookingData.helpstarSession = sessionId;
        bookingData.smartDelayPrice =
          +(this.smartDelayItem.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount.toFixed(2));
        // this.totalTripPrice = this.totalTripPriceCache;
        const productCode = this.smartDelayItem.pricedProduct.productInformation.productCode;
        const passangerNumber = this.customersForm.value.passengerList.length || 1;
        const requestParameters = this.hepstarService
          .buildRequestParameters(this.searchFlightForm, this.totalTripPrice, productCode,
            passangerNumber, this.customersForm.value.passengerList);
        bookingData.smartDelayRequestParameters = requestParameters;
        sessionStorage.setItem(flightConstant.ADD_ON_SMART_DELAY, JSON.stringify(this.smartDelayItem));
      }

      if (this.isTraceme) {
        const tracemeAddon = new TraceMeData();
        tracemeAddon.quoteId = this.quoteId.toString();
        tracemeAddon.quote = this.tracemeItem;
        bookingData.traceMeData = tracemeAddon;
        sessionStorage.setItem(flightConstant.ADD_ON_TRACEME, JSON.stringify(this.tracemeItem));
      }
      if (this.isGcaAddon) {
        bookingData.addonGca = true;
        bookingData.gcaBookingId = this.gcaBookingId;
        sessionStorage.setItem(flightConstant.ADD_ON_GCA, JSON.stringify(this.gcaBookingItem));
      } else {
        bookingData.addonGca = false;
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
        bookingData.subscribePolicyData = subscriptionData;
        const auth: AuthResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.AUTH_AXA)) || 'token';
        bookingData.tokenInsurance = auth.accessToken;
        sessionStorage.setItem(flightConstant.ADD_ON_INSURANCE, JSON.stringify(this.insuranceItemItem));
      }
      if (this.aeroProvider) {
        this.createBooking = JSON.parse(
          sessionStorage.getItem(flightConstant.CREATE_BOOKING)
        );
        bookingData.bookingId =
          this.createBooking.result.aerocrs.booking.bookingid.toString();
        // extras info flight
        this.departureFlight.flight.flightSegments[0].depAirportName =
          this.createBooking.result.aerocrs.booking.items.flight[0].from.toString();
        this.departureFlight.flight.flightSegments[0].arrAirportName =
          this.createBooking.result.aerocrs.booking.items.flight[0].to.toString();
        this.departureFlight.flight.offerItemList[0].services[0] =
          this.departureFlight.flight.offerItemList[0].className;
        bookingData.departureFlight = this.departureFlight.flight;
        if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
          this.returnFlight = JSON.parse(
            sessionStorage.getItem(flightConstant.RETURN_FLIGHT)
          );
          this.returnFlight.flight.flightSegments[0].depAirportName =
            this.createBooking.result.aerocrs.booking.items.flight[1].from.toString();
          this.returnFlight.flight.flightSegments[0].arrAirportName =
            this.createBooking.result.aerocrs.booking.items.flight[1].to.toString();
          this.returnFlight.flight.offerItemList[0].services[0] =
            this.returnFlight.flight.offerItemList[0].className;
          bookingData.returnFlight = this.returnFlight.flight;
        }
        if (this.typeFlight === flightTypeValue.MULTI_CITY) {
          bookingData.nextFlights = [];
          this.nextFlights.forEach((data) => {
            bookingData.nextFlights.push(data.flight);
          });
        }
      } else {
        // extras info flight
        bookingData.departureFlight = this.departureFlight.flight;
        if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
          bookingData.returnFlight = this.returnFlight.flight;
        }
        if (this.typeFlight === flightTypeValue.MULTI_CITY) {
          bookingData.nextFlights = [];
          this.nextFlights.forEach((data) => {
            bookingData.nextFlights.push(data.flight);
          });
        }
      }
      bookingData.offerItems = [];
      if (this.offerPrices && !this.aeroProvider && !this.floFlightProvider) {
        if (this.qrProvider) {
          bookingData.offerItems = this.offerItemSelected;
        } else {
          const item = new OfferItemSelected();
          item.offerId = this.offerPrices.pricedOffer.offerID;
          item.owner = this.offerPrices.pricedOffer.owner;
          item.offerItemId = this.offerPrices.pricedOffer.offerItem[0].offerItemID;
          bookingData.offerItems.push(item);
        }
        bookingData.offerPriceId = this.offerPrices.id;
      }
      bookingData.cardPayment = this.cardPaymentForm.value;
      bookingData.passegersInfo = this.customersForm.value.passengerList;
      // bookingData.passegersInfo[0].country = this.countryCode;
      bookingData.passegersInfo.forEach((data, i) => {
        data.country = this.countryCode;
      });
      bookingData.currency = this.currency;
      bookingData.executionId = this.executionId;
      bookingData.searchFlightForm = this.searchFlightForm;
      bookingData.totalPrice = +(this.totalTripPriceCache.toFixed(2));
      bookingData.bookingForUser = this.bookingForUser;
      bookingData.userIsBooking = this.userIsBooking || null;
      const flightBookingContact = new BookingContact();
      flightBookingContact.email = this.userForm.value.email || this.user.email;
      flightBookingContact.createAccount = this.userForm.value.createAccount;
      flightBookingContact.password = this.userForm.value.passwordGroup.password;
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
      } else {
        accountBooking = null;
      }
      bookingData.flightType = this.typeFlight;
      bookingData.accountBooking = accountBooking;
      bookingData.bookingContact = flightBookingContact;
      bookingData.vcnPayment = this.isVcnPayment;
      if (this.orderChange) {
        bookingData.orderChange = this.orderChange;
      }
      sessionStorage.setItem(flightConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.passengerList));
      const cardPaymentSave: CardPaymentModel = Object.assign({}, this.cardPaymentForm.value);
      cardPaymentSave.cvv = '';
      sessionStorage.setItem(flightConstant.CARD_PAYMENT, JSON.stringify(cardPaymentSave));
      sessionStorage.setItem(appConstant.FLIGHT_PAYMENT_INFO, JSON.stringify(bookingData));
      sessionStorage.setItem(flightConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.passengerList));
      const createOrderReq = this.flightPaymentService.buildFlightPaymentRequest(bookingData);
      this.store.dispatch(
        new FlightListActions.HoldBookingStart(createOrderReq)
      );
      this.route.navigate(['../hold-booking-result'], {
        relativeTo: this.activatedRoute,
      });
      this.sessionTimer.endSession();

    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  buyNow(route?: boolean) {
    if (
      this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)
    ) {
      const bookingData: FlightPaymentData = new FlightPaymentData();
      this.convertDate(this.customersForm.value.passengerList);
      this.convertMobile2(this.customersForm.value.passengerList);
      // this.mapDOB(this.customersForm.value.passengerList);
      bookingData.bookingHold = false;
      bookingData.bspBooking = this.bspBooking;
      // this.convertMobile(this.customersForm.value.passengerList);
      if (this.isRefundProtect) {
        bookingData.addonRefundProtect = true;
        const sessionId = sessionStorage.getItem(hepstarConstant.SESSION);
        bookingData.helpstarSession = sessionId;
        bookingData.refundProtectPrice =
          +(this.refundProtectItem.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount.toFixed(2));
        // this.totalTripPrice = this.totalTripPriceCache;
        const productCode = this.refundProtectItem.pricedProduct.productInformation.productCode;
        const passangerNumber = this.customersForm.value.passengerList.length || 1;
        const requestParameters = this.hepstarService
          .buildRequestParameters(this.searchFlightForm, this.totalTripPrice, productCode, passangerNumber,
            this.customersForm.value.passengerList);
        bookingData.requestParameters = requestParameters;
        sessionStorage.setItem(flightConstant.ADD_ON_REFUND_PROTECT, JSON.stringify(this.refundProtectItem));
      }
      if (this.orderChange) {
        bookingData.orderChange = this.orderChange;
      }
      if (this.isSmartDelay) {
        bookingData.addonSmartDelay = true;
        const sessionId = sessionStorage.getItem(hepstarConstant.SESSION);
        bookingData.helpstarSession = sessionId;
        bookingData.smartDelayPrice = +(this.smartDelayItem.pricedProduct.productPriceBreakdown.priceDetails[0]
          .totalAmount.amount.toFixed(2));
        // this.totalTripPrice = this.totalTripPriceCache;
        const productCode = this.smartDelayItem.pricedProduct.productInformation.productCode;
        const passangerNumber = this.customersForm.value.passengerList.length || 1;
        const requestParameters = this.hepstarService.buildRequestParameters(this.searchFlightForm, this.totalTripPrice,
          productCode, passangerNumber, this.customersForm.value.passengerList);
        bookingData.smartDelayRequestParameters = requestParameters;
        sessionStorage.setItem(flightConstant.ADD_ON_SMART_DELAY, JSON.stringify(this.smartDelayItem));
      }

      if (this.isTraceme) {
        const tracemeAddon = new TraceMeData();
        tracemeAddon.quoteId = this.quoteId.toString();
        tracemeAddon.quote = this.tracemeItem;
        bookingData.traceMeData = tracemeAddon;
        sessionStorage.setItem(flightConstant.ADD_ON_TRACEME, JSON.stringify(this.tracemeItem));
      }
      if (this.isGcaAddon) {
        bookingData.addonGca = true;
        bookingData.gcaBookingId = this.gcaBookingId;
        sessionStorage.setItem(flightConstant.ADD_ON_GCA, JSON.stringify(this.gcaBookingItem));
      } else {
        bookingData.addonGca = false;
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
        bookingData.subscribePolicyData = subscriptionData;
        const auth: AuthResponse = JSON.parse(sessionStorage.getItem(insuranceConstant.AUTH_AXA)) || 'token';
        bookingData.tokenInsurance = auth.accessToken;
        sessionStorage.setItem(flightConstant.ADD_ON_INSURANCE, JSON.stringify(this.insuranceItemItem));
      }
      if (this.aeroProvider) {
        this.createBooking = JSON.parse(
          sessionStorage.getItem(flightConstant.CREATE_BOOKING)
        );
        bookingData.bookingId =
          this.createBooking.result.aerocrs.booking.bookingid.toString();
        // extras info flight
        this.departureFlight.flight.flightSegments[0].depAirportName =
          this.createBooking.result.aerocrs.booking.items.flight[0].from.toString();
        this.departureFlight.flight.flightSegments[0].arrAirportName =
          this.createBooking.result.aerocrs.booking.items.flight[0].to.toString();
        this.departureFlight.flight.offerItemList[0].services[0] =
          this.departureFlight.flight.offerItemList[0].className;
        bookingData.departureFlight = this.departureFlight.flight;
        if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
          this.returnFlight = JSON.parse(
            sessionStorage.getItem(flightConstant.RETURN_FLIGHT)
          );
          this.returnFlight.flight.flightSegments[0].depAirportName =
            this.createBooking.result.aerocrs.booking.items.flight[1].from.toString();
          this.returnFlight.flight.flightSegments[0].arrAirportName =
            this.createBooking.result.aerocrs.booking.items.flight[1].to.toString();
          this.returnFlight.flight.offerItemList[0].services[0] =
            this.returnFlight.flight.offerItemList[0].className;
          bookingData.returnFlight = this.returnFlight.flight;
        }
        if (this.typeFlight === flightTypeValue.MULTI_CITY) {
          bookingData.nextFlights = [];
          this.nextFlights.forEach((data) => {
            bookingData.nextFlights.push(data.flight);
          });
        }
      } else {
        // extras info flight
        bookingData.departureFlight = this.departureFlight.flight;
        if (this.typeFlight === flightTypeValue.ROUND_TRIP) {
          bookingData.returnFlight = this.returnFlight.flight;
        }
        if (this.typeFlight === flightTypeValue.MULTI_CITY) {
          bookingData.nextFlights = [];
          this.nextFlights.forEach((data) => {
            bookingData.nextFlights.push(data.flight);
          });
        }
      }
      bookingData.offerItems = [];
      if (this.offerPrices && !this.aeroProvider && !this.floFlightProvider) {
        if (this.qrProvider) {
          bookingData.offerItems = this.offerItemSelected;
        } else {
          const item = new OfferItemSelected();
          item.offerId = this.offerPrices.pricedOffer.offerID;
          item.owner = this.offerPrices.pricedOffer.owner;
          item.offerItemId = this.offerPrices.pricedOffer.offerItem[0].offerItemID;
          bookingData.offerItems.push(item);
        }
        bookingData.offerPriceId = this.offerPrices.id;
      }
      bookingData.cardPayment = this.cardPaymentForm.value;
      bookingData.passegersInfo = this.customersForm.value.passengerList;
      // bookingData.passegersInfo[0].country = this.countryCode;
      bookingData.passegersInfo.forEach((data, i) => {
        data.country = this.countryCode;
      });
      bookingData.currency = this.currency;
      bookingData.executionId = this.executionId;
      bookingData.searchFlightForm = this.searchFlightForm;
      bookingData.totalPrice = +(this.totalTripPriceCache.toFixed(2));
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
      bookingData.flightType = this.typeFlight;
      bookingData.accountBooking = accountBooking;
      bookingData.bookingContact = flightBookingContact;
      bookingData.vcnPayment = this.isVcnPayment;

      sessionStorage.setItem(flightConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.passengerList));
      const cardPaymentSave: CardPaymentModel = Object.assign({}, this.cardPaymentForm.value);
      cardPaymentSave.cvv = '';
      sessionStorage.setItem(flightConstant.CARD_PAYMENT, JSON.stringify(cardPaymentSave));
      sessionStorage.setItem(appConstant.FLIGHT_PAYMENT_INFO, JSON.stringify(bookingData));
      sessionStorage.setItem(flightConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.passengerList));
      if (!this.isVcnPayment) {
        const createOrderReq = this.flightPaymentService.buildFlightPaymentRequest(bookingData);
        this.store.dispatch(
          new FlightListActions.BookingFlightStart(createOrderReq)
        );
        this.route.navigate(['../booking-result'], {
          relativeTo: this.activatedRoute,
        });
      } else {
        if (this.totalTripPriceCache == 0) {
          const createOrderReq = this.flightPaymentService.buildFlightPaymentRequest(bookingData);
          this.store.dispatch(
            new FlightListActions.BookingFlightStart(createOrderReq)
          );
          this.route.navigate(['../booking-result'], {
            relativeTo: this.activatedRoute,
          });

        } else {
          const vcnRequestCache = sessionStorage.getItem(flightConstant.FLIGHT_VCN_GENERATE);
          if (!vcnRequestCache) {
            sessionStorage.setItem(flightConstant.FLIGHT_VCN_GENERATE, JSON.stringify(bookingData));
          }
          bookingData.merchantPayment = this.user ? this.user.merchantPayment : null;
          bookingData.vcnPayment = this.isVcnPayment;
          // validate balance
          if (!route) {
            const canGenerateVcn = this.checkWalletBalance(true);
            if (canGenerateVcn) {
              this.store.dispatch(new FlightListActions.GetVcnStart(bookingData));
              this.route.navigate(['../updateOtp'], {
                relativeTo: this.activatedRoute,
              });
            }
          }
        }
      }
      this.sessionTimer.endSession();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }


  mapDOB(passengerList: any[]) {
    passengerList.map((p, index) => {
      p.birthDate = this.datePipe.transform(this.passengerDoB[index], 'yyyy-MM-dd');
    });
  }

  convertDate(passengerList: any[]) {
    passengerList.map(p => {
      p.birthDate = this.datePipe.transform(p.birthDate, 'yyyy-MM-dd');
    });
  }

  convertMobile(passengerList: any): void {
    passengerList.map((p, i) => {
      if (i < this.adultCount && p.phoneNo) {
        const phoneModel: any = p.phoneNo;
        p.phoneNo = phoneModel.internationalNumber.replace(' ', '');
      }
    });
  }

  convertMobile2(customerInfo: any) {
    customerInfo.map((p, i) => {
      const phoneModel: any = p.phoneNo;
      if (phoneModel && phoneModel.nationalNumber) {
        p.phoneNo = phoneModel.nationalNumber.replaceAll(' ', '');
      } else {
        p.phoneNo = phoneModel;
      }
      console.log(JSON.stringify(p.phoneNo));
    });
  }

  checkWalletBalance(route = false): boolean {
    console.log('check balance!!');
    const balanceCheck = this.user.walletBalance.find(item => item.currency == this.currency);
    if (this.servicesResponse) {
      const exchangeRate = this.servicesResponse.exchangeRate;
      const rate = exchangeRate.exchange.rate || 1.0;
      if (balanceCheck) {
        if ((+balanceCheck.balance * rate) < +(this.totalTripPriceCache.toFixed(2))) {
          if (route) {
            this.route.navigate(['/bank-deposit/start']);
            // deposit step 1
            const depositStart = new DepositStep1();
            depositStart.countryCode = this.countryCode;
            depositStart.currencyCode = this.currency;
            depositStart.countryName = this.country;
            depositStart.currencyName = this.currency;
            depositStart.amount = +(this.totalTripPriceCache.toFixed(2));
            sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.FLIGHT);
            sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
          }
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
    if (this.offerPrices) {
      const exchangeRate = this.offerPrices.exchangeRate;
      const rate = exchangeRate.exchange.rate || 1.0;
      if (balanceCheck) {
        if ((+balanceCheck.balance * rate) < +(this.totalTripPriceCache.toFixed(2))) {
          if (route) {
            this.route.navigate(['/bank-deposit/start']);
            // deposit step 1
            const depositStart = new DepositStep1();
            depositStart.countryCode = this.countryCode;
            depositStart.currencyCode = this.currency;
            depositStart.countryName = this.country;
            depositStart.currencyName = this.currency;
            depositStart.amount = +(this.totalTripPriceCache.toFixed(2));
            sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.FLIGHT);
            sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
          }
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  goToBankDeposit() {
    this.buyNow(true);
    if (this.countryCode && this.currency && this.country && this.currency) {
      this.route.navigate(['/bank-deposit/start']);
      // deposit step 1
      const depositStart = new DepositStep1();
      depositStart.countryCode = this.countryCode;
      depositStart.currencyCode = this.currency;
      depositStart.countryName = this.country;
      depositStart.currencyName = this.currency;
      depositStart.amount = +(this.totalTripPriceCache.toFixed(2));
      sessionStorage.setItem(depositConstant.SERVICE_PENDING, SERVICENAME.FLIGHT);
      sessionStorage.setItem(depositConstant.DEPOSIT_STEP_1, JSON.stringify(depositStart));
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  generateDates() {
    for (let i = 1; i <= 31; i++) {
      this.allDates.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      this.months.push(i);
    }
    for (let i = 1920; i <= 2030; i++) {
      this.years.push(i);
    }
    this.dates = this.allDates;
    this.setDate();
  }

  setDate() {
    if (this.dob) {
      this.selectedDate = this.dob.getDate();
      this.selectedMonth = this.dob.getMonth() + 1;
      this.selectedYear = this.dob.getFullYear();
    }
    this.setDates();
  }

  isLeapYear() {
    return (
      this.selectedYear % 400 === 0 ||
      (this.selectedYear % 100 !== 0 && this.selectedYear % 4 === 0)
    );
  }


  setDates() {
    let maxDate = 31;
    if (this.selectedMonth === 2) {
      maxDate = this.isLeapYear() ? 29 : 28;
    } else if (this.thirtyDaysMonths.includes(this.selectedMonth)) {
      maxDate = 30;
    }
    this.dates = this.allDates.filter(f => f <= maxDate);
  }

  dateChanged(value: any) {
    this.dob = new Date(this.selectedYear, this.selectedMonth - 1, value);
    this.selectedDate = value;
  }

  monthChanged(value: any) {
    let maxDate = 31;
    if (value === 2) {
      maxDate = this.isLeapYear() ? 29 : 28;
    } else if (this.thirtyDaysMonths.includes(value)) {
      maxDate = 30;
    }

    this.dates = this.allDates.filter(f => f <= maxDate);

    if (this.selectedDate > maxDate) {
      this.selectedDate = 1;
      this.cdRef.detectChanges();
    }

    this.dob = new Date(this.selectedYear, value - 1, this.selectedDate);
    this.selectedMonth = value;
  }

  yearChanged(value: any) {
    this.dob = new Date(value, this.selectedMonth - 1, this.selectedDate);
    this.selectedYear = value;
    this.passengerDoB.push(this.dob);
    this.customersForm.controls['passengerList'].updateValueAndValidity();
    this.mapDOB(this.customersForm.value.passengerList);
    console.log(this.customersForm);
  }

}
