import { HotelCustomerInfo } from "../hotel/hotel-cart/hotelCustomerInfo";
import { AwsImgUrl } from "../hotel/hotel-list/aws-img-url";

export class HotelCombineInfo {
  sessionId: string;
  propertyCode: string;
  hotelCode: number;
  image: AwsImgUrl;
  customerBookingInfos: HotelCustomerInfo[];
}
