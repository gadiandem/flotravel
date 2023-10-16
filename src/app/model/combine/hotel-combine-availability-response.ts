import { AvailablePropertyRes } from '../hotel/hotel-cart/available-property-res';
import { SummaryPackageRes } from '../packages/consumer/summary-package-res';

export class HotelCombineAvailabilityResponse {
  hotelNuitee: AvailablePropertyRes;
  hotelNCT: SummaryPackageRes;
  hotelSimulator: AvailablePropertyRes;
  
}
