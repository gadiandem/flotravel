import { BankModel } from "../bank-account/bank-model";

export class WithdrawUpdateReq {
    id: number;
    bank: BankModel;
    amount: number;
    fee: number;
    
    updateDate: string;
    amountWithdraw: number;
    currency: string;
    feeWithdraw: number;
    status: string;
}