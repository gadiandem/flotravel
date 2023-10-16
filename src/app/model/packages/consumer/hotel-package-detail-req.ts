import { MetaData } from "../../dashboard/hotel/metadata";

export class HotelPackageDetailReq {
    hotelId: string;
    sessionId: string;
    metadata: MetaData;
}
