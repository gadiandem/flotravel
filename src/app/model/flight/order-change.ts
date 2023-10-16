import { MetaData } from "../dashboard/hotel/metadata";
import { FlocashPaymentFlight } from "./history/flocash-payment-flight";
import { PassegerInfo } from "./payment-info/passeger.info";
import { SearchFlightForm } from "./search-flight-form";
import { AvailableServices } from "./services/available-services";

export class OrderChangeReq {
    
    changeType: number;
    orderItemRef: string;
    orderId: string;
    provider: number;
    flightDetail:FlocashPaymentFlight;
    serviceOfferReq: AvailableServices[];
    metadata: MetaData;
    flightType: string;

  }