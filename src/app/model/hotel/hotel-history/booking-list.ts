import { User } from '../../auth/user/user';
import { Payer } from '../../flocash/payer';
import { City } from '../hotel-list/city';
import { HotelInfo } from '../hotel-list/hotel-info';
import { HotelPaymentRequest } from '../hotel-payment/hotelPaymentRequest';
import { RoomDetails } from '../hotel-payment/room-details';
import { BookingDetail } from './booking-detail';

export class BookingList {
  id: string;
  agent : string;
  amount: string;
  currency: string;
  payer: Payer;
  hotelInfo: HotelInfo;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  bookingId: number;
  roomDetails: RoomDetails;
  createDate: string;
  updateDate: string;
  item_price: string;
  cancelPoliciesInfos: any;
  accountBooking : string;
  bookingDetail : BookingDetail;
  city : City;
  user : User;
  
}
