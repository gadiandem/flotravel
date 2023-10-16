import { Payment } from "./payment";
import { TicketDocInfo } from "./ticket-doc-info";

export class OrderViewRSInfo {
    baseAmount: number;
    taxes: number;
    totalOrderPrice: number;
    currency: string;
    bookingRefId: string;
    airlineID: string;
    payment: Payment;
    orderID: string;
    owner: string;
    services: string[];
    ticketDocInfos: TicketDocInfo[];
    dataList: any;
}