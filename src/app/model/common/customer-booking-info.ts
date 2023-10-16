import { GENDER } from "../enum/gender";

export class CustomerBookingInfo {
    gender: GENDER;
    firstName: string;
    middleName: string;
    lastName: string;
    country: string;
    mobile: string;
    isNotify: boolean;
    passport: string;
    roomCode: string;
    countryName: string;
}