import { TotalAmount } from './total-amount';
import { CurrencyAmountOptType } from './currency-amount-opt-type';
import { FareFilingType } from './fare-filing-type';
import { DiscountType } from './discount-type';
import { Surcharges } from './sur-charges';
import { TaxDetailType } from './tax-detail-type';
import { TaxExemptionType } from './tax-exemption-type';
import { AwardPriceUnitType } from './award-price-unit-type';
import { CombinationPriceType } from './combination-price-type';
import { Fees } from './fees';

export class TotalPriceDetail {
  totalAmount: TotalAmount;
  baseAmount: CurrencyAmountOptType;
  fareFiledIn: FareFilingType;
  discount: DiscountType;
  surcharges: Surcharges;
  taxes: TaxDetailType;
  taxExemption: TaxExemptionType;
  awardPricing: AwardPriceUnitType;
  combinationPricing: CombinationPriceType;
  fees: Fees;
}
