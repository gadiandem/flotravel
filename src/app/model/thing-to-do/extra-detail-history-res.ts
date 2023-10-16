import { CustomerBookingInfo } from "../common/customer-booking-info";
import { Payer } from "../flocash/payer";
import { ExtrasPackage } from "./insert-tour/extras-package";
import { ExtraDetailInfo } from "./tour-detail/extra-detail-info";

export class ExtrasHistoryDetailRS {
    id: string;
    amount: number;
    refundedAmount: number;
    currency: string;
    currencyName: string;
    item_name: string;
    adultCount: number;
    childCount: number;
    dateBooking: string;
    traceNumber: string;
    bookingRemarks: string;
    orderId: string;
    customerBookingInfos: CustomerBookingInfo[];
    bookingId: string;
    payer: Payer
    bookingStatus: string;
    extraPackageId: string;
    extraDetailId: string;
    extraPackageAvailabilityId: string;
    extraDetailAvailabilityId: string;
    extraDetail: ExtraDetailInfo;
    extraPackage: ExtrasPackage;
}