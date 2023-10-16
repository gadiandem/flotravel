import { ContactInformation } from "./contract-infomation";
import { Customers } from "./insureds";
import { Itinerary } from "./travel-infomation";

export class PurchaseRequest {
    bookingReference: string;
    productCode: string;
    customers: Customers;
    contactInformation: ContactInformation;
    itinerary: Itinerary;
}
