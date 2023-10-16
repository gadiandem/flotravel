import { CustomerBookingInfo } from "../../common/customer-booking-info";
import { FlocashOrderResponse } from "../../flocash/response/flocash-order.response";
import { HotelPackage } from "../provider/hotel-package";
import { HotelRoomPackage } from "../provider/hotel-room-package";
import { PackageInfo } from "../provider/package-info";
import { SupplementPackage } from "../provider/supplement-package";
import { TaxPackage } from "../provider/tax-package";
import { TourPackage } from "../provider/tour-package";
import { TransferInPackage } from "../provider/transfer-package";

export class HistoryOrderPackageDetailRes extends FlocashOrderResponse {
    id: string;
    accountBooking: string;
    bookingForUser: boolean;
    userIsBooking: string;
    name: string;
    title: string;
    packageInfo: PackageInfo;
    hotelPackage: HotelPackage;
    numberOfRoom: number;
    rooms: HotelRoomPackage[];
    supplements: SupplementPackage[];
    tourInPackages: TourPackage[];
    transferInPackages: TransferInPackage[];
    totalPrice: number;
    // packageTax: TaxPackage;
    emailToNCT: string;
    customerBookingInfos: CustomerBookingInfo[];

    bookingStatus: string;
    createDate: string;
    startDate: string;
    refundedAmount: number;
}
