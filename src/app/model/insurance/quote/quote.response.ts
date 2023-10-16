import {CurrencyContext} from './currency-context';
import {Product} from './product';

export class QuoteResponse {
  context: CurrencyContext;
  products: Product[];
  packagePrice: number;
  addons: any[];
  risks: any[];
  quoteExpireAt: string;
  paymentModes: any[];
  preContractRequired: boolean;
  endDateAsString: string;
  errorObject: any;
  sessionId: string;
  id: string;
}
