import { PreferenceItem } from "./preference-item";

export class HotelRuleConfigureCreate {
  code: string;
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  providers: PreferenceItem[];
  airportPrefer: PreferenceItem[];
  hotelPreferenceIncludes: PreferenceItem[];
  hotelPreferenceExcludes: PreferenceItem[];
  starPreferences: PreferenceItem[];
}
