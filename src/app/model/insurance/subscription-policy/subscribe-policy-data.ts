import { QuoteRequest } from "../quote/quote.request";
import { QuoteResponse } from "../quote/quote.response";
import { SearchInsurancePackageReq } from "../search-insurance-package.req";
import { Guarantee } from "./guarantee";

export class SubscribePolicyData {
    currency: string;
    quoteCode: string;
    productCode: string;
    productName: string;
    guarantees: Guarantee[];
    priceAfterDiscountIncTax: number;
    quoteRequest : QuoteRequest;
    sessionId: string;
    id: string;
}