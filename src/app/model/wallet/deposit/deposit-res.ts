import { FlocashBaseResponse } from "../flocash-base-response";
import { DepositOrderRes } from "./deposit-order-res";

export class DepositRes extends FlocashBaseResponse{
    order: DepositOrderRes;
}