import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { AirportModel } from '../../model/gca/shopping/request/airport-res';
import { GcaHistoryListReq } from 'src/app/model/gca/history/gca-history-list-req';
import { GcaHistoryListRes } from 'src/app/model/gca/history/gca-history-list-res';
import { FlocashPaymentGca } from 'src/app/model/gca/history/gca-history-item';
import { HepstarSearchFormData } from 'src/app/model/hepstar/search-from-data';
import { SearchHepstarProductReq } from 'src/app/model/hepstar/search-hepstar.req';
import { Customers } from 'src/app/model/hepstar/insureds';
import { Itinerary } from 'src/app/model/hepstar/travel-infomation';
import { CustomerItem } from 'src/app/model/hepstar/insured-item';
import { TravelInfo } from 'src/app/model/hepstar/travel-info';
import { CorverCountries } from 'src/app/model/hepstar/cover-countries';
import { FlightInformations } from 'src/app/model/hepstar/flight-infomations';
import { FlightInfomation } from 'src/app/model/hepstar/flight-infomation';
import { SearchHepstarRes } from 'src/app/model/hepstar/search-hepstar-res';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { MerchantPayment } from 'src/app/model/auth/user/merchant-payment';
import { UserInfo } from 'src/app/model/common/user-info';
import { BookingContact } from 'src/app/model/common/booking-contact';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { VcnRequest } from 'src/app/model/flocash/response/vcn-request';
import { hepstarConstant } from 'src/app/hepstar/hepstar.constant';
import { HepstarPurchaseAndBookingReq } from 'src/app/model/hepstar/hepstar-product-purchase-booking-req';
import { RequestParameters } from 'src/app/model/hepstar/request-parameters';
import { PolicyRequests } from 'src/app/model/hepstar/policy-requests';
import { PurchaseRequest } from 'src/app/model/hepstar/policy-request';
import { ContactInformation } from 'src/app/model/hepstar/contract-infomation';
import { HepstarAddress } from 'src/app/model/hepstar/hepstar-address';
import { HepstarPhones } from 'src/app/model/hepstar/hepstar-phones';
import { HepstarPhone } from 'src/app/model/hepstar/hepstar-phone';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { flightConstant, flightProvider } from 'src/app/flight/flight.constant';
import { SelectedFlight } from 'src/app/model/flight/selected-flight';
import { DatePipe } from '@angular/common';
import {HepstarCancellation} from 'src/app/model/hepstar/heptar-cancellation-req';

@Injectable({
  providedIn: 'root',
})
export class HepstarService {
  searchAirportUrl = environment.baseUrl + 'ndc/airports?keywords=';
  hepstarProductPriceListUrl = environment.baseUrl + 'hepstar/shopping';
  hepstarProductPurchaseUrl = environment.baseUrl + 'hepstar/shopping';
  hepstarCancellationUrl = environment.baseUrl + 'hepstar/cancellation';
  hepstarHistoryListUrl = environment.baseUrl + 'hepstar/historyList';
  hepstarHistoryListByDateUrl = environment.baseUrl + 'hepstar/historyList/filterByDate';
  hepstarHistoryDetailUrl = environment.baseUrl + 'hepstar/historyDetail';
  gcaDeleteUrl = environment.baseUrl + 'gca/delete';
  requestVCNUrl = environment.baseUrl + 'flocash/requestVCN';


  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  searchAirport(searchTerm: string) {
    if (searchTerm.length < 3) {
      return of([]);
    }
    return this.http.get<AirportModel[]>(this.searchAirportUrl + searchTerm);
  }

  getHepstarHistoryList(req: GcaHistoryListReq) {
    return this.http.post<any>(this.hepstarHistoryListUrl, req);
  }

  getHepstarHistoryListByDate(req: GcaHistoryListReq) {
    return this.http.post<any>(
      this.hepstarHistoryListByDateUrl, req
    );
  }

  getHepstarHistoryDetail(paymentId: string, req: GcaHistoryListReq) {
    return this.http.post<any>(
      this.hepstarHistoryDetailUrl + '/' + paymentId,
      req
    );
  }

  deleteGcaRecord(id: string) {
    return this.http.delete<any>(`${this.hepstarHistoryListUrl}/${id}`);
  }

