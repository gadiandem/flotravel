import {LocationTotal} from './location-total';
import {Service} from '../../common/service';

export class ArrivalRes {
  connection: boolean;
  meeting_date: string;
  arrival_date: string;
  terminal_id: string;
  terminal_name: string;
  airport: {
    iata: string;
  };
  special_notes: string;
  additional_hour_charge: number;
  surcharge: number;
  services: Service[];
  location_total: LocationTotal;
}
