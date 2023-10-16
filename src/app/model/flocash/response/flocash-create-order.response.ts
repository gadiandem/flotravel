import { BaseResponse } from '../../common/base-response';
import {FlocashOrderResponse} from './flocash-order.response';

export class FlocashCreateOrderResponse extends BaseResponse {
    order: FlocashOrderResponse;
}
