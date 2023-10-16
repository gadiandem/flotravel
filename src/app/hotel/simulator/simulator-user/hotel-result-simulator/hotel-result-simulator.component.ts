import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardPaymentModel } from 'src/app/model/hotel/hotel-payment/card-payment.model';
import { UserInfoModel } from 'src/app/model/hotel/hotel-payment/user-info.model';
import { PaymentRes } from 'src/app/model/hotel/hotel-payment/payment.res';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { FlocashData } from 'src/app/model/flocash/flocash-data';
import { hotelConstant } from '../../../hotel.constant';
import { appConstant, defaultData } from 'src/app/app.constant';
import { HotelPaymentRequest } from 'src/app/model/hotel/hotel-payment/hotelPaymentRequest';
import { HotelSimulatorService } from '../../../../service/hotel/simulator/hotel-simulator.service';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelRoomSimulator } from '../../../../model/hotel/simulator/hotel-room-simulator';
import { FlocashVCNRes } from 'src/app/model/common/flocash-vcn-res';
import { PaymentInfo } from 'src/app/model/flocash/payment-info';


@Component({
  selector: 'app-hotel-result-simulator',
  templateUrl: './hotel-result-simulator.component.html',
  styleUrls: ['./hotel-result-simulator.component.css']
})
export class HotelResultSimulatorComponent implements OnInit {
  cardPayment: CardPaymentModel;
  userInfo: UserInfoModel[];
  floCash: FlocashData;
  fetchFailed: boolean;
  errorMes: string;
  // user: UserDetail;
  selectedRoom: HotelRoomSimulator;
  selectedHotel: HotelInfoSimulator;
  paymentResult: PaymentRes;
  searchHotelForm: HotelShoppingReq;
  hotelPaymentReqSimulator: HotelPaymentRequest;
  currency: string;
  initialRequest: boolean;
  defaultData: string;
  isLoading = false;

  constructor(
    private route: Router,
    private hotelSimulatorService: HotelSimulatorService
  ){}

  ngOnInit() {
    window.scroll(0, 0);
    this.defaultData = defaultData.noImage;
    this.initialRequest = true;
    this.searchHotelForm = JSON.parse(sessionStorage.getItem(hotelConstant.SEARCH_HOTEL_LIST_REQUEST));
    this.selectedHotel = JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_HOTEL_INFO));
    this.selectedRoom =  JSON.parse(sessionStorage.getItem(hotelConstant.SELECTED_ROOM_DETAIL));
    this.hotelPaymentReqSimulator = JSON.parse(sessionStorage.getItem(hotelConstant.HOTEL_PAYMENT_REQ));
    this.userInfo = JSON.parse(sessionStorage.getItem(hotelConstant.CUSTOMERS_INFO));
    this.currency = this.selectedHotel.currency;
    this.hotelBooking()
  }

  hotelBooking(){
    if(this.hotelPaymentReqSimulator){
      this.isLoading = true;
      if(this.hotelPaymentReqSimulator.paymentInfo.vcnPayment){
        const vcnRes: FlocashVCNRes = JSON.parse(localStorage.getItem(appConstant.AGENT_VCN));
        const vcn: PaymentInfo =  JSON.parse(sessionStorage.getItem(appConstant.paymentInfo));
        const payment : PaymentInfo = new PaymentInfo();
        
        this.hotelPaymentReqSimulator.paymentInfo.vcnPayment = vcn.vcnPayment;
        this.hotelPaymentReqSimulator.paymentInfo.traceNumber = vcn.traceNumber;
        this.hotelPaymentReqSimulator.paymentInfo.otpValue = vcn.otpValue;
      }
     this.hotelSimulatorService.paymentAndBookingHotelSimulator(this.hotelPaymentReqSimulator).subscribe(
       data => {
         this.paymentResult = data;
         this.isLoading = false;
       }, error => {
         console.log(error);
         this.isLoading = false;
       }
     );
    } else {
      this.fetchFailed = true;
      this.errorMes = 'Hotel simulator booking fail';
    }
  }
}
