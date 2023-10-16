export class OfferItem {
  owner: string;
  offerId: string;
  offerItemId: string;
  currency: string;

 // set total price of ET flight
  totalPriceOfFlight: number;

  baseAmount: number;
  taxes: number;
  totalAmount: number;
  services: string[];
  serviceNames: string;
  name: string;
  className: string;
  type: string;
  weightAllowance: any;
  pieceAllowances: any[];
}
