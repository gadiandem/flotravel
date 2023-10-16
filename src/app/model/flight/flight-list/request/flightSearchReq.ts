import { OriginalDestination } from './OriginalDestination';
import { MetaData } from './meta-data';
import { CalendarDates } from './calendar-dates';
import { Preference } from './preference';
import { Travellers } from './travellers';
import { OrderChangeReq } from '../../order-change';

export class FlightSearchReq {
  orgId: string;
  metadata: MetaData;
  originalDestinations: OriginalDestination[];
  calendarDates: CalendarDates;
  preference: Preference;
  travellers: Travellers;
  simulator: boolean;
  bspBooking: boolean;
   // reshop value
   orderChange: OrderChangeReq;
}
