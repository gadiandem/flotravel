import { User } from "../../auth/user/user";
import { TaxPackage } from "../provider/tax-package";
import { PackageShoppingRes } from './package-shopping-res';

export class OrderListItem {
    id: string;
    accountBooking : string;
    customer : string;
    agent : string;
    packageInfo : string;
    name: string;
    title: string;
    totalPrice: string;
    packageTax: TaxPackage;
    bookingStatus: string;
    createDate: string;
    startDate: string;
    amount: number;
    currency: string;
    currencyName: string;
    traceNumber: string;
    custom: string;
    status: string;
    payer: any;
    user : User;
    selectedPackage: PackageShoppingRes;
    refundedAmount: number;
    rooms: any[]
}
