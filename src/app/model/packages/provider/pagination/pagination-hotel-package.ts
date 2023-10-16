import { HotelPackage } from "../hotel-package";

export class PaginationHotelPackage {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: HotelPackage[];
}