import { AwsImgUrl } from '../../hotel/hotel-list/aws-img-url';
import { RateDetails } from '../../hotel/hotel-list/rate-details';
import { HotelDetailSimulatorResponse } from '../simulator/hotel-detail-simulator-response';
import { HotelImage } from './hotelImage';

export class HotelDetailModel {
  name: string;
  currency: string;
  address1: string;
  address2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  airportCode: string;
  propertyCategory: number;
  propertyCurrency: string;
  starRating: string;
  confidence: string;
  supplierType: string;
  location: string;
  chainCodeId: string;
  lowRate: string;
  highRate: string;
  checkInTime: string;
  checkOutTime: string;
  cityCode: string;
  hotelDescription: string;
  hotelDiningDescription: string;
  hotelAttraction: string;
  hotelLocationDescription: string;
  hotelFeatures: string;
  hotelAmenitiesDescription: string;
  hotelAttributeses: string[];
  hotelImages: HotelImage[];
  awsImageList: AwsImgUrl[];
  rateDetails: RateDetails;
   // info of provider simulator
   hotelDetailSimulator: HotelDetailSimulatorResponse;
}
