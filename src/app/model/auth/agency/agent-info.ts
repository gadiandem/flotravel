import { CountryRefer } from './country-refer';
import { FlightSupplier } from './supplier';

export class AgentInfo {
  address: string;
  country: CountryRefer;
  city: any;
  website: string;
  flightProvider : FlightSupplier[];
  logo: string;
  images: string[];
}
