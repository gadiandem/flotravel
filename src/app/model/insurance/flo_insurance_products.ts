import { CurrencyContext } from "./quote/currency-context";
import { Product } from "./quote/product";

export class FloInsuranceProducts {

  context: CurrencyContext;
  products: Product[];
  quoteExpiry: string;
  sessionId: string;
  packagePrice: number;
  maxDayCount: number;
  packageCurrency: string;
  packageId : string;
  preContractRequired: boolean;
  id : string;
  productCode : string;
 
}