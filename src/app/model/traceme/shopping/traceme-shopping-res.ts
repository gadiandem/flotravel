import { QuoteItem } from "./quote-item";

export class TraceMeShoppingRes {
    result: any;
    error: string;
    quoteId: number;
    quotes: QuoteItem[];
    title: string;
    description: string;
}