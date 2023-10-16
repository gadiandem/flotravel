import { CurrencyContext } from "./currency-context";
import { InsuranceTravel } from './insurance-travel';
import { ProductCriteria } from './product-criteria';
import { ProductInfo } from './product-info';

export class QuoteRequest {
  context: CurrencyContext;
  productCriteria: ProductCriteria;
  productInfo: ProductInfo;
  travel: InsuranceTravel;
}
