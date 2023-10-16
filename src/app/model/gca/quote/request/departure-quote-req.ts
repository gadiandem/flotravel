import {Service} from '../../common/service';

export class DepartureQuoteReq {
  connection: boolean;
  meeting_date: string;
  departure_date: string;
  terminal_id: string;
  contact_point: ContactPoint;
  special_notes: string;
  services: Service[];
}

export class ContactPoint {
  name: string;
  contact: string;
}
