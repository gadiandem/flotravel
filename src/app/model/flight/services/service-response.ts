import { ExchangeResponse } from "../../wallet/deposit/exchange-rate-response";
import { AvailableServices } from "./available-services";
import { BaggageAllowance } from "./baggage-allowance";
import { Pax } from "./pax";
import { PaxJourney } from "./pax-journey";

export class ServiceListResponse{

    shoppingResponseID: string;
    baggageAllowance: BaggageAllowance[];
    paxJourney: PaxJourney[];
    pax: Pax[];
    servicesList: {[key: string]: AvailableServices};
    paxSegmentList : any[];
    exchangeRate: ExchangeResponse;
    
}