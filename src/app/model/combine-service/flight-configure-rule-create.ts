import { AirportRes } from "../flight/airport/airportRes";
import { PreferenceItem } from "./preference-item";

export class FlightRuleConfigureCreate {
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
