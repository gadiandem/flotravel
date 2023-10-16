import { MetaData } from "../../dashboard/hotel/metadata";
import { RoomGuest } from "../../dashboard/hotel/room-guest";

export class PackageShoppingReq {
    cityCode: string;
    destination: string;
    minDay: number;
    maxDay: number;
    date: string;
    endDate: string;
    rooms: RoomGuest[];
    metadata: MetaData;
}