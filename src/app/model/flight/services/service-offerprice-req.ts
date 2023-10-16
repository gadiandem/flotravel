import { MetaData } from "../flight-list/request/meta-data";
import { OfferPriceReq } from "../offer-price/request/offer-price-req";
import { AvailableServices } from "./available-services";

export class FlightServicesOfferPriceReq {

    selectedServices: AvailableServices[];
    offerPriceReq: OfferPriceReq;
    provider: number;
    metadata: MetaData;
   
 }