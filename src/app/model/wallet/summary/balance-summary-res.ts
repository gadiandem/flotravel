import { FlocashBaseResponse } from "../flocash-base-response";
import { AccountSummary } from "./account-summary";

export class SummaryBalanceRes extends FlocashBaseResponse {
    summary: AccountSummary[];
}