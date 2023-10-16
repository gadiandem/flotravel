import { TaxPackage } from "../provider/tax-package";

export class SummaryPackageRes {
    id: string;
    // packageTax: TaxPackage;
    basePrice: number;
    totalPrice: number;
    available: boolean;
    startDate: string
    itemCount: number;
}