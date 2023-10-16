import { CountryRes } from "../../common/country/country-res";

export class AirportRes {
  code: string;
  name: string;
  displayName: string;
  country: CountryRes;
  cityCode: any;
  cityName: any;
}
