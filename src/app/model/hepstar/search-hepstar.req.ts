import { Customers } from './insureds';
import { Itinerary as Itinerary } from './travel-infomation';

export class SearchHepstarProductReq {
  customers: Customers;
  itinerary: Itinerary;
  executionId: string;
  provider: number;
}
