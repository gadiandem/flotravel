import { MetaData } from "../dashboard/hotel/metadata";
import { Travellers } from "./flight-list/request/travellers";
import { OrderChangeReq } from "./order-change";
import { PassegerInfo } from "./payment-info/passeger.info";

export class OrderExchangeReq {

    orderChange: OrderChangeReq;
    travellers: Travellers;
    customerInfos: PassegerInfo[];
    provider: number;
    metadata: MetaData;
   
  }