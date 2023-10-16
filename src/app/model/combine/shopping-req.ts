import { Coordinate } from '../dashboard/hotel/coordinate';
import { MetaData } from '../dashboard/hotel/metadata';
import { RoomGuest } from '../dashboard/hotel/room-guest';
import { CombineDestination } from './combine-destination';

export class CombineShoppingReq {
  metadata: MetaData;
  hotels: string[];
  destination: CombineDestination;
  leaveFrom: CombineDestination;
  rooms: RoomGuest[];
  checkinDate: string;
  checkoutDate: string;
  simulator: boolean;
}
