import { FlocashBaseResponse } from "../../flocash-base-response";
import { DepositFee } from "./deposit-fee";

export class DepositFeeRes extends FlocashBaseResponse {
    depositFee: DepositFee;
}