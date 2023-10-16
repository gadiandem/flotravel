import { Eligibility } from "./eligibility";
import { Service } from "./service";
import { UnitPrice } from "./unit-price";

export class ALaCarteOfferItem {

   offerItemID: string;
   unitPrice: UnitPrice;
   service:Service;
   eligibility: Eligibility;
   
}