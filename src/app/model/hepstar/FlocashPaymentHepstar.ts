import { FlocashOrderResponse } from "../flocash/response/flocash-order.response";
import { Trace } from "../gca/common/trace";
import { Status } from "../hotel/hotel-payment/status";

export class FlocashPaymentHepstar extends FlocashOrderResponse {

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
    masterPurchaseNumber : string;
    purchaseNumber : string;

}