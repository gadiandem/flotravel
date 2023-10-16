import { FlocashBaseResponse } from '../flocash-base-response';
import { PaymentOption } from './deposit.option';
import { OptionInfo } from './option-info';

export class GetOptionRes extends FlocashBaseResponse {
    paymentOptions: PaymentOption;
}
