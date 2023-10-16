import { CorverCountries } from "./cover-countries";

export class FlightInfomation {
    segment: number;
    serviceProvider: string;
    serviceProviderNumber: string;
    startDate: string;
    endDate: string;
    departureCity: string;
    destinationCity: string;
    destinationCountries: CorverCountries;
}
