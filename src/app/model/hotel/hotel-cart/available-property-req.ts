import { CheckRoomReq } from './checkRoomReq';
import {PackageInfo} from '../../packages/provider/package-info';
import {ItemPrice} from '../../packages/consumer/item-price';
import { MetaData } from '../../flight/flight-list/request/meta-data';

export class AvailablePropertyReq {
  selectedRoom: CheckRoomReq;
  simulator: boolean;
  provider: string;

  // nct provider info
  hotelId: string;
  packageInfo: ItemPrice;
  hotelRooms: ItemPrice[];
  startDate: string;
   // simulator provider info
   hotelRoomSimulatorId: string;
  endDate: string;
  numberOfRoom: number;
  metadata: MetaData;
}
