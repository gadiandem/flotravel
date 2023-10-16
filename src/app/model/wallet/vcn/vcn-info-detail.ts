import { BillingAddress } from "./billing-address";

export class VCNInfoDetail {
    id: number;
    pan: string;
    realPan: string;
    cvv: string;
    currency: string;
    expireMonth: string;
    expireYear: string;
    balance: number;
    token: string;
    status: string;
    billingAddress: BillingAddress;
}