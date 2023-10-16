import { ResponseStatus } from './ResponseStatus';
import { City } from './city';
import { HotelResults } from './hotel-results';
import { RoomGuest } from './roomGuest';

export class Result {
  responseStatus: ResponseStatus;
  sessionId: string;
  city: City;
  checkInDate: string;
  checkOutDate: string;
  currency: string;
  roomGuests: RoomGuest;
  hotelResults: HotelResults;
}
