import { RoomGuests } from './roomGuests';

export class RoomAvailable {
  public roomGuests: RoomGuests;
  public availableForConfirmedBooking: boolean;
  public availableForReservedBooking: boolean;
  public confirmPropertyCode: string;
  public remarks: string;
}
