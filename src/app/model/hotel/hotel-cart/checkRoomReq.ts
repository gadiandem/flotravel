import { ConfirmedRoom } from "./confirmedRoom";

export class CheckRoomReq {
  sessionId: string;
  hotelId: number;
  rateDetailCode: string;
  confirmedRooms: ConfirmedRoom[];
}
