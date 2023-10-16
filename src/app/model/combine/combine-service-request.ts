import { HotelCustomerInfo } from "../hotel/hotel-cart/hotelCustomerInfo";
import { AwsImgUrl } from "../hotel/hotel-list/aws-img-url";
import { FlightPaymentRequest } from "../flight/payment/flight-payment-request";

export class CombineServicePaymentRequest extends FlightPaymentRequest {
  sessionId: string;
  hotelProvider: string;
  propertyCode: string;
  hotelCode: number;
  image: AwsImgUrl;
  customerBookingInfos: HotelCustomerInfo[];
}
