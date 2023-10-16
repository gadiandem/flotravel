import { AirlineID } from './airline-id';
import { FlightList } from './flight-list';
import { OrderItemType } from './order-item-type';
import { Payments } from './payment-model';

export class FlightDetail {
  airlineID: AirlineID;
  orderID: string;
  payments: Payments;
  owner: string;
  ownerType: string;
  orderItems: OrderItemType;
  flightList: FlightList;
}
