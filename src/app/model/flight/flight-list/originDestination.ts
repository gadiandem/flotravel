import { Flight } from './flight';
import { AuthResponse } from './auth-response';
import {ExchangeResponse} from '../../wallet/deposit/exchange-rate-response';

export class OriginDestination {
  flightList: Flight[];
  currency: string;
  executionId: string;
  provider: number; // 1: hahnAIr, 2: AERO_CRS, 3: ET
  type: number;
  exchangeRate: ExchangeResponse;
  traceId: string;
}
