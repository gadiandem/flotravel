import { HotelCombineAvailabilityResponse } from "../../combine/hotel-combine-availability-response";

export class AvailablePropertyRes {
  public confirmPropertyCode: string;
  public confirmBooking: boolean;
  public reserveBooking: boolean;
  // info response hotel simulator
  public tax: number;
  public basePrice: number;
  public totalPrice: number;
  public currency: string;
}
