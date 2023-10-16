import { MetaData } from "../flight-list/request/meta-data";
import { OrderChangeReq } from "../order-change";

export class FlightServiceReq {

    provider: number;
    offerID: string;
    ownerCode: string;
    offerItemID: string;
    orderChange: OrderChangeReq;
    metadata: MetaData;

}
