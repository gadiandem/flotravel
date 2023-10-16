export class PriceQuoteRes {
    formula: string;
    totalTaxes: number;
    countryTaxes: any[];
    priceBeforeDiscountInclTax: number;
    priceAfterDiscountInclTax: number;
    premiumAfterDiscountExclTax: number;
    totalDiscount: number;
    guaranteeClassPrices: any[];
    paymentPeriodicities: any[];
}