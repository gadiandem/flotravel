import { HotelInfo } from './hotel-info';
import { RateDetails } from './rate-details';

export class HotelResult {
  public hotelInfo: HotelInfo;
  public minPrice: string;
  public rateDetails: RateDetails;
}
