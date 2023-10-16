import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { CardPaymentModel } from 'src/app/model/insurance/card-payment.req';
import { UserInfo } from 'src/app/model/common/user-info';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import * as fromApp from "../../store/app.reducer";
import * as HepstarActions from "./../store/hepstar.actions";
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { LoginForm } from 'src/app/model/auth/login-register/login-form';
import { passwordMatcher } from 'src/app/shared/validator/password-match.validator';
import {appConstant, appDefaultData} from 'src/app/app.constant';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { LoginRegisterDialogComponent } from 'src/app/shared/login-register-dialog/login-register-dialog.component';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { TraceMeShoppingReq } from 'src/app/model/traceme/shopping/traceme-shopping-req';
import { Observable, Observer, of } from 'rxjs';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { SearchCountryService } from 'src/app/service/search-country.service';
import { hepstarConstant } from '../hepstar.constant';
import { HepstarService } from 'src/app/service/hepstar/hepstar.service';
import { HepstarPurchaseAndBookingReq } from 'src/app/model/hepstar/hepstar-product-purchase-booking-req';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { CardInfo } from 'src/app/model/flocash/card-info';
import { Payer } from 'src/app/model/flocash/payer';
import { CorverCountries } from 'src/app/model/hepstar/cover-countries';
import { FlightInfomation } from 'src/app/model/hepstar/flight-infomation';
import { FlightInformations } from 'src/app/model/hepstar/flight-infomations';
import { CustomerItem } from 'src/app/model/hepstar/insured-item';
import { Customers } from 'src/app/model/hepstar/insureds';
import { PurchaseRequest } from 'src/app/model/hepstar/policy-request';
import { PolicyRequests } from 'src/app/model/hepstar/policy-requests';
import { RequestParameters } from 'src/app/model/hepstar/request-parameters';
import { TravelInfo } from 'src/app/model/hepstar/travel-info';
import { Itinerary } from 'src/app/model/hepstar/travel-infomation';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { ContactInformation } from 'src/app/model/hepstar/contract-infomation';
import { HepstarAddress } from 'src/app/model/hepstar/hepstar-address';
import { HepstarPhones } from 'src/app/model/hepstar/hepstar-phones';
import { HepstarPhone } from 'src/app/model/hepstar/hepstar-phone';
@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {
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

  searchHepstarReq: HepstarSearchFormData;


  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  formSubmitError: boolean;
  masks: any;
  cardPayment: CardPaymentModel;
  userInfo: UserInfo;
  user: UserDetail;
  loginData: LoginForm;

  // searchHepstarReq: TraceMeShoppingReq;
  selectedProduct: any;
  isPayment: boolean;
  customersForm: FormGroup;
  cardPaymentForm: FormGroup;
  userForm: FormGroup;
  bookingForUser = false;
  userIsBooking = "";
  isVcnPayment: boolean;
  isAgent: boolean;

  country: string= '';
  sugFlyFrom$: Observable<CountryRes[]>;
  searching = false;
  searchFailed = false;
  errorMessage: string[] = [];

  currency: string;
  maxDate = new Date();
  merchantExist: boolean;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private fb: FormBuilder,
    public store: Store<fromApp.AppState>,
    private paymentService: PaymentService,
    public searchCountry: SearchCountryService,
    private hepstarService: HepstarService
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.merchantExist = false;
    this.user = new UserDetail();
    this.bsConfig = new ModalOptions();
    this.cardPayment = new CardPaymentModel();
    this.formSubmitError = false;
    this.autoCompleteCountry();
    this.searchHepstarReq = JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM));
    this.selectedProduct = JSON.parse(sessionStorage.getItem(hepstarConstant.PRODUCT_SELECTED));
    this.currency = appDefaultData.DEFAULT_CURRENCY;
    this.isVcnPayment = false;
    this.initForm();
    // this.store.select("tracemeList").subscribe((data) => {
    //   this.searchHepstarReq = data.searchTracemeReq || JSON.parse(sessionStorage.getItem(hepstarConstant.TRACEME_LIST_REQ));

    // });
    this.store.select("auth").subscribe((authState) => {
      this.user = authState.user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
      if (this.user) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        this.isAgent =
        (this.user.userGroups[0].value === adminConstant.SADMIN) || (this.user.userGroups[0].value === adminConstant.ADMIN);
        if(!this.merchantExist){
          this.checkMerchantExist();
        }
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
      relativeTo: this.activeRoute,
    });
  }

  private initForm() {
    this.customersForm = this.fb.group({
      gender: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      birthDate: ["", Validators.required],
      country: ["", Validators.required],
      phoneNo: ["",  [Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(10), Validators.maxLength(15)]],
      isNotify: [true],
      passport: ["", Validators.required],
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

  paymentTypeUpdate(vcnPayment: boolean) {
    this.isVcnPayment = vcnPayment;
  }

  buyNow() {
    if (
      this.customersForm.valid &&
      (this.cardPaymentForm.valid || this.isVcnPayment)
    ) {
      const paymentInfoReq: HepstarPurchaseAndBookingReq = new HepstarPurchaseAndBookingReq();
      paymentInfoReq.paymentInfo = new PaymentInfo();
      if(!this.isVcnPayment){
        const cardPayment = this.cardPaymentForm.value;
        const cardInfo = new CardInfo();
        cardInfo.cardHolder = cardPayment.cardHolder;
        cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, "");
        const month_year: string[] = cardPayment.expiry.split(" / ");
        cardInfo.expireMonth = month_year[0];
        cardInfo.expireYear = month_year[1];
        cardInfo.cvv = cardPayment.cvv;

        console.log(cardInfo);
        paymentInfoReq.paymentInfo.cardInfo = cardInfo;
      }
      paymentInfoReq.paymentInfo.currency = appDefaultData.DEFAULT_CURRENCY;
      paymentInfoReq.paymentInfo.name = "Hepstar -Refund Protection";
      paymentInfoReq.paymentInfo.price = +this.selectedProduct.pricedProduct.productPriceBreakdown.priceDetails[0].totalAmount.amount || 0;
      const payer: Payer = new Payer();
      payer.country = this.country;
      payer.firstName = this.customersForm.get("firstName").value;
      payer.email = this.userForm.get("email").value;
      payer.mobile = this.customersForm.get("phoneNo").value;
      payer.lastName = this.customersForm.get("lastName").value;
      paymentInfoReq.paymentInfo.payer = payer;
      sessionStorage.setItem(hepstarConstant.USER_INFO, JSON.stringify(this.customersForm.value));
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

      // hepstar mapping data
      const requestParameters = new RequestParameters();
    const policyRequests = new PolicyRequests();
    policyRequests.purchaseRequest = [];
    const policyRequest = new PurchaseRequest();
    // insureds
    const insureds = new Customers();
    const insured = [];
    const insuredItem = new CustomerItem();
    insuredItem.id = '1';
    insuredItem.dateOfBirth = '1980-01-10';
    insuredItem.residency = this.searchHepstarReq.residenceCountry;
    insuredItem.gender = 'male';
    insuredItem.bookingValue = 50;
    insured.push(insuredItem);
    insureds.customers = insured;
    policyRequest.customers = insureds;
    policyRequest.bookingReference = "TestBooking123";
    policyRequest.productCode = "TestRP";
    policyRequests.purchaseRequest.push(policyRequest);

    // travelInfomation
    const travelInfomation = new Itinerary();
    travelInfomation.startDate = this.searchHepstarReq.startDate;
    travelInfomation.endDate = this.searchHepstarReq.endDate;
    travelInfomation.departureCountry = this.searchHepstarReq.residenceCountry;
    travelInfomation.totalBookingValue = 50;
    const coverCountries = new CorverCountries();
    const coverCountry = [];
    coverCountry.push(this.searchHepstarReq.residenceCountry);
    coverCountries.destinationCountries = coverCountry
    travelInfomation.destinationCountries = coverCountries;
    // flight infomation
    const flightInfomation = new FlightInformations();
    flightInfomation.flightInformations = [];
    const flightInfomationItem = new FlightInfomation()
    flightInfomationItem.segment = 1;
    flightInfomationItem.serviceProvider = 'CX';
    flightInfomationItem.serviceProviderNumber = '777';
    flightInfomationItem.startDate = this.searchHepstarReq.startDate;
    flightInfomationItem.endDate = this.searchHepstarReq.endDate;
    flightInfomationItem.departureCity = 'BKK';
    flightInfomationItem.destinationCity = 'ANK';
    flightInfomationItem.destinationCountries = coverCountries;

    flightInfomation.flightInformations.push(flightInfomationItem);
    travelInfomation.bookingDetails = flightInfomation;
    policyRequest.itinerary = travelInfomation;
    // contract info
    const contractInfo = new ContactInformation();
    const address = new HepstarAddress()
    address.street = '5 Church street';
    address.city = 'Ankara';
    address.country = this.searchHepstarReq.residenceCountry;
    address.postalCode = 1001;
    contractInfo.address = address;
    const hepstarPhones = new HepstarPhones();
    const hepstarPhone = new HepstarPhone();
    hepstarPhone.type = 'Mobile';
    hepstarPhone.number = this.customersForm.get("phoneNo").value;
    hepstarPhones.mobileNumber = hepstarPhone
    contractInfo.phones = hepstarPhones;
    contractInfo.email = this.userForm.get("email").value;
    policyRequest.contactInformation = contractInfo;
    requestParameters.policyRequests = policyRequests;
    paymentInfoReq.requestParameters = requestParameters;
    sessionStorage.setItem(
      hepstarConstant.HEPSTAR_PAYMENT_REQ,
      JSON.stringify(paymentInfoReq)
    );
    sessionStorage.setItem(hepstarConstant.CARD_PAYMENT, JSON.stringify(cardPaymentSave));
      if (!this.isVcnPayment) {
        this.store.dispatch(
          new HepstarActions.PaymentHepstarStart({
            data: paymentInfoReq
          })
        );
        this.route.navigate(["../booking-result"], {
          relativeTo: this.activeRoute,
        });
      } else {
        this.store.dispatch(
          new HepstarActions.GetVcnStart({
            data: {
              seletecProduct: this.selectedProduct,
              cardPayment: null,
              vcnPayment: this.isVcnPayment,
              merchantPayment: this.user.merchantPayment,
              currency: this.currency,
              amount: +this.selectedProduct.priceDetails.priceDetails[0].value,
              customerInfo: this.customersForm.value,
              HepstarBookingContact: bookingContact,
              accountBooking: accountBooking,
              bookingForUser: this.bookingForUser,
              userIsBooking: this.userIsBooking,
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
