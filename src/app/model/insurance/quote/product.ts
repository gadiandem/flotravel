import { Guarantee } from '../subscription-policy/guarantee';
import { PriceQuoteRes } from './price-quote.res';

export class Product {

    quoteCode: string;
    packagePrice: number;
    promoCode: string;
    name: string;
    description: string;
    isDefaultProduct: string;
    prices: PriceQuoteRes;
    attachments: any[];
    consents: any[];
    disclaimers: any[];
    guarantees: Guarantee[];
    addonCodes: any[];
    risks: any[];
    travelersBreakdown: any[];

}