import { BankModel } from "../bank-account/bank-model";

export class WithdrawCreateRes {
    id: string;
    bank: BankModel;
    amount: number;
    currency: string;
    fee: number;
    status: number;
    createDate: string;
}