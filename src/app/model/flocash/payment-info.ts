import { SubscribePolicyData } from "../insurance/subscription-policy/subscribe-policy-data";
import { CardInfo } from "./card-info";
import { Payer } from "./payer";

export class PaymentInfo {
    name: string;
    email: string;
    price: number;
    currency: string;
    cardInfo: CardInfo;
    payer: Payer;

    // merchantAccount: string;
    vcnPayment: boolean;
    traceNumber: string;
    otpValue: string;

}