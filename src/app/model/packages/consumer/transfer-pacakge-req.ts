import { MetaData } from "../../dashboard/hotel/metadata";

export class TransferPackageReq {
    hotelId: string;
    sessionId: string;
    metadata: MetaData;
}
