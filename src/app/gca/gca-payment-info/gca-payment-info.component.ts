import { Component, OnInit } from "@angular/core";
import { CardPaymentModel } from "src/app/model/hotel/hotel-payment/card-payment.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { BsModalRef, ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { LoginRegisterDialogComponent } from "src/app/shared/login-register-dialog/login-register-dialog.component";
import { LoginForm } from "src/app/model/auth/login-register/login-form";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { AlertifyService } from "src/app/service/alertify.service";
import { UserDetail } from "src/app/model/auth/user/user-detail";
import { appConstant } from "src/app/app.constant";
import * as GcaActions from '../store/gca.actions';
import * as fromApp from "../../store/app.reducer";
import { passwordMatcher } from "src/app/shared/validator/password-match.validator";
import { BookingContact } from "src/app/model/common/booking-contact";
import { PaymentService } from "src/app/service/payment/payment.service";
import { adminConstant } from "src/app/admin/userGroup-constant";
import { PassegerInfo } from "src/app/model/flight/payment-info/passeger.info";
import { DatePipe } from "@angular/common";
import { Observable, Observer, of } from "rxjs";
import { CountryRes } from "src/app/model/common/country/country-res";
import { debounceTime, map, switchMap, tap } from "rxjs/operators";
import { SearchCountryService } from "src/app/service/search-country.service";
import {PaymentInfoReq} from '../../model/gca/payment-info/payment-info-req';
// import {CustomerBookingInfoGca} from '../../model/gca/payment-info/customer-booking-info-gca';
import {gcaConstant} from '../gca.constant';
import { QuoteCreatedRes } from "src/app/model/gca/quote/response/quote-created-res";
import { GcaItemResult } from "src/app/model/gca/shopping/response/gca-item-result";
import { GcaListRes } from "src/app/model/gca/shopping/response/gca-list-res";
import {flightConstant} from '../../flight/flight.constant';
import {GcaQuoteResult} from '../../model/gca/quote/response/gca-quote-result';
import {CardInfo} from '../../model/flocash/card-info';
import {PaymentInfo} from '../../model/flocash/payment-info';
import {Payer} from '../../model/flocash/payer';
import { ServiceTerminalGca } from "src/app/model/gca/shopping/response/service-terminal-gca";
import { SelectedTerminal } from "src/app/model/gca/common/selected-terminal";
@Component({
  selector: 'app-gca-payment-info',
  templateUrl: './gca-payment-info.component.html',
  styleUrls: ['./gca-payment-info.component.css']
})
export class GcaPaymentInfoComponent implements OnInit {
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

  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;

  country: string= '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  isCollapsed: boolean[];
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  bsConfigDatePicker: Partial<BsDatepickerConfig>;
  formSubmitError: boolean;
  initialForm: boolean;

  cardPayment: CardPaymentModel;
  user: UserDetail;
  loginData: LoginForm;
  masks: any;

  // selectedDepartureService: any;
  // selectedArrivalService: any
  gcaListRes: GcaListRes;
  gcaData: GcaItemResult;
  quoteCreateRes: QuoteCreatedRes;
  quoteGcaResult: GcaQuoteResult;

  currency: string;
  minDate = new Date(2000, 1, 1);
  maxDate = new Date();
  bookingForUser: boolean;
  userIsBooking: string;
  bookingId: string;

  isAgent: boolean;
  isVcnPayment: boolean;
  merchantExist: boolean;

  selectedDepartureServices: ServiceTerminalGca[];
  selectedDepartureTerminal: SelectedTerminal;

