import { BalanceSummary } from "./balance-summary";

export class AccountSummary {
    accounts: BalanceSummary[];
    lastTransaction: string;
    lastSuccessLogin: string;
    accountType: string;
    addressVerified: string;
}