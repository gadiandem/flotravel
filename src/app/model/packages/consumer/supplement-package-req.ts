import { MetaData } from "../../dashboard/hotel/metadata";

export class SupplementPackageReq {
    hotelId: string;
    sessionId: string;
    metadata: MetaData;
}
