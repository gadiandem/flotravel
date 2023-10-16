import { FlocashOrderResponse } from "../../flocash/response/flocash-order.response";
import { QuoteItem } from "../shopping/quote-item";

export class FlocashPaymentTraceMe extends FlocashOrderResponse {
    id: string;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    quote: QuoteItem;
    quoteId: string;
    policyNumber: string;
    errorTraceMe: string;
    resultTraceMe: string;
    documents: any[];

    bookingStatus: string;
    serviceName: string;
    reason: string;
    deleted: boolean;
}