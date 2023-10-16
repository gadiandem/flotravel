import { MetaData } from './metadata';
import { Coordinate } from './coordinate';
import { RoomGuest } from './room-guest';

export class HotelShoppingReq {
  metadata: MetaData;
  hotels: string[];
  destination: string;
  cityCode: string;
  countryCode: string;
  coordinate: Coordinate;
  rooms: RoomGuest[];
  checkinDate: string;
  checkoutDate: string;
  simulator: boolean;
}
