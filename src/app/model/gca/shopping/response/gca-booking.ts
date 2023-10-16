import {TerminalGca} from './terminal-gca';

export class GcaBooking {
  id: string;
  iata: string;
  icao: string;
  name: string;
  country: string;
  city: string;
  booking_window: string;
  terminals: TerminalGca[];
  air_side_meetup: {
    international: infoArea;
    domestic: infoArea;
  }
}

class infoArea {
  arrival: boolean;
  departure: boolean;
  transit: boolean;
}
