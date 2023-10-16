import { BillingAddress } from "./billing-address";

export class VCNInfo {
    id: number;
    pan: string;
    currency: string;
    expireMonth: string;
    expireYear: string;
    balance: number;
    token: string;
    status: string;
    billingAddress: BillingAddress;
}