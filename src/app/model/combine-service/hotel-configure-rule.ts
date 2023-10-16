import { PreferenceItem } from "./preference-item";

export interface HotelRuleConfigure {
  id: string;
  code: string;
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  airportPrefer: PreferenceItem[];
  providers: PreferenceItem[];
  hotelPreferenceIncludes: PreferenceItem[];
  hotelPreferenceExcludes: PreferenceItem[];
  starPreferences: PreferenceItem[];
}
