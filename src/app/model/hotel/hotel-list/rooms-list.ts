import { Broads } from './broads';
import { IncludeBroad } from './include-broad';
import { RoomRate } from './room-rate';

export class RoomsList {
  public adultCount: number;
  public boards: Broads;
  public childCount: number;
  public includedBoard: IncludeBroad;
  public roomCode: string;
  public roomDescription: string;
  public roomRate: RoomRate;
  public roomRemarks: string;
}