  cancelHepstarBooking(id: string, resean: string, purchaseNumber: string ) {

    const hepstarCancellation = new HepstarCancellation();
    hepstarCancellation.id = purchaseNumber;
    hepstarCancellation.statement = resean;
    return this.http.post<any>(`${this.hepstarCancellationUrl}/${id}`, hepstarCancellation);
  }

  requestVcn(payload: {
    data: {
      selectedProduct: any;
      cardPayment: CardPaymentModel;
      vcnPayment: boolean;
      merchantPayment: MerchantPayment;
      currency: string;
      amount: number;
      customerInfo: UserInfo;
      hepstarBookingContact: BookingContact;
      accountBooking: string;
      bookingForUser: boolean;
      userIsBooking: string;
    };
  }) {
    const clientData = payload.data;
    sessionStorage.setItem(
      hepstarConstant.HEPSTAR_PAYMENT_REQ,
      JSON.stringify(clientData)
    );
    const vcnRequest = new VcnRequest();
    vcnRequest.accountId = clientData.accountBooking;
    vcnRequest.currency = clientData.currency;
    vcnRequest.price = +clientData.amount;
    const headers = new HttpHeaders().set(
      'environment',
      environment.paymentEnvironment
    );
    return this.http.post<FlocashVCNRes>(this.requestVCNUrl, vcnRequest, {
      headers,
    });
  }

