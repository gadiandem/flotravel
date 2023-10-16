import { MetaData } from "../../dashboard/hotel/metadata";

export class TourPackageReq {
  hotelId: string;
  sessionId: string;
  metadata: MetaData;
}
