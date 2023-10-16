import {ContactPoint} from './departure-quote-req';
import {Service} from '../../common/service';

export class ArrivalQuoteReq {
  connection: boolean;
  meeting_date: string;
  arrival_date: string;
  terminal_id: string;
  contact_point: ContactPoint;
  special_notes: string;
  services: Service[];
}
