import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { BsModalRef, ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { Store } from "@ngrx/store";

import { LoginRegisterDialogComponent } from "src/app/shared/login-register-dialog/login-register-dialog.component";
import { LoginForm } from "src/app/model/auth/login-register/login-form";
import { UserInfoModel } from "src/app/model/common/user-info-model";
import { CardPaymentModel } from "src/app/model/thing-to-do/tour-payment/card-payment-model";
import { ExtrasPackage } from "src/app/model/thing-to-do/insert-tour/extras-package";
import * as fromApp from "../../store/app.reducer";
import * as TourActions from "../store/thing-to-do.actions";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { thingToDoConstant } from "../thing-to-do.constant";
import { ExtraDetailAvailabilityView } from "src/app/model/thing-to-do/tour-detail/extra-detail-view";
import { appConstant } from "src/app/app.constant";
import { TourShoppingRQ } from "src/app/model/thing-to-do/tour-shopping-req";
import { passwordMatcher } from "src/app/shared/validator/password-match.validator";
import { SessionStorageService } from "src/app/service/session-storage.service";
import { BookingContact } from "src/app/model/common/booking-contact";
import { PaymentService } from "src/app/service/payment/payment.service";
import { adminConstant } from "src/app/admin/userGroup-constant";
import { ExtraDetailAvailabilityCheckRS } from "src/app/model/thing-to-do/availability-check/extra-detail-availability-check-res";
import { CountryRes } from "src/app/model/common/country/country-res";

@Component({
  selector: "app-tour-cart",
  templateUrl: "./tour-cart.component.html",
  styleUrls: ["./tour-cart.component.css"],
})
export class TourCartComponent implements OnInit {
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
  // user: User;
  starRating = [0, 1, 2, 3, 4];
  searchTourForm: TourShoppingRQ;
  userInfo: UserInfoModel[];
  cardPayment: CardPaymentModel;
  duration: string;
  currency: string;
  selectedTour: ExtrasPackage;
  selectedSchedule: ExtraDetailAvailabilityView;
  itemPrice = 0;
  customerAmount: number;
  bookingForUser: boolean;
  userIsBooking: string;

  extraAvailabilityCheckResult: ExtraDetailAvailabilityCheckRS;

  countries: CountryRes[];
  countryCode: string;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private store: Store<fromApp.AppState>,
    private tourPaymentService: PaymentService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.formSubmitError = false;
    // this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.cardPayment = new CardPaymentModel();
    this.customerAmount = 0;
    this.isVcnPayment =false;
    this.initForm();
    this.countries = JSON.parse(localStorage.getItem(appConstant.COUNTRY));
    this.selectedSchedule = JSON.parse(
      sessionStorage.getItem(thingToDoConstant.SELECTED_SCHEDULE)
    );
    this.store.select("tourList").subscribe((data) => {
      this.searchTourForm =
        data.searchTourReq ||
        JSON.parse(
          sessionStorage.getItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST)
        );
      this.selectedTour =
        data.selectedTour ||
        JSON.parse(sessionStorage.getItem(thingToDoConstant.SELECTED_TOUR));
      // this.selectedSchedule = data.selectedSchedule;
      this.extraAvailabilityCheckResult = data.extraAvailability || JSON.parse(sessionStorage.getItem(thingToDoConstant.AVAILABILITY_CHECK_RES));
      if(this.extraAvailabilityCheckResult){
        this.itemPrice = this.extraAvailabilityCheckResult.totalPrice;
      }
      this.currency = this.selectedTour.currency || 'USD';
      // if (this.selectedSchedule && this.selectedTour) {
      //   this.currency = this.selectedTour.currency;
      //   this.duration = this.selectedTour.duration;
      //   this.itemPrice =
      //     this.selectedSchedule.adultCount *
      //       (this.selectedTour.price + this.selectedSchedule.extraPrice) +
      //     this.selectedSchedule.childCount *
      //       (this.selectedTour.priceForChild +
      //         this.selectedSchedule.extraPrice);
      // }
    });
    this.store.select("auth").subscribe((authState) => {
      this.user =
        authState.user ||
        JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if(this.user){
          this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        }
    });
    if (this.selectedSchedule) {
      this.customerAmount =
        this.selectedSchedule.adultCount + this.selectedSchedule.childCount;
      for (let i = 1; i < this.customerAmount; i++) {
        this.addMoreCustomer();
      }
    }

    this.userInfo = JSON.parse(
      sessionStorage.getItem(thingToDoConstant.USER_INFO)
    ) || [];
    this.cardPayment = JSON.parse(
      sessionStorage.getItem(thingToDoConstant.CARD_PAYMENT)
    );
    if (this.userInfo && this.cardPayment) {
      this.initFormWithData();
    }
  }

  private initForm() {
    this.customersForm = this.fb.group({
      customerInfo: this.fb.array([this.buildFirstCustomerInfo()]),
    });
    this.cardPaymentForm = this.fb.group({
      cardNo: ["", Validators.required],
      cardName: ["", Validators.required],
      expiry: ["", Validators.required],
      cvv: ["", Validators.required],
    });
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          password: [""],
          confirmPassword: [""],
        },
        { validator: passwordMatcher }
      ),
      createAccount: false,
    });
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
      mobile: ["", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(10), Validators.maxLength(15)]],
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
    });
  }
  private initFormWithData() {
    this.cardPaymentForm.patchValue({
      cardNo: this.cardPayment.cardNo,
      cardName: this.cardPayment.cardName,
      expiry: this.cardPayment.expiry,
    });
    if (this.userInfo) {
      this.customersForm.patchValue({
        customerInfo: this.userInfo
      });
    }
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
      console.log("!!data from cart: " + JSON.stringify(this.loginData));
    });
  }
  useSelected(event: string) {
    this.userIsBooking = event;
  }
  agencyBooking(event: boolean) {
    this.bookingForUser = event;
  }
  paymentTypeUpdate(vcnPayment: boolean){
    this.isVcnPayment =  vcnPayment;
  }

  getCountryCode(country: any) {
    this.countryCode = country.code;
  }
  onSelectCountry(value: any) {
    let countrySelected = this.countries.filter(item => item.code === value);
    this.countryCode = countrySelected[0].code;
  }

  buyNow() {
    if (this.user === null && !this.userForm.value.createAccount) {
      this.openModalWithComponent();
    }
    if (this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment)) {
      // if (this.user != null) {
      this.sessionStorageService.set(
        thingToDoConstant.USER_INFO,
        this.customersForm.value.customerInfo
      );

      this.sessionStorageService.set(
        thingToDoConstant.CARD_PAYMENT,
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
      if(!this.isVcnPayment){
        const paymentReq = this.tourPaymentService.buildTourPaymentRequest(this.cardPaymentForm.value,
              this.isVcnPayment,
              this.currency,
              this.itemPrice,
              this.customersForm.value.customerInfo,
              bookingContact,
              accountBooking,
              this.bookingForUser || false,
              this.userIsBooking || accountBooking,
              this.selectedTour,
              this.selectedSchedule,
              this.countryCode
        )
        this.store.dispatch(
          new TourActions.PaymentTourStart({
            data: paymentReq
          })
        );
        this.route.navigate(["../booking-result"], {
          relativeTo: this.activeRoute,
        });
      } else {
        this.store.dispatch(
          new TourActions.GetVcnStart({
            data: {
              cardPayment: this.cardPaymentForm.value,
              vcnPayment: this.isVcnPayment,
              currency: this.currency,
              amount: this.itemPrice,
              customerRoomInfos: this.customersForm.value.customerInfo,
              tourBookingContact: bookingContact,
              accountBooking: accountBooking,
              bookingForUser: this.bookingForUser || false,
              userIsBooking: this.userIsBooking || accountBooking,
              tour: this.selectedTour,
              schedule: this.selectedSchedule,
              countryCode: this.countryCode
            },
          })
        );
        this.route.navigate(["../updateOtp"], {
          relativeTo: this.activeRoute,
        });
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}
