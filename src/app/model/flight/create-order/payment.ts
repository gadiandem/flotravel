export class Payment {
    type: string;
    amount: number;
    taxable: boolean;
    code: string;
    cardCode: string;
    cardHolderName: string;
    street: string[];
    city: string;
    postalCode: string;
    country: string;
}