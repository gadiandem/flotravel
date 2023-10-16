import { HotelRoomSimulator } from './hotel-room-simulator';
import { HotelInfoSimulator } from './hotel-info-simulator';

export class HotelDetailSimulatorResponse {
  hotelRoomList: HotelRoomSimulator[];
  hotelInfo: HotelInfoSimulator;
}
