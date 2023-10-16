import { Board } from '../hotel-list/board';
import { RoomRate } from '../hotel-list/room-rate';

export class RoomDetail {
  adultCount: number;
  childCount: number;
  firstName: string;
  includedBoard: Board;
  lastName: string;
  roomDescription: string;
  roomRate: RoomRate;
}
