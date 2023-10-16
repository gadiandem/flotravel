import { HotelFacility } from "../hotel-facility";

export class PaginationHotelFacility{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: HotelFacility[];
}