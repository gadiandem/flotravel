import { HotelFacility } from '../../packages/provider/hotel-facility';

export class HotelInfoSimulator {
  id: string;
  name: string;
  overview: string;
  hotelImage: string;
  cityId: string;
  cityName: string;
  regionId: string;
  regionName: string;
  address: string;
  roomImages: any[];
  minPrice: number;
  currency: string;
  starRate: number;
  latitude: number;
  longitude: number;
  additionalInfo: string;
  remark: string;
  fullFacilityDescriptions: HotelFacility[];
  discount: number;
}