  selectedArrivalServices: ServiceTerminalGca[];
  selectedArrivalTerminal: SelectedTerminal;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private store: Store<fromApp.AppState>,
    public searchCountry: SearchCountryService,
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private gcaPaymentService: PaymentService
  ) {}

  ngOnInit() {
    this.initialForm = true;
    this.merchantExist = false;
    this.user = new UserDetail();
    this.formSubmitError = false;
    this.isCollapsed = [true, true];
    this.bsConfig = new ModalOptions();
    this.currency = 'USD';
    this.autoCompleteCountry();
    this.selectedDepartureServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_SERVICES)) || [];
    this.selectedDepartureTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_DEPARTURE_TERMINAL));
    this.selectedArrivalServices = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_SERVICE)) || [];
    this.selectedArrivalTerminal = JSON.parse(sessionStorage.getItem(gcaConstant.SELECTED_ARRIVAL_TERMINAL));
    this.bsConfigDatePicker = Object.assign({},{
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: this.minDate,
        maxDate: this.maxDate,
        showWeekNumbers: false,
      }
    );

    this.bookingId = sessionStorage.getItem(gcaConstant.QUOTE_BOOKING_ID) || null;
    if (!this.bookingId) {
      this.route.navigate(["/"]);
    }
    this.initForm();
    this.store.select("auth").subscribe((data) => {
      this.user = data.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.isAgent = (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if(!this.merchantExist){
          this.checkMerchantExist();
        }
      }
    });
    this.cardPayment = JSON.parse(sessionStorage.getItem(gcaConstant.CARD_PAYMENT));

    this.store.select("gcaList").subscribe((data) => {
      this.quoteCreateRes = data.gcaQuoteResult;
      this.gcaListRes = data.searchGcaResult;
      if (this.gcaListRes && this.gcaListRes.result.data) {
        this.gcaData = this.gcaListRes.result;
      }
      if (this.quoteCreateRes) {
        this.quoteGcaResult = this.quoteCreateRes.gcaQuoteResult;
      }
    });
  }

  checkMerchantExist(){
    if(this.user.active){
      this.merchantExist = true;
      this.isVcnPayment = true;
    }

  }

  updateProfile(){
    this.route.navigate(["/admin/user/profile/", this.user.id], {
      relativeTo: this.activatedRoute,
    });
  }

  private initForm() {
    this.customersForm = this.fb.group({
      gender: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      country: ["", Validators.required],
      mobile: ["",  [Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(10), Validators.maxLength(15)]],
      isNotify: [""],
      passport: ["", Validators.required],
    });

    this.cardPaymentForm = new FormGroup({
      cardNumber: new FormControl("", Validators.required),
      cardHolder: new FormControl("", Validators.required),
      expiry: new FormControl("", Validators.required),
      cvv: new FormControl("", Validators.required),
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
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }
  openTerminal(){
    window.open(appConstant.TERMS_AND_CONDITIONS, "_blank");
  }

  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
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

  userSelected(event: string) {
    this.userIsBooking = event;
  }
  agencyBooking(event: boolean) {
    this.bookingForUser = event;
  }
  buyNow() {
    if (this.customersForm.valid && (this.cardPaymentForm.valid || this.isVcnPayment ))
     {
      const paymentInfoReq: PaymentInfoReq = new PaymentInfoReq();
      paymentInfoReq.bookingId = this.bookingId;
      paymentInfoReq.paymentInfo = new PaymentInfo();
      const cardPayment = this.cardPaymentForm.value;
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardHolder;
      cardInfo.cardNumber = cardPayment.cardNumber.replace(/ /g, "");
      const month_year: string[] = cardPayment.expiry.split(" / ");
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;

      console.log(cardInfo);

      paymentInfoReq.paymentInfo.cardInfo = cardInfo;
      paymentInfoReq.paymentInfo.currency = "USD";
      paymentInfoReq.paymentInfo.name = "gca test";
      paymentInfoReq.paymentInfo.price = +this.quoteCreateRes.gcaQuoteResult.billing.grand_total || 0;
      const payer: Payer = new Payer();
      payer.country = this.country;
      payer.firstName = this.customersForm.get("firstName").value;
      payer.email = this.userForm.get("email").value;
      payer.mobile = this.customersForm.get("mobile").value;
      payer.lastName = this.customersForm.get("lastName").value;
      paymentInfoReq.paymentInfo.payer = payer;
      sessionStorage.setItem(flightConstant.CUSTOMERS_INFO, JSON.stringify(this.customersForm.value));
      paymentInfoReq.customerBookingInfo = this.customersForm.value;

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
      paymentInfoReq.accountBooking = accountBooking;
      paymentInfoReq.bookingContact = bookingContact;
      paymentInfoReq.bookingForUser = false;
      const cardPaymentSave: CardPaymentModel = Object.assign({}, this.cardPaymentForm.value);
      cardPaymentSave.cvv = '';
      sessionStorage.setItem(gcaConstant.CARD_PAYMENT, JSON.stringify(cardPaymentSave));
      if (!this.isVcnPayment) {
        console.log(paymentInfoReq);
        this.store.dispatch(
          new GcaActions.PaymentGcaStart({data: paymentInfoReq})
        );
        this.route.navigate(["../booking-result"], {
          relativeTo: this.activatedRoute,
        });
      } else {
        this.store.dispatch(
          new GcaActions.GetVcnStart({
            data: {
              bookingId: this.bookingId,
              cardPayment: cardPaymentSave,
              vcnPayment: this.isVcnPayment,
              merchantPayment: this.user.merchantPayment,
              currency: this.currency,
              amount: +this.quoteGcaResult.billing.grand_total,
              customerInfo: this.customersForm.value,
              gcaBookingContact: bookingContact,
              accountBooking: accountBooking,
              bookingForUser: this.bookingForUser,
              userIsBooking: this.userIsBooking
            },
          })
        );
        this.route.navigate(["../updateOtp"], {
          relativeTo: this.activatedRoute,
        });
      }
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }
}

