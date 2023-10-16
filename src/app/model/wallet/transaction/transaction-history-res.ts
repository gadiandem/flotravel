import { FlocashBaseResponse } from "../flocash-base-response";
import { TransactionItem } from "./transactiono-item";

export class TransactionHitoryRes extends FlocashBaseResponse{
    transactions: TransactionItem[];
}