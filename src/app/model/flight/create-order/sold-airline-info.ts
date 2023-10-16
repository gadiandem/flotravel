import { Arrival } from "./arrival";
import { Departure } from "./departure";
import { MarketingCarrier } from "./marketing-carrier";

export class SoldAirlineInfo {
    departure: Departure;
    arrival: Arrival;
    marketingCarrier: MarketingCarrier;
    equipment: any;
}