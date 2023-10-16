import { BaseResponse } from "../../common/base-response";
import { Checkout } from "./check-out";

export class CheckoutRes extends BaseResponse{
    result: Checkout;
}