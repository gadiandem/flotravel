import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BsModalRef, ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { CardPaymentModel } from "src/app/model/hotel/hotel-payment/card-payment.model";
import { UserInfoModel } from "src/app/model/hotel/hotel-payment/user-info.model";
import { HotelShoppingReq } from "src/app/model/dashboard/hotel/hotel-shopping-req";
import { LoginRegisterDialogComponent } from '../../../../shared/login-register-dialog/login-register-dialog.component';
import { LoginForm } from "src/app/model/auth/login-register/login-form";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { appConstant } from "src/app/app.constant";
import { hotelConstant } from '../../../hotel.constant';
import { passwordMatcher } from "src/app/shared/validator/password-match.validator";
import { HotelCustomerInfo } from "src/app/model/hotel/hotel-cart/hotelCustomerInfo";
import { BookingContact } from "src/app/model/common/booking-contact";
import { PaymentService } from "src/app/service/payment/payment.service";
import { Observable, Observer, of } from "rxjs";
import { CountryRes } from "src/app/model/common/country/country-res";
import { debounceTime, map, switchMap, tap } from "rxjs/operators";
import { SearchCountryService } from "src/app/service/search-country.service";
import { packagesConstant } from '../../../../packages/packages.constant';
import { PackageShoppingRes } from '../../../../model/packages/consumer/package-shopping-res';
import { DatePipe } from '@angular/common';
import { EmailExistValidationService } from '../../../../shared/validator/email-exist.validator';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { listCountryForPackage } from '../../../../dashboard/dashboard.constant';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import * as fromApp from '../../../../store/app.reducer';
import * as HotelActions from '../../../store/hotel.actions';
import { adminConstant } from "src/app/admin/userGroup-constant";

@Component({
  selector: 'app-hotel-cart-simulator',
  templateUrl: './hotel-cart-simulator.component.html',
  styleUrls: ['./hotel-cart-simulator.component.css']
})
export class HotelCartSimulatorComponent implements OnInit {
  messages: any = {
    validDate: "valid\ndate",
    monthYear: "mm/yyyy",
  };
  placeholders: any = {
    number: "•••• •••• •••• ••••",
    name: "Full Name",
    expiry: "••/••",
    cvc: "•••",
  };
  masks: any;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  isAgent: boolean;
  merchantExist: boolean;
  isVcnPayment: boolean;
  userIsBooking: string;
  bookingForUser: boolean;

  country: string= '';
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

