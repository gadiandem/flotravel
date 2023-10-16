import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

import { environment } from '../../../environments/environment';
import { TourPaymentReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-req';
import { TourPaymentRes } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/tour-payment.res';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { User } from 'src/app/model/auth/user/user';
import { FlocashData } from 'src/app/model/flocash/flocash-data';
import { CardInfo } from 'src/app/model/flocash/card-info';
import { Merchant } from 'src/app/model/flocash/merchant.model';
import { Order } from 'src/app/model/flocash/order.model';
import { Payer } from 'src/app/model/flocash/payer';
import { PayOption } from 'src/app/model/flocash/pay-option';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { PaymentTour } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { ScheduleExtra } from 'src/app/model/thing-to-do/schedule-extra-data';
import { PaymentTourReq } from 'src/app/model/thing-to-do/tour-payment/tour-payment-res/payment-tour-request';

@Injectable({
  providedIn: 'root'
})
export class TourPaymentService {

  private tourPaymentUrl = environment.baseUrl + 'tour/payment';

  constructor(private http: HttpClient) { }


  tourPayment(paymentData: PaymentTourReq) {
    const tourPaymentData = new TourPaymentReq();
    // flocash data
    // const flocashData = this.flocashModel(paymentData.cardPayment, paymentData.currency, paymentData.totalPrice, paymentData.userInfo);
    // tourPaymentData.flocashRequest = flocashData;
    // tourPaymentData.tourData = Object.assign({}, paymentData.tourId);
    // tourPaymentData.tourData.adultCount = paymentData.schedule.adultCount;
    // tourPaymentData.tourData.childCount = paymentData.schedule.childCount;
    // tourPaymentData.schedule = paymentData.schedule;
    tourPaymentData.userId = paymentData.accountBooking;
    return this.http.post<PaymentTour>(this.tourPaymentUrl, tourPaymentData);
  }

  flocashModel(cardPayment: CardPaymentModel, currency: string, totalPrice: number
    , userInfo: UserInfoModel): FlocashData {
    // flocash data
    const flocashData = new FlocashData();
    const cardInfo = new CardInfo();
    cardInfo.cardHolder = cardPayment.cardName;
    cardInfo.cardNumber = cardPayment.cardNo;
    const month_year: string[] = cardPayment.expiry.split(' / ');
    cardInfo.expireMonth = month_year[0];
    cardInfo.expireYear = month_year[1];
    cardInfo.cvv = cardPayment.cvv;
    flocashData.cardInfo = cardInfo;
    const merchant = new Merchant();
    merchant.merchantAccount = 'flotravel@mobirr.com';
    flocashData.merchant = merchant;
    const order = new Order();
    order.currency = currency;
    order.amount = totalPrice;
    order.item_name = 'booking thing-to-do( tour)';
    order.item_price = totalPrice.toString();
    order.quantity = '1';
    order.orderId = uuidv4();
    flocashData.order = order;
    const payer = new Payer();
    payer.email = userInfo.email;
    payer.country = 'VN'; // this.userInfo.country;
    payer.firstName = userInfo.firstName;
    payer.lastName = userInfo.lastName;
    payer.mobile = userInfo.mobile;
    flocashData.payer = payer;
    const payOption = new PayOption();
    payOption.id = '123';
    flocashData.payOption = payOption;
    return flocashData;
  }
}
