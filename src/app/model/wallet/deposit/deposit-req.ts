import { CardInfo } from "../../flocash/card-info";
import { PayerWallet } from "./payer";

export class DepositReq {
    depositAmount: number;
    amount: number;
    currency: string;
    payOptionId: string;
    cardInfo: CardInfo;
    payer: PayerWallet;
}