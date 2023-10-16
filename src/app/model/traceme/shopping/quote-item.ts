import { Benefit } from "./benefit";

export class QuoteItem {
    schemeId: string;
    name: string;
    premium: string;
    currency: string;
    benefits: Benefit[];
    discount: number;
}
