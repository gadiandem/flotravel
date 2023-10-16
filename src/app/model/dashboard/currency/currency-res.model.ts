import { Currency } from './currency.model';

export class CurrenciesRes {
  error: string;
  status: string;
  message: string;
  result: Currency[];
}
