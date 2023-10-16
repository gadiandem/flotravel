import { AirportRes } from "../flight/airport/airportRes";
import { PreferenceItem } from "./preference-item";

export interface FlightRuleConfigure {
  id: string;
  code: string;
  type: string;
  arrival: AirportRes;
  departure: AirportRes;
  providers: PreferenceItem[];
  airlinePreferenceIncludes: PreferenceItem[];
  airlinePreferenceExcludes: PreferenceItem[];
  businessCabinPreferences: PreferenceItem[];
  baggagePreferences: PreferenceItem[];
}
