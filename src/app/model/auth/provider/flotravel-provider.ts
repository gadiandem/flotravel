import { CardInfo } from "../../flocash/card-info";

export class FlotravelProvider {
    id: string;
    code: string;
    type: string;
    name: string;
    cardInfo: CardInfo;
    transactionType: number;
    currency: string;
}