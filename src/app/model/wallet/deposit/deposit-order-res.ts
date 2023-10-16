import { OptionInfo } from "./option-info";
import { PayerWallet } from "./payer";
import { Redirect } from "./redirect";

export class DepositOrderRes {
    amount: number;
    capturedAmount: number;
    refundedAmount: number;
    orderDate: string;
    currency: string;
    currencyName: string;
    custom: string;
    item_name: string;
    item_price: string;
    quantity: string;
    orderId: string;
    tracking: string;
    traceNumber: string;
    status: string;
    statusDesc: string;
    payer: PayerWallet;
    paymentChannel: string;
    payOption: OptionInfo;
    instruction: string;
    partnerTxn: string;
    redirect: Redirect;
}