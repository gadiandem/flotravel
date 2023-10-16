import { Injectable } from '@angular/core';

import { CardInfo } from 'src/app/model/flocash/card-info';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { Payer } from 'src/app/model/flocash/payer';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { ExtraDetailAvailabilityView } from 'src/app/model/thing-to-do/tour-detail/extra-detail-view';
import { CustomerBookingInfo } from 'src/app/model/common/customer-booking-info';
import { thingToDoConstant } from 'src/app/extras/thing-to-do.constant';
import { SearchQouteRequest } from 'src/app/model/insurance/search-quote.request';
import { UserInfo } from 'src/app/model/common/user-info';
import { Product } from 'src/app/model/insurance/quote/product';
import { SubscribePolicyRequest } from 'src/app/model/insurance/subscription-policy/subscription-policy.request';
import { SubscribePolicyData } from 'src/app/model/insurance/subscription-policy/subscribe-policy-data';
import { insuranceConstant } from 'src/app/insurance/insurance.constant';
import { HotelInfo } from 'src/app/model/hotel/hotel-list/hotel-info';
import { AvailablePropertyRes } from 'src/app/model/hotel/hotel-cart/available-property-res';
import { RateDetailList } from 'src/app/model/hotel/hotel-list/rate-detail-list';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';
import { HotelCustomerInfo } from 'src/app/model/hotel/hotel-cart/hotelCustomerInfo';
import { hotelConstant } from 'src/app/hotel/hotel.constant';
import { UserInfoModel } from 'src/app/model/common/user-info-model';
import { FlightPaymentData } from 'src/app/model/flight/payment/flight-payment-data';
import { FlightPaymentRequest } from 'src/app/model/flight/payment/flight-payment-request';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { flightConstant, flightProvider } from 'src/app/flight/flight.constant';
import { ExtrasBookingInfo } from 'src/app/model/thing-to-do/tour-payment/extra-booking-info';
import { TraceMeData } from 'src/app/model/traceme/finalise/traceme-data';
import { tracemeConstant } from 'src/app/traceme/traceme.constant';
import { TraceMeFinaliseAndBookingReq } from 'src/app/model/traceme/finalise/traceme-finalise-booking';
import { PackageShoppingRes } from 'src/app/model/packages/consumer/package-shopping-res';
import { SummaryPackageRes } from 'src/app/model/packages/consumer/summary-package-res';
import { PackagesBookingInfo } from 'src/app/model/packages/consumer/package-booking-info';
import { OrderPackageCreateReq } from 'src/app/model/packages/consumer/order-package-create-req';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { PaymentInfoReq } from 'src/app/model/gca/payment-info/payment-info-req';
import {gcaConstant} from '../../gca/gca.constant';
import { hepstarConstant } from 'src/app/hepstar/hepstar.constant';
import { CombineServicePaymentRequest } from 'src/app/model/combine/combine-service-request';
import { PassegerInfo } from 'src/app/model/flight/payment-info/passeger.info';
import { combineBookingConstant } from 'src/app/combine-booking/combine-booking.constant';
import { HotelRoomSimulator } from '../../model/hotel/simulator/hotel-room-simulator';
import { HotelInfoSimulator } from '../../model/hotel/simulator/hotel-info-simulator';
import { AwsImgUrl } from '../../model/hotel/hotel-list/aws-img-url';
import { HotelShoppingReq } from '../../model/dashboard/hotel/hotel-shopping-req';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { appConstant } from 'src/app/app.constant';
import { QuoteResponse } from 'src/app/model/insurance/quote/quote.response';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor() {}

  buildHotelSimulatorPaymentRequest(
    cardPayment: CardPaymentModel,
    vcnPayment: boolean,
    currency: string,
    totalPrice: number,
    selectedRoom: HotelRoomSimulator,
    customerRoomInfos: UserInfoModel[],
    hotelSelected: HotelInfoSimulator,
    hotelBookingContact: BookingContact,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string,
    countryCode: string,
    hotelShoppingReq: HotelShoppingReq
  ) {
    const paymentReq = new HotelPaymentRequest();
    // flocash data
    paymentReq.sessionId = '';
    paymentReq.propertyCode = hotelSelected.id;
    paymentReq.roomCode = selectedRoom.id;
    paymentReq.hotelShoppingReq = hotelShoppingReq;
    // paymentReq.price = +selectedRoom.totalPrice;
    // paymentReq.currency = currency;
    const paymentInfo = new PaymentInfo();
    paymentInfo.price = totalPrice;
    paymentInfo.currency = currency;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }

   // customerRoomInfos[0].country = countryCode;
    const payer = new Payer();
    payer.country = countryCode;
    payer.firstName = customerRoomInfos[0].firstName;
    payer.lastName = customerRoomInfos[0].lastName;
    payer.mobile = customerRoomInfos[0].mobile;
    payer.email = hotelBookingContact.email;
    paymentInfo.payer = payer;
    // paymentReq.cardInfo = cardInfo;
    paymentReq.paymentInfo = paymentInfo;
    const imageUrlHotel: AwsImgUrl = new AwsImgUrl();
    imageUrlHotel.baseUrl = hotelSelected.hotelImage;
    paymentReq.image = imageUrlHotel;
    paymentReq.accountBooking = accountBooking;
    paymentReq.bookingForUser = bookingForUser;
    paymentReq.userIsBooking = userIsBooking;

    paymentReq.customerBookingInfos = [];
    customerRoomInfos.forEach((customerInfo: UserInfoModel, i: number) => {
      const roomTravellerInfo = new HotelCustomerInfo();
      roomTravellerInfo.gender = customerInfo.gender;
      roomTravellerInfo.firstName = customerInfo.firstName;
      roomTravellerInfo.middleName = customerInfo.middleName;
      roomTravellerInfo.lastName = customerInfo.lastName;
      roomTravellerInfo.country = countryCode;
      roomTravellerInfo.mobile = customerInfo.mobile;
      roomTravellerInfo.isNotify = customerInfo.isNotify;
      roomTravellerInfo.passport = customerInfo.passport;
      roomTravellerInfo.roomCode = '';
      paymentReq.customerBookingInfos.push(roomTravellerInfo);
    });
    paymentReq.bookingContact = hotelBookingContact;
    paymentReq.demo = false;
    sessionStorage.setItem(
      hotelConstant.HOTEL_PAYMENT_REQ,
      JSON.stringify(paymentReq)
    );
    return paymentReq;
  }


  buildTourPaymentRequest(
    cardPayment: CardPaymentModel,
    vcnPayment: boolean,
    currency: string,
    amount: number,
    customerRoomInfos: UserInfoModel[],
    tourBookingContact: BookingContact,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string,
    tour: ExtrasPackage,
    schedule: ExtraDetailAvailabilityView,
    countryCode: string
  ): PaymentTourReq {
    const paymentReq = new PaymentTourReq();

    const paymentInfo = new PaymentInfo();
    paymentInfo.price = +amount;
    paymentInfo.currency = currency;
    paymentInfo.name = tour.name;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    // customerRoomInfos[0].country = countryCode
    const payer = new Payer();
    payer.country = countryCode;
    payer.firstName = customerRoomInfos[0].firstName;
    payer.lastName = customerRoomInfos[0].lastName;
    payer.mobile = customerRoomInfos[0].mobile;
    payer.email = tourBookingContact.email;
    paymentInfo.payer = payer;
    paymentReq.paymentInfo = paymentInfo;

    paymentReq.accountBooking = accountBooking;
    paymentReq.bookingForUser = bookingForUser;
    paymentReq.userIsBooking = userIsBooking;

    paymentReq.customerBookingInfos = [];
    customerRoomInfos.forEach((customerInfo: UserInfoModel, i: number) => {
      const roomTravellerInfo = new CustomerBookingInfo();
      roomTravellerInfo.gender = customerInfo.gender;
      roomTravellerInfo.firstName = customerInfo.firstName;
      roomTravellerInfo.middleName = customerInfo.middleName;
      roomTravellerInfo.lastName = customerInfo.lastName;
      roomTravellerInfo.country = customerInfo.country;
      roomTravellerInfo.mobile = customerInfo.mobile;
      roomTravellerInfo.isNotify = customerInfo.isNotify;
      roomTravellerInfo.passport = customerInfo.passport;
      paymentReq.customerBookingInfos.push(roomTravellerInfo);
    });
    paymentReq.bookingContact = tourBookingContact;
    // paymentReq.tourId = tour.id;
    // paymentReq.schedule = schedule;
    const extrasBookingInfo = new ExtrasBookingInfo();

    extrasBookingInfo.extrasDetailAvailabilityId = schedule.extraDetailAvailabilityId;
    extrasBookingInfo.extrasPackageId = schedule.extraPackageId;
    extrasBookingInfo.extrasDetailId = schedule.id;
    extrasBookingInfo.extrasPackageAvailabilityId = schedule.extraPackgeAvailabilityId;
    extrasBookingInfo.adultCount = schedule.adultCount;
    extrasBookingInfo.childCount = schedule.childCount;
    paymentReq.extrasBookingInfo = extrasBookingInfo;
    sessionStorage.setItem(
      thingToDoConstant.TOUR_PAYMENT_REQ,
      JSON.stringify(paymentReq)
    );
    return paymentReq;
  }

  buildPackagesPaymentRequest(
    cardPayment: CardPaymentModel,
    vcnPayment: boolean,
    merchantPayment: MerchantPayment,
    currency: string,
    customerRoomInfos: UserInfoModel[],
    tourBookingContact: BookingContact,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string,
    selectedPackage: PackageShoppingRes,
    summary: SummaryPackageRes,
    countryName: string,
    countryCode: string,
    totalPrice: number,
    subscribePolicyData: SubscribePolicyData
  ): OrderPackageCreateReq {
    const paymentReq = new OrderPackageCreateReq();

    paymentReq.selectedPackage = selectedPackage;
    const paymentInfo = new PaymentInfo();
    paymentInfo.price = +totalPrice;
    paymentInfo.currency = currency;
    paymentInfo.name = selectedPackage.name;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      // paymentInfo.merchantAccount = merchantPayment.merchantAccount;
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    // customerRoomInfos[0].country = countryCode;
    const payer = new Payer();
    payer.country = countryCode;
    payer.firstName = customerRoomInfos[0].firstName;
    payer.lastName = customerRoomInfos[0].lastName;
    payer.mobile = customerRoomInfos[0].mobile;
    payer.email = tourBookingContact.email;
    paymentInfo.payer = payer;
    paymentReq.paymentInfo = paymentInfo;

    paymentReq.accountBooking = accountBooking;
    paymentReq.bookingForUser = bookingForUser;
    paymentReq.userIsBooking = userIsBooking;
    paymentReq.subscribePolicyData = JSON.parse(sessionStorage.getItem(insuranceConstant.SUBSCRIBE_POLICY_DATA))
    paymentReq.customerBookingInfos = [];
    customerRoomInfos.forEach((customerInfo: UserInfoModel, i: number) => {
      const roomTravellerInfo = new CustomerBookingInfo();
      roomTravellerInfo.gender = customerInfo.gender;
      roomTravellerInfo.firstName = customerInfo.firstName;
      roomTravellerInfo.middleName = customerInfo.middleName;
      roomTravellerInfo.lastName = customerInfo.lastName;
      roomTravellerInfo.country = countryCode;
      roomTravellerInfo.mobile = customerInfo.mobile;
      roomTravellerInfo.isNotify = customerInfo.isNotify;
      roomTravellerInfo.passport = customerInfo.passport;
      roomTravellerInfo.countryName = countryName;
      paymentReq.customerBookingInfos.push(roomTravellerInfo);
    });
    paymentReq.bookingContact = tourBookingContact;
    // paymentReq.tourId = tour.id;
    // paymentReq.schedule = schedule;
    const packagesBookingInfo = new PackagesBookingInfo();

    packagesBookingInfo.summaryId = summary.id || '';
    paymentReq.packagesBookingInfo = packagesBookingInfo;
    sessionStorage.setItem(
      thingToDoConstant.TOUR_PAYMENT_REQ,
      JSON.stringify(paymentReq)
    );
    return paymentReq;
  }

  buildSubscriptionRequest(
    searchQuoteForm: SearchQouteRequest,
    vcnPayment: boolean,
    cardPayment: CardPaymentModel,
    customerInfos: UserInfo[],
    selectedQuoteProduct: Product,
    bookingContact: BookingContact,
    currency: string,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string
  ): SubscribePolicyRequest {
    const subscribePlolicyRequest = new SubscribePolicyRequest();
    const quote  = JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_RESPONSE));
    const subscriptionData = new SubscribePolicyData();
    subscriptionData.currency = currency;
    subscriptionData.quoteCode = selectedQuoteProduct.quoteCode;
    subscriptionData.priceAfterDiscountIncTax =
      selectedQuoteProduct.prices.priceAfterDiscountInclTax;
    subscriptionData.id = quote.id ;
    subscriptionData.productName = selectedQuoteProduct.name;
    subscriptionData.sessionId = quote.sessionId || '';
    subscriptionData.quoteRequest = JSON.parse(sessionStorage.getItem(insuranceConstant.QUOTE_SEARCH_FORM));
    subscriptionData.guarantees = selectedQuoteProduct.guarantees;
    subscribePlolicyRequest.subscribePolicyData = subscriptionData;
    subscribePlolicyRequest.sessionId =  sessionStorage.getItem(insuranceConstant.SESSION_ID) || '';
    // const payerInfo = new PayerInfo();
    // payerInfo.birthDate = '2000-06-10';
    // payerInfo.country = userInfo.country;
    // payerInfo.firstName = userInfo.firstName;
    // payerInfo.lastName = userInfo.lastName;
    // payerInfo.middleName = userInfo.middleName;
    // payerInfo.phoneNo = userInfo.mobile;
    // payerInfo.email = userInfo.email;
    // subscribePlolicyRequest.customerInfo = payerInfo;
    const paymentInfo = new PaymentInfo();
    paymentInfo.price = selectedQuoteProduct.prices.priceAfterDiscountInclTax;
    paymentInfo.currency = currency;
    paymentInfo.name = selectedQuoteProduct.name;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    subscribePlolicyRequest.paymentInfo = paymentInfo;

    subscribePlolicyRequest.accountBooking = accountBooking;
    subscribePlolicyRequest.bookingForUser = bookingForUser;
    subscribePlolicyRequest.userIsBooking = userIsBooking;

    const payer = new Payer();
    payer.country = searchQuoteForm.residenceCountry;
    payer.firstName = customerInfos[0].firstName;
    payer.lastName = customerInfos[0].lastName;
    payer.mobile = customerInfos[0].phoneNo;
    payer.email = bookingContact.email;
    paymentInfo.payer = payer;
    subscribePlolicyRequest.quoteRequest = searchQuoteForm;
    subscribePlolicyRequest.paymentInfo = paymentInfo;
    subscribePlolicyRequest.bookingContact = bookingContact;
    subscribePlolicyRequest.customerInfos = customerInfos;

    sessionStorage.setItem(
      insuranceConstant.INSURANCE_PAYMENT_REQ,
      JSON.stringify(subscribePlolicyRequest)
    );
    return subscribePlolicyRequest;
  }

  buildTracemeRequest(
    tracemeData: TraceMeData,
    vcnPayment: boolean,
    cardPayment: CardPaymentModel,
    customerInfo: UserInfo,
    bookingContact: BookingContact,
    currency: string,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string,
    countryCode: string
  ): TraceMeFinaliseAndBookingReq {
    const finaliseBookingRequest = new TraceMeFinaliseAndBookingReq();

    finaliseBookingRequest.traceMeData = tracemeData;

    const paymentInfo = new PaymentInfo();
    paymentInfo.price = +tracemeData.quote.premium;
    paymentInfo.currency = currency;
    paymentInfo.name = tracemeData.quote.name;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    finaliseBookingRequest.paymentInfo = paymentInfo;

    finaliseBookingRequest.accountBooking = accountBooking;
    finaliseBookingRequest.bookingForUser = bookingForUser;
    finaliseBookingRequest.userIsBooking = userIsBooking;

    const payer = new Payer();
    // payer.country = customerInfo.country;
    payer.country = countryCode;
    payer.firstName = customerInfo.firstName;
    payer.lastName = customerInfo.lastName;
    payer.mobile = customerInfo.phoneNo;
    payer.email = bookingContact.email;
    paymentInfo.payer = payer;
    const customerBookingInfo = new UserInfo();
    customerBookingInfo.gender = customerInfo.gender;
    customerBookingInfo.firstName = customerInfo.firstName;
    customerBookingInfo.lastName = customerInfo.lastName;
    customerBookingInfo.email = customerInfo.email;
    customerBookingInfo.phoneNo = customerInfo.phoneNo;
    customerBookingInfo.middleName = customerInfo.middleName;
    customerBookingInfo.passport = customerInfo.passport;
    customerBookingInfo.isNofity = customerInfo.isNofity;
    finaliseBookingRequest.customerBookingInfo = customerBookingInfo;
    finaliseBookingRequest.paymentInfo = paymentInfo;
    finaliseBookingRequest.bookingContact = bookingContact;

    sessionStorage.setItem(
      tracemeConstant.TRACEME_PAYMENT_REQ,
      JSON.stringify(finaliseBookingRequest)
    );
    return finaliseBookingRequest;
  }

  buildGcaRequest(
    bookingId: string,
    vcnPayment: boolean,
    cardPayment: CardPaymentModel,
    customerInfo: UserInfo,
    bookingContact: BookingContact,
    currency: string,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string
  ): PaymentInfoReq {
    const gcaCheckoutReq = new PaymentInfoReq();

    gcaCheckoutReq.bookingId = bookingId;

    const paymentInfo = new PaymentInfo();
    paymentInfo.currency = currency;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    gcaCheckoutReq.paymentInfo = paymentInfo;

    gcaCheckoutReq.accountBooking = accountBooking;
    gcaCheckoutReq.bookingForUser = bookingForUser;
    gcaCheckoutReq.userIsBooking = userIsBooking;

    const payer = new Payer();
    payer.country = customerInfo.country;
    payer.firstName = customerInfo.firstName;
    payer.lastName = customerInfo.lastName;
    payer.mobile = customerInfo.phoneNo;
    payer.email = bookingContact.email;
    paymentInfo.payer = payer;
    const customerBookingInfo = new UserInfo();
    customerBookingInfo.gender = customerInfo.gender;
    customerBookingInfo.firstName = customerInfo.firstName;
    customerBookingInfo.lastName = customerInfo.lastName;
    customerBookingInfo.email = customerInfo.email;
    customerBookingInfo.phoneNo = customerInfo.phoneNo;
    customerBookingInfo.middleName = customerInfo.middleName;
    customerBookingInfo.passport = customerInfo.passport;
    customerBookingInfo.isNofity = customerInfo.isNofity;
    gcaCheckoutReq.customerBookingInfo = customerBookingInfo;
    gcaCheckoutReq.paymentInfo = paymentInfo;
    gcaCheckoutReq.bookingContact = bookingContact;

    sessionStorage.setItem(
      gcaConstant.GCA_PAYMENT_REQ,
      JSON.stringify(gcaCheckoutReq)
    );
    return gcaCheckoutReq;
  }

  buildHepstarRequest(
    hepstarProduct: any,
    vcnPayment: boolean,
    cardPayment: CardPaymentModel,
    customerInfo: UserInfo,
    bookingContact: BookingContact,
    currency: string,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string
  ): TraceMeFinaliseAndBookingReq {
    const finaliseBookingRequest = new TraceMeFinaliseAndBookingReq();

    finaliseBookingRequest.traceMeData = hepstarProduct;

    const paymentInfo = new PaymentInfo();
    paymentInfo.price = +hepstarProduct.priceDetails.priceDetails[0].value;
    paymentInfo.currency = currency;
    paymentInfo.name = hepstarProduct.pricedProduct.productInformation.name;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    finaliseBookingRequest.paymentInfo = paymentInfo;

    finaliseBookingRequest.accountBooking = accountBooking;
    finaliseBookingRequest.bookingForUser = bookingForUser;
    finaliseBookingRequest.userIsBooking = userIsBooking;

    const payer = new Payer();
    payer.country = customerInfo.country;
    payer.firstName = customerInfo.firstName;
    payer.lastName = customerInfo.lastName;
    payer.mobile = customerInfo.phoneNo;
    payer.email = bookingContact.email;
    paymentInfo.payer = payer;
    const customerBookingInfo = new UserInfo();
    customerBookingInfo.gender = customerInfo.gender;
    customerBookingInfo.firstName = customerInfo.firstName;
    customerBookingInfo.lastName = customerInfo.lastName;
    customerBookingInfo.email = customerInfo.email;
    customerBookingInfo.phoneNo = customerInfo.phoneNo;
    customerBookingInfo.middleName = customerInfo.middleName;
    customerBookingInfo.passport = customerInfo.passport;
    customerBookingInfo.isNofity = customerInfo.isNofity;
    finaliseBookingRequest.customerBookingInfo = customerBookingInfo;
    finaliseBookingRequest.paymentInfo = paymentInfo;
    finaliseBookingRequest.bookingContact = bookingContact;

    sessionStorage.setItem(
      hepstarConstant.HEPSTAR_PAYMENT_REQ,
      JSON.stringify(finaliseBookingRequest)
    );
    return finaliseBookingRequest;
  }

  buildHotelPaymentRequest(
    cardPayment: CardPaymentModel,
    vcnPayment: boolean,
    currency: string,
    selectedRoom: RateDetailList,
    customerRoomInfos: UserInfoModel[],
    sessionId: string,
    availableProperty: AvailablePropertyRes,
    hotelSelected: HotelInfo,
    hotelBookingContact: BookingContact,
    accountBooking: string,
    bookingForUser: boolean,
    userIsBooking: string,
    countryCode: string,
    totalPrice: number,
    subscribePolicyData:SubscribePolicyData
  ) {
    const paymentReq = new HotelPaymentRequest();
    // flocash data
    paymentReq.sessionId = sessionId;
    paymentReq.propertyCode = availableProperty.confirmPropertyCode;
    paymentReq.hotelCode = +hotelSelected.code;

    // paymentReq.price = +selectedRoom.totalPrice;
    // paymentReq.currency = currency;
    const paymentInfo = new PaymentInfo();
    paymentInfo.price = totalPrice;
   // paymentInfo.price = +selectedRoom.totalPrice;
    paymentInfo.currency = currency;
    if (!vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = cardPayment.cardName;
      cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = vcnPayment;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }
    // customerRoomInfos[0].country = countryCode;
    const payer = new Payer();
    // payer.country = customerRoomInfos[0].country;
    payer.country = countryCode;
    payer.firstName = customerRoomInfos[0].firstName;
    payer.lastName = customerRoomInfos[0].lastName;
    payer.mobile = customerRoomInfos[0].mobile;
    payer.email = hotelBookingContact.email;
    paymentInfo.payer = payer;
    // paymentReq.cardInfo = cardInfo;
    paymentReq.paymentInfo = paymentInfo;

    paymentReq.image = hotelSelected.image;
    paymentReq.accountBooking = accountBooking;
    paymentReq.bookingForUser = bookingForUser;
    paymentReq.userIsBooking = userIsBooking;
    paymentReq.subscribePolicyData = JSON.parse(sessionStorage.getItem(insuranceConstant.SUBSCRIBE_POLICY_DATA));
    paymentReq.customerBookingInfos = [];
    customerRoomInfos.forEach((customerInfo: UserInfoModel, i: number) => {
      const roomTravellerInfo = new HotelCustomerInfo();
      roomTravellerInfo.gender = customerInfo.gender;
      roomTravellerInfo.firstName = customerInfo.firstName;
      roomTravellerInfo.middleName = customerInfo.middleName;
      roomTravellerInfo.lastName = customerInfo.lastName;
      roomTravellerInfo.country = countryCode;
      roomTravellerInfo.mobile = customerInfo.mobile;
      roomTravellerInfo.isNotify = customerInfo.isNotify;
      roomTravellerInfo.passport = customerInfo.passport;
      roomTravellerInfo.roomCode = selectedRoom.rooms.rooms[i].roomCode;
      paymentReq.customerBookingInfos.push(roomTravellerInfo);
    });
    paymentReq.bookingContact = hotelBookingContact;
    paymentReq.demo = false;
    sessionStorage.setItem(
      hotelConstant.HOTEL_PAYMENT_REQ,
      JSON.stringify(paymentReq)
    );
    return paymentReq;
  }

  buildFlightPaymentRequest(data: FlightPaymentData): FlightPaymentRequest {
    const orderData = new FlightPaymentRequest();
    orderData.bookingId = +data.bookingId;
    orderData.executionId = data.executionId;
    orderData.offerPriceId = data.offerPriceId;
    orderData.offerItems = data.offerItems;
    orderData.bspBooking = data.bspBooking;
    orderData.bookingHold = data.bookingHold;
    orderData.flightType = data.flightType;
    const paymentInfo = new PaymentInfo();
    if (data.bookingId) {
      paymentInfo.name = 'Booking Aero';
    } else {
     const etProvider =  +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER) === flightProvider.ET;
     if (etProvider) {
      paymentInfo.name = 'ET Booking';
     } else {
       paymentInfo.name = 'Booking Hahn air';
     }
    }
    if(data.orderChange){
      orderData.orderChange = data.orderChange;
    }
    paymentInfo.email = data.bookingContact.email;
    paymentInfo.currency = data.currency;
    // paymentInfo.currency = 'USD';
    paymentInfo.price = data.totalPrice;
    if (!data.vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = data.cardPayment.cardName;
      cardInfo.cardNumber = data.cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = data.cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = data.cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = true;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }

    const payer = new Payer();
    payer.email = data.bookingContact.email;
    payer.firstName = data.passegersInfo[0].firstName;
    payer.lastName = data.passegersInfo[0].lastName;
    payer.mobile = data.passegersInfo[0].phoneNo;
    payer.country = data.passegersInfo[0].country;

    paymentInfo.payer = payer;
    orderData.paymentInfo = paymentInfo;
    orderData.customerInfos = data.passegersInfo;
    const travellers = new Travellers();
    if(data.searchFlightForm !=null){
    travellers.adt = data.searchFlightForm.adults;
    travellers.chd = data.searchFlightForm.children;
    travellers.inf = data.searchFlightForm.infants;
   }
    orderData.travellers = travellers;
    orderData.bookingContact = data.bookingContact;
    orderData.accountBooking = data.accountBooking;
    orderData.bookingForUser = data.bookingForUser;
    orderData.userIsBooking = data.userIsBooking;
    orderData.simulator = false;
    orderData.addonRefundProtect = data.addonRefundProtect;
    orderData.refundProtectPrice = data.refundProtectPrice;
    orderData.requestParameters = data.requestParameters;
    orderData.helpstarSession = data.helpstarSession;
    orderData.addonSmartDelay = data.addonSmartDelay;
    orderData.smartDelayPrice = data.smartDelayPrice;
    orderData.smartDelayRequestParameters = data.smartDelayRequestParameters;

    orderData.traceMeData = data.traceMeData;
    orderData.subscribePolicyData = data.subscribePolicyData;
    orderData.tokenInsurance = data.tokenInsurance;

    orderData.addonGca = data.addonGca;
    orderData.gcaBookingId = data.gcaBookingId;

     // extras info flight
     orderData.departureFlight = data.departureFlight;
     if (data.returnFlight) {
       orderData.returnFlight = data.returnFlight;
     }
     if (data.nextFlights) {
       orderData.nextFlights = data.nextFlights;
     }

    sessionStorage.setItem(
      flightConstant.FLIGHT_ORDER_CREATE_REQ,
      JSON.stringify(orderData)
    );
    return orderData;
  }

  buildCombineServicePaymentRequest(data: FlightPaymentData,
     selectedRoom: RateDetailList,
     sessionId: string,
     availableRoomProperty: AvailablePropertyRes,
     hotelSelected: HotelInfo): CombineServicePaymentRequest {
    const orderData = new CombineServicePaymentRequest();
    orderData.bookingId = +data.bookingId;
    orderData.executionId = data.executionId;
    orderData.offerPriceId = data.offerPriceId;
    orderData.offerItems = data.offerItems;

    const paymentInfo = new PaymentInfo();
    if (data.bookingId) {
      paymentInfo.name = 'Booking Aero';
    } else {
      paymentInfo.name = 'Booking Hahn air';
    }
    paymentInfo.email = data.bookingContact.email;
    paymentInfo.currency = data.currency;
    // paymentInfo.currency = 'USD';
    paymentInfo.price = data.totalPrice;
    if (!data.vcnPayment) {
      const cardInfo = new CardInfo();
      cardInfo.cardHolder = data.cardPayment.cardName;
      cardInfo.cardNumber = data.cardPayment.cardNo.replace(/ /g, '');
      const month_year: string[] = data.cardPayment.expiry.split(' / ');
      cardInfo.expireMonth = month_year[0];
      cardInfo.expireYear = month_year[1];
      cardInfo.cvv = data.cardPayment.cvv;
      paymentInfo.cardInfo = cardInfo;
    } else {
      paymentInfo.vcnPayment = true;
      paymentInfo.traceNumber = '';
      paymentInfo.otpValue = '';
    }

    const payer = new Payer();
    payer.email = data.bookingContact.email;
    payer.firstName = data.passegersInfo[0].firstName;
    payer.lastName = data.passegersInfo[0].lastName;
    payer.mobile = data.passegersInfo[0].phoneNo;
    payer.country = data.passegersInfo[0].country;

    paymentInfo.payer = payer;
    orderData.paymentInfo = paymentInfo;
    orderData.customerInfos = data.passegersInfo;
    const travellers = new Travellers();
    travellers.adt = data.searchFlightForm.adults;
    travellers.chd = data.searchFlightForm.children;
    travellers.inf = data.searchFlightForm.infants;
    orderData.travellers = travellers;
    orderData.bookingContact = data.bookingContact;
    orderData.accountBooking = data.accountBooking;
    orderData.bookingForUser = data.bookingForUser;
    orderData.userIsBooking = data.userIsBooking;
    orderData.simulator = false;
    // hotel info
    orderData.customerBookingInfos = [];
    data.passegersInfo.forEach((customerInfo: PassegerInfo, i: number) => {
      const roomTravellerInfo = new HotelCustomerInfo();
      roomTravellerInfo.gender = customerInfo.gender;
      roomTravellerInfo.firstName = customerInfo.firstName;
      roomTravellerInfo.middleName = customerInfo.middleName;
      roomTravellerInfo.lastName = customerInfo.lastName;
      roomTravellerInfo.country = customerInfo.country;
      roomTravellerInfo.mobile = customerInfo.phoneNo;
      roomTravellerInfo.isNotify = true;
      roomTravellerInfo.passport = customerInfo.passPort;
      roomTravellerInfo.roomCode = selectedRoom.rooms.rooms[i].roomCode;
      orderData.customerBookingInfos.push(roomTravellerInfo);
    });
    // sessionId: string;
    // propertyCode: string;
    // hotelCode: number;
    // image: AwsImgUrl;
    orderData.sessionId = sessionId;
    orderData.propertyCode = availableRoomProperty.confirmPropertyCode;
    orderData.hotelCode = +hotelSelected.code;
    orderData.image = hotelSelected.image;
    sessionStorage.setItem( combineBookingConstant.FLIGHT_ORDER_CREATE_REQ, JSON.stringify(orderData));
    return orderData;
  }
}
