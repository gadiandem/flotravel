import { CorverCountries } from "./cover-countries";
import { FlightInformations as BookingDetails } from "./flight-infomations";

export class Itinerary {
    startDate: string;
    endDate: string;
    departureCountry: string;
    totalBookingValue: number;
    destinationCountries: CorverCountries;
    bookingDetails: BookingDetails;
    // segments: number;
}