  sessionId: string;
  hotelSelected: HotelInfoSimulator;
  selectedRoom: HotelRoomSimulator;
  starRating: number[];
  currency: string;

  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  numberOfNight = 1;
  numberOfRoom = 1;
  isDemo: boolean;
  listCountryReq: string[];
  countries: CountryRes[];
  countryCode: string;
  totalPrice: number;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    public searchCountry: SearchCountryService,
    private fb: FormBuilder,
    private hotelPaymentService: PaymentService,
    public datePipe: DatePipe,
    private emailExistValidationService: EmailExistValidationService,
    protected dashboardService: DashboardService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.initForm();
    this.merchantExist = false;
    this.isVcnPayment = false;
    this.listCountryReq = listCountryForPackage;
    this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.formSubmitError = false;
    this.searchHotelListForm = JSON.parse( sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    if (this.searchHotelListForm == null) {
      this.route.navigate(["/"]);
    }
    this.sessionId = JSON.parse(sessionStorage.getItem(hotelConstant.SESSION_ID));
    this.hotelSelected = JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
    this.selectedRoom =  JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
    this.numberOfRoom = this.searchHotelListForm.rooms.length;
    this.getNumberOfNight();
    this.totalPrice = (this.selectedRoom.pricePerNight * this.numberOfNight * this.numberOfRoom * (1 - this.selectedRoom.discount/100));
    this.currency = this.hotelSelected.currency;
    this.hotelCustomersInfo = JSON.parse(sessionStorage.getItem(hotelConstant.CUSTOMERS_INFO));
    this.userInfo = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.cardPayment = JSON.parse(sessionStorage.getItem(hotelConstant.CARD_PAYMENT));
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.autoCompleteCountry();
    if (this.hotelCustomersInfo != null && this.cardPayment != null) {
      this.initFormWithData();
    }
    if (this.numberOfRoom > 1) {
      for (let i = 1; i < this.numberOfRoom; i++) {
        this.addMoreCustomer();
      }
    }
    this.store.select("auth").subscribe((authState) => {
      this.user = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if (!this.merchantExist) {
          this.checkMerchantExist();
        }
      }
      this.refreshData();
    });
    this.userForm
      .get("createAccount")
      .valueChanges.subscribe((value) => this.setNotification(value));
  }

  getNumberOfNight() {
    this.numberOfNight = Math.ceil(((new Date(this.searchHotelListForm.checkoutDate)).getTime()
      - (new Date(this.searchHotelListForm.checkinDate)).getTime()) / (24 * 3600 * 1000));
  }


  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  updateProfile(){
    this.route.navigate(["/admin/user/profile/", this.user.id], {
      relativeTo: this.activeRoute,
    });
  }

  setNotification(createAccount: boolean): void {
    const password = this.userForm.get("passwordGroup.password");
    const confirmPassword = this.userForm.get("passwordGroup.confirmPassword");
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

  checkMerchantExist() {
    if (this.user.active) {
      this.merchantExist = true;
      this.isVcnPayment = true;
    }

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
  refreshData() {
    this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
    this.starRating = new Array();
    const getStar: number = Math.ceil(+this.hotelSelected.starRate);
    for (let i = 0; i < getStar; i++) {
      this.starRating.push(i);
    }
  }

  private initForm() {
    this.customersForm = this.fb.group({
      customerInfo: this.fb.array([this.buildFirstCustomerInfo()]),
    });
    this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      cvv: ["", Validators.required],
    });
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: ["", [Validators.required]],
          confirmPassword: ["", [Validators.required]],
        },
        { validator: passwordMatcher }
      ),
      createAccount: false,
    });
  }

  private initFormWithData() {
    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
      cvv: this.cardPayment.cvv,
    });

    if (this.userInfo) {
      this.userForm.patchValue({
        email: this.userInfo.email,
      });
    }
  }

  get customerInfo(): FormArray {
    return this.customersForm.get("customerInfo") as FormArray;
  }

  addMoreCustomer(): void {
    this.customerInfo.push(this.buildAdditionalCustomer());
  }

  buildFirstCustomerInfo(): FormGroup {
    return this.fb.group({
      gender: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      country: ["", Validators.required],
      mobile: [undefined, Validators.required],
      isNotify: [true],
      passport: ["", Validators.required],
    });
  }

  buildAdditionalCustomer(): FormGroup {
    return this.fb.group({
      gender: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      country: [""],
      mobile: [""],
      isNotify: [false],
      passport: [""],
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
              return data;
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

  getCountryCode(country: any) {
    this.countryCode = country.code;
  }
  onSelectCountry(value: any) {
    let countrySelected = this.countries.filter(item => item.code === value);
    this.countryCode = countrySelected[0].code;
    this.country = countrySelected[0].name;
  }
  openModalWithComponent() {
    const initialState = {
      // searchData: Object.assign({}, this.searchHotelForm),
    };
    // this.bsConfig.initialState = initialState;
    this.bsConfig.class = "modal-sm";
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      LoginRegisterDialogComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = "Close";

    this.bsModalRef.content.event.subscribe((res: UserDetail) => {
      this.loginData = res;
      this.user = res;
    });
  }

  buyNow() {
   // if (this.customersForm.valid && this.cardPaymentForm.valid && this.userForm.valid){
      const d: any = this.customersForm.value;
      this.convertMobile(this.customersForm.value.customerInfo);
      sessionStorage.setItem(hotelConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value.customerInfo));
      sessionStorage.setItem(hotelConstant.CARD_PAYMENT, JSON.stringify(this.cardPaymentForm.value));
      const hotelBookingContact = new BookingContact();
      let accountBooking: string;
      if (this.user) {
        accountBooking = this.user.id;
        hotelBookingContact.email = this.userForm.value.email || this.user.email;
        hotelBookingContact.createAccount = false;
      } else {
        hotelBookingContact.email = this.userForm.value.newEmail;
        hotelBookingContact.createAccount = true;
        hotelBookingContact.password = this.userForm.value.passwordGroup.password;
        accountBooking = null;
      }

      if (!this.isVcnPayment) {
      const paymentReq = this.hotelPaymentService.buildHotelSimulatorPaymentRequest(
        this.cardPaymentForm.value,
        false,
        this.currency,
        this.totalPrice,
        this.selectedRoom,
        this.customersForm.value.customerInfo,
        this.hotelSelected,
        hotelBookingContact,
        accountBooking,
        false,
        accountBooking,
        this.countryCode,
        this.searchHotelListForm
      );
      this.route.navigate(["../booking-result"], {
        relativeTo: this.activeRoute,
      });
    } else {
      this.store.dispatch(
        new HotelActions.GetVcnSimulatorStart({
          data: {
            cardPayment:  this.cardPaymentForm.value,
            vcnPayment: this.isVcnPayment,
            merchantPayment: this.user.merchantPayment,
            currency: this.currency,
            totalPrice : this.totalPrice,
            selectedRoom: this.selectedRoom,
            customerRoomInfos:  this.customersForm.value.customerInfo,
            hotelSelected: this.hotelSelected,
            hotelBookingContact,
            accountBooking,
            bookingForUser: this.bookingForUser || false,
            userIsBooking : this.userIsBooking,
            countryCode: this.countryCode,
            hotelShoppingReq : this.searchHotelListForm
          },
        })
      );
      this.route.navigate(['../updateOtp'], {
        relativeTo: this.activeRoute,
      });
    }

 //  } else {
  //    this.formSubmitError = true;
  //    window.scroll(0, 0);
      return;
  //  }
  }

  convertMobile(customerInfo: any) {
    customerInfo.map((p, i) => {
      if (i === 0) {
        const phoneModel: any = p.mobile;
        p.mobile = phoneModel.internationalNumber;
      }
    })
  }
}
