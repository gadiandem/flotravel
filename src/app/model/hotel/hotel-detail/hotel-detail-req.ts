import { MetaData } from "../../flight/flight-list/request/meta-data";

export class HotelDetailReq {
  hotelCode: string;
  sessionId: string;
  simulator: boolean;
  provider: string;
  metadata: MetaData;
}
