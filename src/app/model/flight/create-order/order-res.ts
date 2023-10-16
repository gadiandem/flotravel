import { ErrorsType } from '../offer-price/errors-type';
import { OrderViewRSResponse } from './order-view-rs-response';

export class OrderRes {
  errors: ErrorsType;
  response: OrderViewRSResponse;
}
