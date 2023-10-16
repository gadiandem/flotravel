import { BankModel } from "../bank-account/bank-model";
import { BalanceSummary } from "../summary/balance-summary";

export class WithdrawInfo {
    bank: BankModel;
    withdrawAmount: number;
    currenctlyBalance: BalanceSummary;
    fee: number;
}