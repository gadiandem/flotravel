import { Travellers } from "../flight/flight-list/request/travellers";

export class SearchInsurancePackageReq {
  residenceCountry: string;
  countryOfTravel: string;
  startDate: string;
  endDate: string;
  travellers: Travellers;
  packageId: string;
  sessionId: string;
  currency: string;
  executionId: string;
  provider: number;
}
