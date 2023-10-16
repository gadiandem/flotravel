import {HotelShoppingResponse} from 'src/app/model/hotel/hotel-list/hotel-shopping-sesponse';

export interface HotelCombineShoppingResponse {
  hotelNuitee: HotelShoppingResponse;
  hotelNCT: HotelShoppingResponse;
  hotelSimulator: HotelShoppingResponse;
}
