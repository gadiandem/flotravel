
import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateOrderReq } from 'src/app/model/flight/create-order/create-order-req';
import { OrderRes } from 'src/app/model/flight/create-order/order-res';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { SearchFlightForm } from 'src/app/model/flight/search-flight-form';
import { CardInfo } from 'src/app/model/flocash/card-info';
import { Travellers } from 'src/app/model/flight/flight-list/request/travellers';
import { PayerInfo } from 'src/app/model/flight/create-order/payer-info';

@Injectable({
  providedIn: 'root'
})
export class FlightPaymentService {
  private createOrder = environment.baseUrl + 'ndc/createOrder';

  constructor(private http: HttpClient, public datepipe: DatePipe, @Inject(LOCALE_ID) private _locale: string) { }

  payment(cardPayment: CardPaymentModel,
    userInfo: UserInfoModel,
    searchFlightForm: SearchFlightForm,
    executionId: string,
    currency: string,
    totalPrice: number) {
    const req = new CreateOrderReq();
    req.executionId = executionId;
    req.currency = currency;
    const cardInfo = new CardInfo();
    cardInfo.cardHolder = cardPayment.cardName;
    cardInfo.cardNumber = cardPayment.cardNo.replace(/ /g, '');
    const month_year: string[] = cardPayment.expiry.split(' / ');
    cardInfo.expireMonth = month_year[0];
    cardInfo.expireYear = month_year[1];
    cardInfo.cvv = cardPayment.cvv;
    req.cardInfo = cardInfo;

    const travellers = new Travellers();
    travellers.adt = searchFlightForm.adults;
    travellers.chd = searchFlightForm.children;
    req.travellers = travellers;
    req.departureAirportCode = searchFlightForm.flyFrom.code;

    const payerInfo = new PayerInfo();
    payerInfo.address = '100 APPLIEDLINE MAIN STREET';
    payerInfo.birthDate = '2000-06-10';
    payerInfo.country = userInfo.country;
    payerInfo.expiryDate = '2024-06-05';
    payerInfo.firstName = userInfo.firstName;
    payerInfo.gender = 'MALE';
    // payerInfo.issueDate = '2010-06-10';
    payerInfo.lastName = userInfo.lastName;
    payerInfo.middleName = userInfo.middleName;
    payerInfo.notify = userInfo.isNotify;
    payerInfo.phoneNo = userInfo.mobile;
    req.payerInfo = payerInfo;
    req.total = totalPrice;

    return this.http.post<OrderRes>(this.createOrder, req);
  }

}
