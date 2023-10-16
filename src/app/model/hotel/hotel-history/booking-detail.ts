import { City } from '../hotel-list/city';
import { BookedRooms } from './bookedRooms';
import { HotelInfo } from '../hotel-list/hotel-info';
import { RoomDetails } from '../hotel-payment/room-details';
import { CancelPoliciesInfos } from './cancel-policies.infos';
import { Payer } from '../../flocash/payer';
import { User } from '../../auth/user/user';

export class BookingDetail {
  id: string;
  bookingId: number;
  amount: number;
  capturedAmount: number;
  refundedAmount: number;
  nuitee_cancellationAmount: number;
  nuitee_refundAmount: number;
  checkInDate: string;
  checkOutDate: string;
  hotelInfo: HotelInfo;
  city: City;
  noOfNight: string;
  noOfRooms: string;
  roomDetails: RoomDetails;
  payer: Payer;
  hotelRemarks: string;
  price: string;
  status: string;
  traceNumber: string;
  cancelPoliciesInfos: CancelPoliciesInfos;
  statusDesc : string;
}
