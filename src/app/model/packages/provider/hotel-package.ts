import { HotelFacility } from "./hotel-facility";

export class HotelPackage {
    id: string;
    name: string;
    overview: string;
    hotelImage: string;
    cityId: string;
    cityName: string;
    regionId: string;
    regionName: string;
    taxId: string;
    roomImages: any[];
    highlightFacilities: any[];
    minPrice: string;
    currency: string;
    // inclusions: string[];
    // exclusions: string[];
    starRate: number;
    latitude: number;
    longitude: number;
    additionalInfo: string;
    breakfast: boolean;
    remark: string;
    fullFacilityDescriptions: HotelFacility[];
    discount: string;
    rooms: any;
}