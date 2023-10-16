import { HotelRoomPackage } from "../hotel-room-package";

export class PaginationHotelRoom {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: HotelRoomPackage[];
}