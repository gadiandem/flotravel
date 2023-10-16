import {HotelShoppingResponse} from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';
import {HotelDetailModel} from '../hotel/hotel-detail/hotelDetailModel';
import {HotelPackageDetailRes} from '../packages/consumer/hotel-package-detail-res';

export class HotelCombineDetailResponse {
  hotelNuitee: HotelDetailModel;
  hotelNCT: HotelPackageDetailRes[];
  hotelSimulator: HotelDetailModel;
}
