import { BankModel } from "../bank-account/bank-model";

export class WithdrawItem {
    id: string;
    bank: BankModel;
    amount: number;
    currency: string;
    fee: number;
    status: string;
    createDate: string;
}