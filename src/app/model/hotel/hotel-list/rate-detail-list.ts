import { CancelPoliciesInfos } from './cancel-policies-infos';
import { Rooms } from './rooms';

export class RateDetailList {
  public cancelPoliciesInfos: CancelPoliciesInfos;
  public hotelFees: any;
  public priceHT: any;
  public rateDetailCode: string;
  public remarks: string;
  public rooms: Rooms;
  public surcharges: any[];
  public taxesAndFees: any;
  public totalPrice: string;
}
