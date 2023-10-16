import { ExchangeResponse } from "../../wallet/deposit/exchange-rate-response";
import { ALaCarteOfferItem } from "./aLaCarte-offerItem";
import { ServiceDefinition } from "./service-definition";

export class AvailableServices{

    serviceKey: string;
    offerID: string;
    ownerCode: string;
    alaCarteOfferItem: ALaCarteOfferItem;
    serviceDefinition: ServiceDefinition;
    exchangeRate: ExchangeResponse;
}