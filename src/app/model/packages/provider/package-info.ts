import { Itinerary } from "./itinerary-hotel";

export class PackageInfo {
    id: string;
    name: string;
    basicDescription: string;
    dayCount: number;
    nightCount: number;
    itineraries: [][];
    inclusions: string[];
    exclusions: string[];
    currency: string;
    price: number;
    // taxId: string;
    
    regionId: string;
    regionName: string;
    cityId: string;
    cityName: string;
    hotelId: string;

    supplements: string[];
    tours: string[];
    transfers: string[];

    constructor() {
        this.supplements = [];
        this.tours = [];
        this.transfers = [];
    }
}