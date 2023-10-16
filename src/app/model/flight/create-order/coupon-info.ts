import { SoldAirlineInfo } from "./sold-airline-info";

export class CouponInfo {
    couponNumber: number;
    fareBasisCode: string;
    serviceID: string;
    passengerID: string;
    segmentKey: string;
    soldAirlineInfo: SoldAirlineInfo;
    validatingAirline: string;
}