  buildHepstarShopping(req: HepstarSearchFormData): SearchHepstarProductReq {
    const departureFlight: SelectedFlight = JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
    const returnFlight: SelectedFlight = JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
    const provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);
    const request = new SearchHepstarProductReq();
    request.executionId = req.executionId;
    request.provider = req.provider;
    // insureds
    const customers = new Customers();
    const insured = [];
    for (let i = 0; i < req.adults + req.children; i++) {
      const insuredItem = new CustomerItem();
      if (i < req.adults) {
        insuredItem.id = (i + 1) + '';
        insuredItem.dateOfBirth = '1980-01-10';
        // insuredItem.firstName = 'Flotravel adults';
        // insuredItem.lastName = (i + 1) + '';
        insuredItem.residency = req.residenceCountry;
        insuredItem.gender = 'male';
        insuredItem.bookingValue = +(req.totalTripPrice / (req.adults + req.children)).toFixed(2);
      } else {
        insuredItem.id = (i + 1) + '';
        insuredItem.dateOfBirth = '2018-01-10';
        // insuredItem.firstName = 'Flotravel child';
        // insuredItem.lastName = (i + 1) + '';
        insuredItem.residency = req.residenceCountry;
        insuredItem.gender = 'male';
        insuredItem.bookingValue = +(req.totalTripPrice / (req.adults + req.children)).toFixed(2);
      }
      insured.push(insuredItem);
    }
    customers.customers = insured;
    request.customers = customers;
    // travelInfomation
    const travelInfomation = new Itinerary();
    travelInfomation.startDate = req.startDate;
    if (req.endDate ) {
      travelInfomation.endDate = req.endDate;
    }
    travelInfomation.departureCountry = req.residenceCountry;
    travelInfomation.totalBookingValue = +req.totalTripPrice.toFixed(2);
    const coverCountries = new CorverCountries();
    const coverCountry = [];
    coverCountry.push(req.countryOfTravel);
    coverCountries.destinationCountries = coverCountry;
    travelInfomation.destinationCountries = coverCountries;
    // flight infomation
    const flightInfomation = new FlightInformations();
    flightInfomation.flightInformations = [];
    let flightSegment = 0;
    // flight info
    if (departureFlight) {
      const flightSegs = departureFlight.flight.flightSegments;
      flightSegs.forEach((seg, index) => {
       // console.log(seg);
        const flightInfomationItem = new FlightInfomation();
        flightInfomationItem.segment = ++flightSegment;
        const airline = seg.airline.split('-')[0];
        flightInfomationItem.serviceProvider = airline || 'CX';
        if (provider !== flightProvider.AERO_CRS) {
             flightInfomationItem.serviceProviderNumber = airline + (seg.flightNumber || '777');
        } else {
          flightInfomationItem.serviceProviderNumber = seg.flightNumber || '777';
        }
        flightInfomationItem.startDate = this.datePipe.transform(seg.depDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.endDate = this.datePipe.transform(seg.arrDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.departureCity = seg.depAirportCode;
        flightInfomationItem.destinationCity = seg.arrAirportCode;
        const destinationCountry = new CorverCountries();
        const desCountry = [];
        desCountry.push(seg.arrCountry);
        destinationCountry.destinationCountries = desCountry;
        flightInfomationItem.destinationCountries = destinationCountry;

        flightInfomation.flightInformations.push(flightInfomationItem);
      });
    }
    if (returnFlight) {
      const flightSegs = returnFlight.flight.flightSegments;
      flightSegs.forEach((seg, index) => {
        const flightInfomationItem = new FlightInfomation();
        flightInfomationItem.segment = ++flightSegment;
        const airline = seg.airline.split('-')[0];
        flightInfomationItem.serviceProvider = airline || 'CX';
        if (provider !== flightProvider.AERO_CRS) {
              flightInfomationItem.serviceProviderNumber = airline + (seg.flightNumber || '777');
        } else {
              flightInfomationItem.serviceProviderNumber = seg.flightNumber || '777';
       }
        flightInfomationItem.startDate = this.datePipe.transform(seg.depDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.endDate = this.datePipe.transform(seg.arrDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.departureCity = seg.depAirportCode;
        flightInfomationItem.destinationCity = seg.arrAirportCode;
        const destinationCountry = new CorverCountries();
        const desCountry = [];
        desCountry.push(seg.arrCountry);
        destinationCountry.destinationCountries = desCountry;
        flightInfomationItem.destinationCountries = destinationCountry;

        flightInfomation.flightInformations.push(flightInfomationItem);
      });
    }
    if (!departureFlight && !returnFlight) {
      // demo data
      const flightInfomationItem = new FlightInfomation();
      flightInfomationItem.segment = flightSegment + 1;
      flightInfomationItem.serviceProvider = 'CX';
      flightInfomationItem.serviceProviderNumber = '777';
      flightInfomationItem.startDate = req.startDate;
      flightInfomationItem.endDate = req.endDate || req.startDate;
      flightInfomationItem.departureCity = 'BKK';
      flightInfomationItem.destinationCity = 'ANK';
      flightInfomationItem.destinationCountries = coverCountries;

      flightInfomation.flightInformations.push(flightInfomationItem);
    }
    travelInfomation.bookingDetails = flightInfomation;
    request.itinerary = travelInfomation;
    return request;
  }

  buildRequestParameters(searchFlightForm: SearchFlightForm,
    flightPricePrice: number,
    productCode: string,
    passangerNumber,
    passangerInfos: any[]): RequestParameters {
    const requestParameters = new RequestParameters();
    const purchaseRequests = new PolicyRequests();
    purchaseRequests.purchaseRequest = [];
    const purchaseRequest = new PurchaseRequest();
    const customers = new Customers();
    const customer = [];
    passangerInfos.forEach((passangerInfo, index) => {
      const customerItem = new CustomerItem();
      customerItem.id = index + 1 + '';
      customerItem.dateOfBirth = this.datePipe.transform(passangerInfo.birthDate, 'yyyy-MM-dd');
      customerItem.firstName = passangerInfo.firstName || 'Hepstar';
      customerItem.lastName = passangerInfo.lastName || 'Test';
      customerItem.identityNumber = +passangerInfo.passPort ||  123456;
      customerItem.passportNumber = +passangerInfo.passPort || 789456123;
      customerItem.residency = searchFlightForm.flyFrom.country.code;
      customerItem.gender = 'male';
      customerItem.bookingValue = flightPricePrice / passangerNumber;
      customer.push(customerItem);
    });
    customers.customers = customer;
    purchaseRequest.customers = customers;
    purchaseRequest.bookingReference = 'TestBooking123';
    purchaseRequest.productCode = productCode;
    // travelInfomation
    const departureFlight: SelectedFlight = JSON.parse(sessionStorage.getItem(flightConstant.DEPARTURE_FLIGHT));
    const returnFlight: SelectedFlight = JSON.parse(sessionStorage.getItem(flightConstant.RETURN_FLIGHT));
    const searchHelpstar: HepstarSearchFormData = JSON.parse(sessionStorage.getItem(hepstarConstant.SEARCH_HEPSTAR_PRODUCT_FORM));
    const provider = +sessionStorage.getItem(flightConstant.SELECTED_PROVIDER);

    const travelInfomation = new Itinerary();
    travelInfomation.startDate = searchFlightForm.departuring;
    travelInfomation.endDate = searchFlightForm.returning || searchFlightForm.departuring;
    travelInfomation.departureCountry = searchFlightForm.flyFrom.country.code;
    travelInfomation.totalBookingValue = flightPricePrice;
    const coverCountries = new CorverCountries();
    const coverCountry = [];
    coverCountry.push(searchFlightForm.destination.country.code);
    coverCountries.destinationCountries = coverCountry;
    travelInfomation.destinationCountries = coverCountries;
    // flight infomation
    const flightInfomation = new FlightInformations();
    flightInfomation.flightInformations = [];
    let flightSegment = 0;
    if (departureFlight) {
      const flightSegs = departureFlight.flight.flightSegments;
      flightSegs.forEach((seg, index) => {
        const flightInfomationItem = new FlightInfomation();
        flightInfomationItem.segment = ++flightSegment;
        const airline = seg.airline.split('-')[0];
        flightInfomationItem.serviceProvider = airline || 'CX';
        if (provider !== flightProvider.AERO_CRS) {
          flightInfomationItem.serviceProviderNumber = airline + (seg.flightNumber || '777');
       } else {
          flightInfomationItem.serviceProviderNumber = seg.flightNumber || '777';
       }
        flightInfomationItem.startDate = this.datePipe.transform(seg.depDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.endDate = this.datePipe.transform(seg.arrDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.departureCity = seg.depAirportCode;
        flightInfomationItem.destinationCity = seg.arrAirportCode;
        const destinationCountry = new CorverCountries();
        const desCountry = [];
        desCountry.push(seg.arrCountry);
        destinationCountry.destinationCountries = desCountry;
        flightInfomationItem.destinationCountries = destinationCountry;

        flightInfomation.flightInformations.push(flightInfomationItem);
      });
    }
    if (returnFlight) {
      const flightSegs = returnFlight.flight.flightSegments;
      flightSegs.forEach((seg, index) => {
        const flightInfomationItem = new FlightInfomation();
        flightInfomationItem.segment = ++flightSegment;
        const airline = seg.airline.split('-')[0];
        flightInfomationItem.serviceProvider = airline || 'CX';
        if (provider !== flightProvider.AERO_CRS) {
          flightInfomationItem.serviceProviderNumber = airline + (seg.flightNumber || '777');
        } else {
            flightInfomationItem.serviceProviderNumber = seg.flightNumber || '777';
        }
        flightInfomationItem.startDate = this.datePipe.transform(seg.depDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.endDate = this.datePipe.transform(seg.arrDateTime.split(' ')[0], 'yyyy-MM-dd');
        flightInfomationItem.departureCity = seg.depAirportCode;
        flightInfomationItem.destinationCity = seg.arrAirportCode;
        const destinationCountry = new CorverCountries();
        const desCountry = [];
        desCountry.push(seg.arrCountry);
        destinationCountry.destinationCountries = desCountry;
        flightInfomationItem.destinationCountries = destinationCountry;
        flightInfomation.flightInformations.push(flightInfomationItem);
      });
    }
    travelInfomation.bookingDetails = flightInfomation;
    purchaseRequest.itinerary = travelInfomation;

    // contract info
    const contractInfo = new ContactInformation();
    const address = new HepstarAddress();
    address.street = passangerInfos[0].address;
    address.city = passangerInfos[0].address;
    address.country = passangerInfos[0].country;
    address.postalCode = 1001;
    contractInfo.address = address;
    const hepstarPhones = new HepstarPhones();
    const hepstarPhone = new HepstarPhone();
    hepstarPhone.type = 'Mobile';
    hepstarPhone.number = passangerInfos[0].phoneNo;
    hepstarPhones.mobileNumber = hepstarPhone;
    contractInfo.phones = hepstarPhones;
    contractInfo.email = passangerInfos[0].email;
    purchaseRequest.contactInformation = contractInfo;
    purchaseRequests.purchaseRequest.push(purchaseRequest);
    requestParameters.policyRequests = purchaseRequests;
    console.log(requestParameters);
    return requestParameters;
  }
}
