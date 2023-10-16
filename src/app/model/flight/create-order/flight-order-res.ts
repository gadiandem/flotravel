import { FlocashOrderResponse } from "../../flocash/response/flocash-order.response";
import { OrderViewRSInfo } from "./order-viewres-info";

export class FlightOrderResponse extends FlocashOrderResponse {
    id: string;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    responseStatus: any;
    holder: any;
    orderIdOfNDC: string;
    ownerOfNDC: string;
    bookingStatus: string;
    bookingSuccess: boolean;
    token: string;
    baseAmount: number;
    taxes: number;
    paymentTariff: any;
    NDC_reasonCancellation: string;
    NDC_cancellationAmount: number;
    NDC_refundAmount: number;
    deleted: boolean;

    orderViewRSInfo: OrderViewRSInfo;
  
}