import { FlocashOrderResponse } from "../../flocash/response/flocash-order.response";
import { Status } from "../common/status";
import { Trace } from "../common/trace";

export class FlocashPaymentGca extends FlocashOrderResponse {
    id: string;

    bookingId: string;
    trace: Trace;
    gcaStatus: Status;
    checkoutRes: any;

    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;

    reason: string;
    deleted: boolean;
}