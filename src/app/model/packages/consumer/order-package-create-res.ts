import { FlocashOrderResponse } from "../../flocash/response/flocash-order.response";

export class OrderPackageCreateRes extends FlocashOrderResponse {
    id: string;
    serviceName: string;
    accountBooking: string;
    bookingForUser: string;
    userIsBooking: string;
    name: string;
    title: string;
    packageId: string;
    packageAvailabilityId: string;
    hotelId: string;
    numberOfRoom: string;
    roomIds: string[];
    supplementId: string;
    tourId: string;
    transferId: string;
    totalPrice: number;
    tax: any;
    emailToNCT: string;
    bookingStatus: string;
    customerBookingInfos: any[];
}