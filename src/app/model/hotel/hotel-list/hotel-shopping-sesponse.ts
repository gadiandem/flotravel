import { BaseResponse } from '../../common/base-response';
import { HotelInfo } from './hotel-info';
import {ExchangeResponse} from '../../wallet/deposit/exchange-rate-response';

export class HotelShoppingResponse extends BaseResponse {
  sessionId: string;
  currency: string;
  hotelInfoList: HotelInfo[];
  provider: string;
  exchangeRate: ExchangeResponse;
  traceId: string;
}
